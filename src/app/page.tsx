"use client";

import { CreatePost } from "~/app/_components/create-post";
import { Header } from "./_components/Header";
import { api } from "~/trpc/react";
import type { Todo } from "@prisma/client";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "./_components/loading";

export default function Home() {
  const { data, isLoading } = api.todo.getAll.useQuery();
  const session = useSession();

  return (
    <div className="">
      <Header></Header>
      {data?.map((todo) => {
        return <Todo todo={todo} authenticated={!!session.data?.user} />;
      })}
    </div>
  );
}

const Todo = (props: { todo: Todo; authenticated: boolean }) => {
  const { mutate: deleteTodo, isLoading: isDeleting } =
    api.todo.delete.useMutation({
      onSuccess: () => (props.todo.id = undefined!),
    });
  const { mutate: toggleDone, isLoading: isUpdating } =
    api.todo.updateDone.useMutation({
      onSuccess: () => (props.todo.done = !props.todo.done),
    });

  if (props.todo.id == undefined) {
    return null;
  }

  return (
    <div
      key={props.todo.id}
      className="flex flex-row justify-between border-b border-slate-400 p-2"
    >
      <div>
        <h1 className="text-xl">{props.todo.content}</h1>
        <p>
          Status: {props.todo.done ? <span>Done</span> : <span> Pending </span>}
        </p>
      </div>
      <div>
        <button>
          {props.todo.done ? (
            <button
              className="m-2 rounded-md bg-orange-900 p-2 text-slate-300"
              onClick={() =>
                toggleDone({ id: props.todo.id, done: props.todo.done })
              }
            >
              {isUpdating ? <LoadingSpinner /> : "Undo"}
            </button>
          ) : (
            <button
              className="m-2 rounded-md bg-green-900 p-2 text-slate-300"
              onClick={() =>
                toggleDone({ id: props.todo.id, done: props.todo.done })
              }
            >
              {isUpdating ? <LoadingSpinner /> : "Done"}
            </button>
          )}
        </button>
        {props.authenticated ? (
          <button
            className="m-2 rounded-md bg-red-900 p-2 text-slate-300"
            onClick={() => deleteTodo({ id: props.todo.id })}
          >
            {isDeleting ? <LoadingSpinner /> : "Delete"}
          </button>
        ) : (
          null
        )}
      </div>
    </div>
  );
};
