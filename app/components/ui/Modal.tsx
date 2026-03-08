"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { AnimatePresence, motion } from "framer-motion";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactDOM from "react-dom";

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  height?: string | number;
  width?: string | number;
  radius?: number;
  withCloseButton?: boolean;
  withDragHandle?: boolean;
  swipeToClose?: boolean;
  transitionDuration?: number;
  closeOnClickOutside?: boolean;
  className?: string;
  contentClassName?: string;
  isCenter?: boolean;
  mobileBreakpoint?: number;
  overlayClassName?: string;
  lockScroll?: boolean;
}

// Shared portal container - created once and reused
let sharedPortalContainer: HTMLElement | null = null;

function getPortalContainer(): HTMLElement {
  if (typeof window === "undefined") return null as unknown as HTMLElement;
  if (!sharedPortalContainer) {
    sharedPortalContainer = document.getElementById("responsive-modal-portal");
    if (!sharedPortalContainer) {
      sharedPortalContainer = document.createElement("div");
      sharedPortalContainer.id = "responsive-modal-portal";
      document.body.appendChild(sharedPortalContainer);
    }
  }
  return sharedPortalContainer;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title = "",
  height = "auto",
  width = "auto",
  radius = 16,
  withCloseButton = true,
  swipeToClose = false,
  transitionDuration = 400,
  closeOnClickOutside = true,
  className,
  contentClassName,
  isCenter = false,
  mobileBreakpoint = 768,
  overlayClassName,
  lockScroll = true,
}: ResponsiveModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollYRef = useRef<number>(0);

  // Create portal container on mount - optimized
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle resize with debouncing to prevent excessive updates
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Initial check
    checkMobile();

    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        checkMobile();
      }, 150); // Debounce resize events
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [mobileBreakpoint]);

  // Optimized body scroll lock - only runs when modal opens/closes
  useEffect(() => {
    if (!isOpen || !lockScroll) return;

    // Save scroll position once
    scrollYRef.current = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Use CSS class for better performance
    document.body.classList.add("modal-open");

    // Apply inline styles only for scroll position and padding
    document.body.style.top = `-${scrollYRef.current}px`;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      document.body.style.paddingRight = "";

      // Restore scroll position
      if (scrollYRef.current) {
        window.scrollTo(0, scrollYRef.current);
      }
    };
  }, [isOpen, lockScroll]);

  // Memoized click handler to prevent re-renders
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnClickOutside && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnClickOutside, onClose],
  );

  // Close on Escape - memoized callback
  const handleEscape = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleEscape]);

  // Memoize computed values to prevent recalculation on every render
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const shouldCenter = useMemo(
    () => isCenter || !isMobile,
    [isCenter, isMobile],
  );
  const isFullHeight = useMemo(() => height === "100vh", [height]);

  const modalVariants = useMemo(
    () => ({
      hidden: shouldCenter
        ? { opacity: 0, scale: 0.8, y: 0 }
        : { opacity: 0, y: "100%" },
      visible: shouldCenter
        ? { opacity: 1, scale: 1, y: 0 }
        : { opacity: 1, y: 0 },
      exit: shouldCenter
        ? { opacity: 0, scale: 0.8, y: 0 }
        : { opacity: 0, y: "100%" },
    }),
    [shouldCenter],
  );

  // Memoize modal height calculation
  const modalHeight = useMemo(() => {
    if (typeof height === "string") {
      return height;
    }
    if (typeof height === "number") {
      return `${height}px`;
    }
    return "auto";
  }, [height]);

  const hasExplicitHeight = modalHeight !== "auto";

  // Memoize transition config
  const transitionConfig = useMemo(
    () => ({
      duration: transitionDuration / 1000,
    }),
    [transitionDuration],
  );

  // Early returns AFTER all hooks
  if (!isMounted) {
    return null;
  }

  // Get portal container - use shared instance
  const portalContainer = getPortalContainer();

  if (!portalContainer) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "fixed inset-0 flex z-[99999999] font-inter",
            overlayClassName || "bg-black/80 backdrop-blur-sm",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitionConfig}
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <motion.div
            className={cn(
              "bg-[#222831] text-white flex flex-col border border-white/10 shadow-2xl",
              shouldCenter ? "m-auto" : "mt-auto w-full",
              className,
            )}
            style={{
              borderRadius: shouldCenter
                ? `${radius}px`
                : isFullHeight
                  ? "0"
                  : `${radius}px ${radius}px 0 0`,
              width: shouldCenter ? width : "100%",
              height: hasExplicitHeight ? modalHeight : "auto",
              maxHeight: shouldCenter
                ? "90vh"
                : isFullHeight
                  ? "100vh"
                  : "90vh",
              maxWidth: shouldCenter ? "90vw" : "100%",
              // Important: set overflow to hidden at modal level
              overflow: "hidden",
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{
              type: "tween",
              ease: "easeOut",
              ...transitionConfig,
            }}
          >
            {swipeToClose && !shouldCenter && (
              <div className="w-full flex justify-center py-2 flex-shrink-0">
                <div className="w-10 h-1 bg-white/20 rounded-full"></div>
              </div>
            )}

            {title && (
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center flex-shrink-0 font-inter bg-[#1a1c1e]">
                <h3 className="font-bold text-accent tracking-wider uppercase text-xs">
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  {!shouldCenter && swipeToClose && (
                    <div className="flex items-center gap-1 text-text-light/40 text-sm">
                      <span>Swipe to close</span>
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ y: [0, 3, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path
                          d="M5.33317 8.66602L7.99984 11.3327L10.6665 8.66602M5.33317 4.66602L7.99984 7.33268L10.6665 4.66602"
                          className="stroke-text-light/40"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </div>
                  )}
                  {withCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-md hover:bg-white/10 text-text-light/60 hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Replace Mantine ScrollArea with native scrollable div */}
            <div
              ref={scrollRef}
              className={cn("px-6 py-6", contentClassName)}
              style={{
                flex: "1 1 auto",
                overflowY: "auto",
                overflowX: "hidden",
                // Enable momentum scrolling on iOS
                WebkitOverflowScrolling: "touch",
                // Ensure content is scrollable
                minHeight: 0,
                // Add some padding at the bottom for iOS safe area
                paddingBottom: "env(safe-area-inset-bottom, 24px)",
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalContainer,
  );
}
