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
    <form action={createBoard}>
      <label htmlFor="title">Title:</label>
      <input id="title" name="title" required />
      <button type="submit">Create Board</button>
    </form>
  );
}
