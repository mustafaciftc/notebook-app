import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "http://10.0.2.2:5000/api/notes";

const initialState = {
  noteTable: [],
  editNote: {},
  isLoading: false,
  isSuccess: false,
  isEdit: false,
  isUpdate: false,
  isError: false,
  message: "",
  createData: {},
};

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (noteData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, noteData);
      return response.data;
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllNotes = createAsyncThunk(
  "notes/getAllNotes",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getNoteById = createAsyncThunk(
  "notes/getNoteById",
  async (noteId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${noteId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async (noteData, thunkAPI) => {
    try {
      let id = noteData.id;
      const response = await axios.put(`${API_URL}/${id}`, noteData);
      return response.data;
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (noteId, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/${noteId}`);
      return response.data;
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const noteTableSlice = createSlice({
  name: "noteState",
  initialState,
  reducers: {
    reset: (state) => {
      state.noteTable = [];
      state.editNote = {};
      state.isLoading = false;
      state.isSuccess = false;
      state.isEdit = false;
      state.isUpdate = false;
      state.isError = false;
      state.message = "";
      state.createData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNote.pending, (state) => {
        state.isUpdate = false;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isUpdate = true;
        state.createData = action.payload;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllNotes.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getAllNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isUpdate = false;
        state.noteTable = action.payload;
      })
      .addCase(getAllNotes.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getNoteById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.isEdit = true;
        state.editNote = action.payload;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateNote.pending, (state) => {
        state.isUpdate = false;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isUpdate = true;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteNote.pending, (state) => {
        state.isUpdate = false;
      })
      .addCase(deleteNote.fulfilled, (state) => {
        state.isUpdate = true;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = noteTableSlice.actions;
export default noteTableSlice.reducer;