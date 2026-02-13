"use client";
import { useActionState } from "react";

interface ICreateBoardForm {
  createBoard: (
    prevState: CreateBoardResult | null,
    formData: FormData,
  ) => Promise<CreateBoardResult>;
}

export type CreateBoardResult = { success: boolean; error?: string };

export default function CreateBoardForm(props: ICreateBoardForm) {
  const { createBoard } = props;
  const [state, formAction, isPending] = useActionState<
    CreateBoardResult | null,
    FormData
  >(createBoard, null);

  return (
    <form action={formAction}>
      {state?.error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
        >
          {state.error}
        </div>
      )}

      <div className="mb-5">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-neutral-400"
        >
          Board Title
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g., Tech Discussions, Random Thoughts..."
          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-[15px] text-white transition-colors focus:border-neutral-600 focus:bg-neutral-900 focus:outline-none"
        />
      </div>
      <button
        disabled={isPending}
        type="submit"
        className="mt-6 w-full rounded-lg bg-white px-6 py-3 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
      >
        Create Board
      </button>
    </form>
  );
}
