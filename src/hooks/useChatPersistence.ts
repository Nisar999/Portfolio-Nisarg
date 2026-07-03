"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Type definition for chat messages
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "nisarg_chat_messages";

/**
 * Custom hook for persisting chat messages to localStorage
 * Gracefully handles localStorage errors - chat still works even if storage is unavailable
 *
 * @example
 * ```tsx
 * const { messages, saveMessages, clearMessages } = useChatPersistence();
 * ```
 *
 * @returns {Object} Object containing:
 *   - messages: Array of ChatMessage objects
 *   - saveMessages: Function to save messages to localStorage
 *   - clearMessages: Function to clear all messages
 */
export function useChatPersistence() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Load persisted messages from localStorage on mount
   */
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setMessages(parsed);
          }
        }
      }
    } catch (error) {
      // localStorage unavailable or parsing failed - silently continue
      console.debug("Chat persistence: localStorage unavailable", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Save messages to localStorage
   */
  const saveMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
      }
    } catch (error) {
      // localStorage unavailable - chat still works, just not persisted
      console.debug("Chat persistence: unable to save to localStorage", error);
    }
  }, []);

  /**
   * Clear all messages from state and localStorage
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.debug("Chat persistence: unable to clear localStorage", error);
    }
  }, []);

  return {
    messages,
    saveMessages,
    clearMessages,
    isLoaded,
  };
}
