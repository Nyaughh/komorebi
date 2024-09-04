"use client";

import { useState } from "react";

// Remove this line
// import { api } from "@/trpc/react";

export function LatestPost() {
  // Remove tRPC query
  // const [latestPost] = api.post.getLatest.useSuspenseQuery();

  // Remove tRPC utils and mutation
  // const utils = api.useUtils();
  const [name, setName] = useState("");
  // const createPost = api.post.create.useMutation({
  //   onSuccess: async () => {
  //     await utils.post.invalidate();
  //     setName("");
  //   },
  // });

  return (
    <div className="w-full max-w-xs">
      {/* Remove latestPost conditional rendering */}
      <p>You have no posts yet.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Remove createPost.mutate
          console.log("Submitted:", name);
          setName("");
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          // Remove createPost.isPending
        >
          Submit
        </button>
      </form>
    </div>
  );
}
