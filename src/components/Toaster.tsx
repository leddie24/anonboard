"use client";

import { IToast, ToastType, useToastStore } from "@/stores/toastStore";
import React from "react";

const toastStyles: Record<ToastType, string> = {
  success:
    "border-green-500/30 bg-green-500/10 text-green-400",
  error:
    "border-red-500/30 bg-red-500/10 text-red-400",
  warning:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
};

export default function Toaster() {
  const toasts = useToastStore((state) => state.items);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

export const Toast = (props: IToast) => {
  const removeToast = useToastStore((state) => state.removeToast);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(props.id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [props.id, removeToast]);

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${toastStyles[props.type]}`}
    >
      <span className="flex-1">{props.message}</span>
      <button
        onClick={() => removeToast(props.id)}
        className="ml-2 opacity-50 transition-opacity hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};
