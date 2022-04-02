import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v1 as uuid } from "uuid";

export interface Todo {
  id: string;
  desc: string;
  isComplete: boolean;
}

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true,
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false,
  },
];

// createSlice() basically combines createAction() and createReducer()
export const todosSlice = createSlice({
  name: "todos",
  initialState: todosInitialState, // non-primitive value here
  reducers: {
    // Action Creation + Reducer definition done together
    create: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(payload);
      },
      // reducer needs to be pure, just sticking to one operation! But if we create random ID inside reducer, that is an anti-pattern. So we are using `prepare` here.

      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const todoToEdit = state.find((todo) => todo.id === payload.id);
      if (todoToEdit) {
        todoToEdit.desc = payload.desc;
      }
    },
    toggle: (
      state,
      { payload }: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const todoToToggle = state.find((todo) => todo.id === payload.id);
      if (todoToToggle) {
        todoToToggle.isComplete = payload.isComplete;
      }
    },

    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const todoToRemoveIndex = state.findIndex(
        (todo) => todo.id === payload.id
      );
      if (todoToRemoveIndex != -1) {
        state.splice(todoToRemoveIndex, 1);
      }
    },
  },
});

// Export action with names to be called from index.tsx
// index.tsx will use the values inside key-value pairs to access the reducer actions
export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const todosReducer = todosSlice.reducer;
