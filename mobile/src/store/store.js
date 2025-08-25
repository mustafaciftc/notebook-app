import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "./notesSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    noteState: noteReducer,
    auth: authReducer,
  },
});

export default store;
