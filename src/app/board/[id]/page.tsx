import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select()
    .eq("id", id)
    .single();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select()
    .eq("board_id", id);

  async function createPost(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const content = formData.get("newPost") as string;
    const { data, error } = await supabase
      .from("posts")
      .insert({ board_id: id, content, anonymous_name: "Anonymous" })
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    revalidatePath(`/board/${id}`);
  }

  return (
    <div>
      <div>
        <h1>{board.title}</h1>
      </div>
      <div>
        {posts && !posts.length
          ? "No posts yet!"
          : posts?.map((post) => {
              return (
                <div key={post.id}>
                  <div>{post.content}</div>
                  <div>{post.anonymous_name}</div>
                </div>
              );
            })}
      </div>
      <form action={createPost}>
        <label htmlFor="newPost">Post Title:</label>
        <input type="text" id="newPost" name="newPost" required />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
