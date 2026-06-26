import React, { createContext, useContext, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const addToast = useCallback((message, type = "error", duration = 4000) => {
    // Remove existing toast if any
    const existing = document.getElementById("auth-toast");
    if (existing) {
      existing.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.id = "auth-toast";
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.top = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%) translateY(-100px)";
    toast.style.background = type === "success" ? "#10b981" : "#ef4444";
    toast.style.color = "#ffffff";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "999px";
    toast.style.boxShadow = type === "success"
      ? "0 8px 30px rgba(16, 185, 129, 0.3)"
      : "0 8px 30px rgba(239, 68, 68, 0.3)";
    toast.style.fontWeight = "800";
    toast.style.fontSize = "0.9rem";
    toast.style.zIndex = "10000";
    toast.style.transition = "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)";

    document.body.appendChild(toast);

    // Slide down transition
    setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(0)";
    }, 10);

    // Slide up and remove transition
    setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(-100px)";
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
