import { Button, Checkbox } from "@mui/material";
import { api } from "~/app/utils/api";
import { Todo } from "~/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: Readonly<TodoProps>) {
  const { text, id, done } = todo;
  const trpc = api.useContext();

  const { mutate: doneMutation } = api.todo.toggle.useMutation({
    onMutate: async ({ id, done }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todo.all.cancel();

      // Snapshot the previous value
      const previousTodos = trpc.todo.all.getData();

      // Optimistically update to the new value
      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              done,
            };
          }
          return t;
        });
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },

    onSuccess: (err, { done }) => {
      if (done) {
        toast.success("Todo completed 🎉");
      }
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, done, context) => {
      toast.error(
        `An error occured when marking todo as ${done ? "done" : "undone"}`
      );
      if (!context) return;
      trpc.todo.all.setData(undefined, () => context.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onMutate: async (deleteId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todo.all.cancel();

      // Snapshot the previous value
      const previousTodos = trpc.todo.all.getData();

      // Optimistically update to the new value
      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.filter((t) => t.id !== deleteId);
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      toast.error(`An error occured when deleting todo`);
      if (!context) return;
      trpc.todo.all.setData(undefined, () => context.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Checkbox
            style={{
              cursor: "pointer",
              width: "1.25rem",
              height: "1.25rem",
              border: "1px solid #CBD5E0",
              borderRadius: "0.25rem",
              backgroundColor: "#F7FAFC",
            }}
            name="done"
            id={id}
            checked={done}
            onChange={(e) => {
              doneMutation({ id, done: e.target.checked });
            }}
          />
          <label
            htmlFor={id}
            style={{
              cursor: "pointer",
              textDecoration: done ? "line-through" : "none",
            }}
          >
            {text}
          </label>
        </div>
        <Button
          style={{
            color: "white",
            backgroundColor: "#1E40AF",
          }}
          onClick={() => {
            deleteMutation(id);
          }}
        >
          Delete
        </Button>
      </div>
      {/* toast container */}
      <ToastContainer position="top-center" autoClose={5000} theme="dark" />
    </>
  );
}
