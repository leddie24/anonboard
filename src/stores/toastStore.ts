import { create } from "zustand";

let nextId = 0;

export type ToastType = "error" | "success" | "warning";

export interface IToast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastStore {
  items: IToast[];
  addToast: (item: Pick<IToast, "message" | "type">) => void;
  removeToast: (toastId: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  items: [],

  addToast: (item: Pick<IToast, "message" | "type">) =>
    set((state) => ({
      items: state.items.concat([
        {
          id: nextId++,
          ...item,
        },
      ]),
    })),

  removeToast: (toastId: number) =>
    set((state) => ({
      items: state.items.filter((curItem) => curItem.id !== toastId),
    })),
}));
