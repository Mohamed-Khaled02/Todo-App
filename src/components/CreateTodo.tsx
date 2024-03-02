import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { todoInput } from "~/types";
import { Todo } from "~/types";
import { api } from "~/app/utils/api";
import "react-toastify/dist/ReactToastify.css";

const CreateTodo = () => {
  const [newTodo, setNewTodo] = useState("");

  const trpc = api.useContext();

  const { mutate } = api.todo.create.useMutation({
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await trpc.todo.all.cancel();

      // Snapshot the previous value
      const previousTodos = trpc.todo.all.getData();

      // Optimistically update to the new value
      trpc.todo.all.setData(undefined, (prev) => {
        const optimisticTodo: Todo = {
          id: "optimistic-todo-id",
          text: newTodo, // 'placeholder'
          done: false,
        };
        if (!prev) return [optimisticTodo];
        return [...prev, optimisticTodo];
      });

      // Clear input
      setNewTodo("");

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      toast.error("An error occured when creating todo");
      // Clear input
      setNewTodo(newTodo);
      if (!context) return;
      trpc.todo.all.setData(undefined, () => context.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: async () => {
      console.log("SETTLED");
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const result = todoInput.safeParse(newTodo);

            if (!result.success) {
              toast.error(result.error.format()._errors.join("\n"));
              return;
            }

            mutate(newTodo);
          }}
          style={{ display: "flex", gap: "8px" }}
        >
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="New Todo..."
            id="new-todo"
            name="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray.300",
                },
                "&:hover fieldset": {
                  borderColor: "blue.500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "blue.500",
                  borderWidth: 2,
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              "&:hover": {
                backgroundColor: "blue.800",
              },
            }}
          >
            Create
          </Button>
        </form>
      </div>
      {/* toast container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default CreateTodo;
