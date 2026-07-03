"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaXmark, FaPaperPlane } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useChatPersistence, useMotionPreference, useMount } from "@/hooks";

// Define message type manually since we aren't using the SDK hook
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const isMounted = useMount();
    const { messages: persistedMessages, saveMessages } = useChatPersistence();
    const prefersReducedMotion = useMotionPreference();
    
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [retryCount, setRetryCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load persisted messages on mount
    useEffect(() => {
        if (isMounted && persistedMessages.length > 0) {
            setMessages(persistedMessages);
        }
    }, [isMounted, persistedMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Clear previous error
        setError("");

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages.map(m => ({
            ...m,
            timestamp: m.id ? parseInt(m.id) : Date.now(),
        })));
        setInput("");
        setIsLoading(true);

        // Create abort controller for 30-second timeout
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => {
            abortControllerRef.current?.abort();
        }, 30000);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                }),
                signal: abortControllerRef.current.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`);
            }

            const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content,
            };

            const newMessages = [...updatedMessages, botMessage];
            setMessages(newMessages);
            saveMessages(newMessages.map(m => ({
                ...m,
                timestamp: m.id ? parseInt(m.id) : Date.now(),
            })));
            setRetryCount(0); // Reset retry count on success
            setError(""); // Clear any previous errors
        } catch (error: any) {
            clearTimeout(timeoutId);
            
            let errorMessage = "Sorry, I'm having trouble connecting to Nisarg's brain right now.";
            
            // Handle different error types
            if (error.name === "AbortError") {
                errorMessage = "Request timed out after 30 seconds. Please check your connection and try again.";
            } else if (error instanceof TypeError) {
                errorMessage = "Network error: Unable to reach the server. Please check your internet connection.";
            } else if (error.message?.includes("API Error")) {
                errorMessage = `Connection failed: ${error.message}`;
            }

            setError(errorMessage);
            setRetryCount(prev => prev + 1);

            // Suggest checking network if multiple failures
            if (retryCount >= 1) {
                setError(prev => `${prev}\n\n📡 Tip: Please check your internet connection and try again.`);
            }

            // Still add error message to chat history
            const errorBot: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMessage,
            };
            const newMessages = [...updatedMessages, errorBot];
            setMessages(newMessages);
            saveMessages(newMessages.map(m => ({
                ...m,
                timestamp: m.id ? parseInt(m.id) : Date.now(),
            })));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
                        className="w-[350px] md:w-[400px] h-[500px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4"
                        id="chat-widget"
                        role="dialog"
                        aria-label="Chat with Milly AI assistant"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 flex-shrink-0">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 blur-[2px] opacity-70" />
                                    <div className="relative w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-purple-400 to-blue-400">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm relative">
                                            <video
                                                src="/Mily_animated_logo.mp4"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="w-full h-full object-cover"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">Milly</h3>
                                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Not Offline
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Close chat"
                            >
                                <FaXmark />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                            data-lenis-prevent
                            role="log"
                            aria-live="polite"
                            aria-label="Chat messages"
                        >
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 text-sm mt-10">
                                    <p>👋 Hi! Im Nisarg&apos;s AI assistant.</p>
                                    <p className="mt-2">Ask me anything about his projects, skills, or experience!</p>
                                </div>
                            )}
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white/10 text-gray-100 rounded-bl-none border border-white/5"
                                            }`}
                                    >
                                        <ReactMarkdown
                                            components={{
                                                strong: ({ node, ...props }: any) => <span className="font-bold text-white" {...props} />,
                                                ul: ({ node, ...props }: any) => <ul className="list-disc list-inside space-y-1" {...props} />,
                                                li: ({ node, ...props }: any) => <li className="ml-2" {...props} />
                                            }}
                                        >
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start" role="status" aria-live="assertive" aria-label="Assistant is typing">
                                    <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 border border-white/5">
                                        <div className="flex gap-1">
                                            <motion.span
                                                animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
                                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, repeat: Infinity, delay: 0 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                            <motion.span
                                                animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
                                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                            <motion.span
                                                animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
                                                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSend}
                            className="p-3 border-t border-white/10 bg-black/40 flex flex-col gap-2"
                        >
                            {error && (
                                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2 whitespace-pre-wrap">
                                    {error}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask something..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                    aria-label="Chat message input"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                                    aria-label={error ? "Retry sending message" : "Send message"}
                                >
                                    <FaPaperPlane className="text-xs" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-14 h-14 rounded-full flex items-center justify-center z-50 group"
                aria-label={isOpen ? "Close chat widget" : "Open chat with Nisarg's AI assistant"}
                aria-expanded={isOpen}
                aria-controls="chat-widget"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Gradient Ring */}
                <div className="relative w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-purple-400 via-white/50 to-blue-400">
                    {/* Glassy Inner Context */}
                    <div className="w-full h-full rounded-full bg-black/60 backdrop-blur-md overflow-hidden relative flex items-center justify-center border border-white/10">
                        {isOpen ? <FaXmark className="text-xl text-white" /> : (
                            <video
                                src="/Mily_animated_logo.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                aria-hidden="true"
                            />
                        )}
                    </div>
                </div>
            </motion.button>
        </div>
    );
}
