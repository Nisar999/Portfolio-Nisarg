# Design Document: Portfolio Improvements

## Overview

This design document outlines the implementation strategy for improving the portfolio application across four key areas:

1. **Hydration Fix**: Resolve LoadingContext mismatch by ensuring server and client render identically
2. **Accessibility Improvements**: Add alt text, semantic HTML, ARIA labels, and keyboard navigation
3. **Chat Widget Enhancement**: Add message persistence, typing indicators, and error recovery
4. **Performance Optimization**: Optimize images, respect motion preferences, and implement lazy loading

The design uses a modular approach where each improvement can be implemented independently but works cohesively with the others. TypeScript with React hooks and Next.js App Router patterns are used throughout.

## Architecture

### Hydration Fix Architecture

The hydration mismatch occurs because LoadingContext initializes with `useState(true)` on the client, but the server doesn't have this initial state. The solution is to:

1. Use a persistent initial state that matches server-side rendering
2. Implement a `useMount` hook to handle client-only code safely
3. Ensure context consumer components don't render different content during hydration vs. post-hydration

**Flow:**
```
Server Render → LoadingContext.Provider with initial state → HTML sent
Browser Hydrate → LoadingContext renders with same initial state → No mismatch
Client Render → useMount signals hydration complete → Loading state updates
```

### Accessibility Architecture

Accessibility improvements are implemented at three levels:

1. **Semantic Structure**: Replace `<div>` containers with semantic elements (`<nav>`, `<main>`, `<section>`)
2. **Image Alt Text**: Add descriptive alt attributes to all images following WCAG guidelines
3. **ARIA Attributes**: Add ARIA labels, roles, and live regions for screen readers

**Implementation Locations:**
- Layout components: Add semantic wrappers to page structure
- Image components: Ensure all Image components have meaningful alt text
- Interactive components: Add aria-label, aria-expanded, aria-current as needed
- Chat widget: Add aria-live regions for message updates

### Chat Widget Enhancement Architecture

The chat widget is enhanced through three mechanisms:

1. **Persistence Layer**: LocalStorage operations wrapped in a custom hook
2. **UI State Management**: Separate states for messages, loading, and error conditions
3. **Error Boundary**: Try-catch blocks with user-friendly error messages

**Flow:**
```
User sends message → Save to localStorage → Send to API
API responds → Update messages → Save to localStorage
If error → Display error message → Enable retry
On page reload → Load from localStorage → Display previous messages
```

### Performance Architecture

Performance optimizations use:

1. **Image Optimization**: Next.js Image component with `sizes` prop, lazy loading, and modern formats
2. **Motion Detection**: CSS media query `prefers-reduced-motion` with Framer Motion support
3. **Code Splitting**: Dynamic imports for heavy components
4. **Lazy Loading**: Intersection Observer for scroll-triggered component loading

## Components and Interfaces

### 1. Enhanced LoadingContext

```typescript
// src/context/LoadingContext.tsx
interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    isMounted: boolean;  // New: tracks hydration completion
}

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);  // Start false to match server
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, isMounted }}>
            {children}
        </LoadingContext.Provider>
    );
}
```

**Explanation**: The context now tracks both loading state and hydration completion. Initial loading state is `false` (matches server). After hydration completes, components can safely use `isMounted` to avoid conditional rendering during hydration.

### 2. Chat Widget with Persistence

```typescript
// src/components/ChatWidget.tsx
interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

// Custom hooks for persistence
function useChatPersistence() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    
    useEffect(() => {
        const saved = localStorage.getItem('chat_messages');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load messages', e);
            }
        }
    }, []);
    
    const saveMessages = (msgs: ChatMessage[]) => {
        setMessages(msgs);
        localStorage.setItem('chat_messages', JSON.stringify(msgs));
    };
    
    return { messages, saveMessages };
}
```

**Explanation**: A custom hook manages message persistence. Messages are loaded on component mount and saved to localStorage on every update.

### 3. Enhanced Image Component Wrapper

```typescript
// src/components/OptimizedImage.tsx
interface OptimizedImageProps {
    src: string;
    alt: string;  // Required and must be meaningful
    width?: number;
    height?: number;
    lazy?: boolean;
    priority?: boolean;
}

export function OptimizedImage({
    src,
    alt,
    lazy = true,
    priority = false,
    ...props
}: OptimizedImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            loading={lazy ? 'lazy' : 'eager'}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            {...props}
        />
    );
}
```

**Explanation**: A wrapper component enforces alt text requirement and provides sensible defaults for lazy loading and responsive sizing.

### 4. Motion Preferences Hook

```typescript
// src/hooks/useMotionPreference.ts
export function useMotionPreference() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        
        const handler = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };
        
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    
    return prefersReducedMotion;
}
```

**Explanation**: This hook detects the user's motion preference and updates reactively. Components using this can disable animations or substitute them with instant state changes.

### 5. Lazy Loading Component

```typescript
// src/components/LazySection.tsx
interface LazySectionProps {
    children: ReactNode;
    threshold?: number;
    fallback?: ReactNode;
}

export function LazySection({
    children,
    threshold = 0.1,
    fallback = null
}: LazySectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );
        
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    
    return (
        <div ref={ref}>
            {isVisible ? children : fallback}
        </div>
    );
}
```

