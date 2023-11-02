"use client";
import { api } from "~/trpc/react";
import { LoadingSpinner } from "./loading";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export const Header = () => {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const { mutate } = api.todo.create.useMutation({
    onSuccess: () => {
      setTodo("");
      void utils.todo.getAll.invalidate();
    },
  });
  const [todo, setTodo] = useState("");

  if (!session) {
    return (
      <div className="flex justify-center border-b border-slate-400 p-2">
        <a href="/api/auth/signin">
          <button>Login</button>
        </a>
      </div>
    );
  }
  return (
    <div className="flex justify-center space-x-3 border-b border-slate-400 p-2">
      <button onClick={() => signOut()}>
        <img
          className="rounded-full"
          src={session.user.image!}
          alt=""
          height={32}
          width={32}
        />
      </button>{" "}
      <input
        className="grow bg-transparent outline-none"
        placeholder="Task"
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (todo !== "") {
              mutate({ content: todo });
            }
          }
        }}
      />
      <button className="text-2xl" onClick={() => mutate({ content: todo })}>
        +
      </button>
    </div>
  );
};
