import { Message } from 'ai'; // Import Message type
import { useEffect, useRef, RefObject, useCallback } from "react";

export function useScrollToBottom<T extends HTMLElement>(
  messages: Array<Message>, // Add messages prop
  isLoading?: boolean
): [RefObject<T>, RefObject<T>] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const userScrolledRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (!isLoading && !userScrolledRef.current && endRef.current) {
      endRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  }, [isLoading]);

  // Effect for handling user scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      userScrolledRef.current = !isAtBottom;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect for auto-scrolling when messages change
  useEffect(() => {
    // Only scroll if not loading and user hasn't scrolled up
    if (!isLoading && !userScrolledRef.current) {
      // Scroll when new messages are added.
      // A small timeout can help ensure the DOM has updated.
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 50); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [messages.length, isLoading, scrollToBottom]); // Depend on messages.length and isLoading

  return [containerRef, endRef];
}
