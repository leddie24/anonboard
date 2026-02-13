import CreateBoardForm, {
  CreateBoardResult,
} from "@/components/CreateBoardForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function CreateBoard() {
  async function createBoard(
    prevState: CreateBoardResult | null,
    formData: FormData,
  ): Promise<CreateBoardResult> {
    "use server";

    const supabase = await createClient();
    const title = formData.get("title") as string;
    const { data, error } = await supabase
      .from("boards")
      .insert({ title })
      .select()
      .single();

    if (error) {
      console.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    redirect(`/board/${data.id}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-130 rounded-xl border border-neutral-800 bg-neutral-900 p-12">
        <h1 className="mb-8 text-[28px] font-bold tracking-tight">
          Create a Board
        </h1>

        <CreateBoardForm createBoard={createBoard} />
      </div>
    </div>
  );
}
