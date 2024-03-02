import { Button, Checkbox } from "@mui/material";
import type { Todo } from "../types";
import { api } from "~/app/utils/api";

type TodoProps = {
  todo: Todo;
};
export default function Todo({ todo }: any) {
  const { text, id, done } = todo;

  return (
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
          //   onChange={(e) => {
          //     doneMutation({ id, done: e.target.checked });
          //   }}
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
        // onClick={() => {
        //   deleteMutation(id);
        // }}
      >
        Delete
      </Button>
    </div>
  );
}
