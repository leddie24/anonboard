import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function CreateBoard() {
  async function createBoard(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const title = formData.get("title") as string;
    const { data, error } = await supabase
      .from("boards")
      .insert({ title })
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    redirect(`/board/${data.id}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-130 rounded-xl border border-neutral-800 bg-neutral-900 p-12">
        <h1 className="mb-8 text-[28px] font-bold tracking-tight">
          Create a Board
        </h1>

        <form action={createBoard}>
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
            type="submit"
            className="mt-6 w-full rounded-lg bg-white px-6 py-3 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
          >
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
}