**Explanation**: A wrapper that uses Intersection Observer to detect when a section enters the viewport and renders children only then.

## Data Models

### Chat Message Model

```typescript
interface ChatMessage {
    id: string;              // Unique identifier (timestamp or UUID)
    role: 'user' | 'assistant';
    content: string;         // Markdown-formatted message content
    timestamp: number;       // Unix timestamp for ordering
    status?: 'pending' | 'sent' | 'error';  // Message delivery status
}

interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: number;
}
```

### LoadingContext State

```typescript
interface LoadingContextType {
    isLoading: boolean;      // Global loading state
    setIsLoading: (value: boolean) => void;
    isMounted: boolean;      // Hydration completion flag
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Assessment: Is Property-Based Testing Applicable?

This feature involves multiple components with different characteristics:
- **Pure functions**: Chat message persistence, ARIA generation, image optimization
- **State management**: LoadingContext, chat state
- **Browser APIs**: LocalStorage, Intersection Observer
- **Animations**: Framer Motion with motion preferences

Some aspects are suitable for property-based testing (message persistence round-trips, ARIA generation), while others are better tested with integration tests (accessibility, animations, browser APIs). We will use a **hybrid approach** with properties for data-level correctness and integration tests for UI/browser behavior.

### Property 1: Chat Message Persistence Round-Trip

*For any* chat message with valid content and role, saving it to localStorage and then retrieving it SHALL produce an equivalent message object (with possible timestamp variations).

**Validates: Requirements 4.1, 4.2**

### Property 2: Hydration State Consistency

*For any* initial render, the LoadingContext value on the client after hydration SHALL match the server-rendered initial state to prevent hydration mismatches.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 3: Motion Preference Idempotence

*For any* state where motion preferences are queried, calling the motion preference detection multiple times SHALL return consistent results until the system preference changes.

**Validates: Requirement 8.1, 8.3**

### Property 4: Image Alt Text Presence

*For any* image rendered through OptimizedImage component, the alt attribute SHALL be non-empty and provided by the caller (enforced at TypeScript level).

**Validates: Requirement 2.1, 2.2**

### Property 5: Message Ordering Preservation

*For any* sequence of messages added to the chat, retrieving all messages from localStorage and from memory SHALL maintain the same ordering by timestamp.

**Validates: Requirement 4.1, 4.4**

## Error Handling

### Hydration Errors

- **Error**: Context accessed outside provider
- **Handling**: Throw clear error message: "useLoading must be used within a LoadingProvider"

### Chat API Errors

- **Error**: API request fails
- **Handling**: Display user-friendly error message, keep send button enabled for retry
- **Error**: Network timeout (>30s)
- **Handling**: Show timeout error, suggest checking connection

### LocalStorage Errors

- **Error**: LocalStorage is full or unavailable
- **Handling**: Log to console, continue chat without persistence
- **Error**: Corrupted JSON in localStorage
- **Handling**: Clear corrupted data, start fresh conversation

### Image Loading Errors

- **Error**: Image fails to load
- **Handling**: Display placeholder, alt text still visible
- **Error**: Unsupported browser for modern formats
- **Handling**: Serve JPEG fallback automatically through Next.js Image

## Testing Strategy

### Unit Tests (Non-Optional)

1. **LoadingContext Tests**
   - Test context initialization and synchronization
   - Test useLoading hook error when used outside provider
   - Test isMounted flag transitions

2. **Chat Persistence Tests**
   - Test message saving to localStorage
   - Test message retrieval on component mount
   - Test error handling when localStorage is unavailable

3. **Motion Preference Tests**
   - Test detection of prefers-reduced-motion query
   - Test event listener attachment and cleanup
   - Test state updates on preference changes

### Property-Based Tests (Optional - Tagged with *)

1. **Chat Message Persistence** (Property 1)
   - Generate random messages with valid content and roles
   - Save and retrieve, verify equivalence
   - Min 100 iterations

2. **Message Ordering** (Property 5)
   - Generate sequences of messages with random content
   - Verify ordering is preserved after save/load
   - Min 100 iterations

3. **Hydration Consistency** (Property 2)
   - Verify server and client initial states match
   - Test multiple rapid renders
   - Min 100 iterations

### Integration Tests (Non-Optional)

1. **Chat Widget E2E**
   - Send message → verify API call → verify response appears
   - Close/reopen widget → verify messages persist
   - Network failure → verify error message and retry capability

2. **Accessibility E2E**
   - Run accessibility audit with axe-core
   - Test keyboard navigation through interactive elements
   - Test screen reader announcements with NVDA or JAWS simulation

3. **Performance E2E**
   - Measure image loading times
   - Verify lazy loading defers non-visible images
   - Verify animations respect prefers-reduced-motion

### Manual Testing Checklist

- [ ] No hydration warnings in browser console
- [ ] Chat widget displays previously sent messages on reload
- [ ] Typing indicators appear while API processes
- [ ] Error messages are clear and actionable
- [ ] Images load with appropriate sizes for viewport
- [ ] Animations disabled when prefers-reduced-motion is set
- [ ] All buttons and links have descriptive labels
- [ ] Page is navigable with keyboard only
- [ ] Screen reader announces interactive elements correctly

