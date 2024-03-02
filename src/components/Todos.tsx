import React from "react";
import { api } from "~/app/utils/api";
import Todo from "./Todo";
const Todos = () => {
  const { data: todos, isLoading, isError } = api.todo.all.useQuery();
  if (isLoading) return <div>Loading todos 🔄</div>;
  if (isError) return <div>Sorry, something went wrong ❌</div>;
  return (
    <>
      {todos.length > 0 ? (
        todos.map((todo) => {
          return <Todo key={todo.id} todo={todo} />;
        })
      ) : (
        <p>Create your first todo...</p>
      )}
    </>
  );
};

export default Todos;
