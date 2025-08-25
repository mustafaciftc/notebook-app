import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://10.0.2.2:5000/api/users";

class SimpleStorage {
  constructor() {
    this.storage = new Map();
  }

  async setItem(key, value) {
    try {
      this.storage.set(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getItem(key) {
    try {
      const value = this.storage.get(key);
      return Promise.resolve(value || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async removeItem(key) {
    try {
      this.storage.delete(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async clear() {
    try {
      this.storage.clear();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const storage = new SimpleStorage();

const initialState = {
  user: null,
  token: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  isAuthenticated: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      
      await storage.setItem("userToken", response.data.data.token);
      await storage.setItem("user", JSON.stringify(response.data.data.user));
      
      return {
        user: response.data.data.user,
        token: response.data.data.token,
        message: response.data.message || "Kayıt başarılı"
      };
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        "Kayıt işleminde bir hata oluştu";
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      
      await storage.setItem("userToken", response.data.token);
      await storage.setItem("user", JSON.stringify(response.data.user));
      
      return {
        user: response.data.user,
        token: response.data.token,
        message: response.data.message || "Giriş başarılı"
      };
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        error.message || 
        "Giriş işleminde bir hata oluştu";
      return rejectWithValue(message);
    }
  }
);

export const loadUserData = createAsyncThunk(
  "auth/loadUserData",
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getItem("userToken");
      const userData = await storage.getItem("user");
      
      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData)
        };
      }
      
      return { token: null, user: null };
    } catch (error) {
      console.error("Kullanıcı verisi yüklenirken hata:", error);
      return rejectWithValue("Kullanıcı verisi yüklenemedi");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await storage.removeItem("userToken");
      await storage.removeItem("user");
      
      return { message: "Başarıyla çıkış yapıldı" };
    } catch (error) {
      console.error("Çıkış işleminde hata:", error);
      return rejectWithValue("Çıkış işleminde bir hata oluştu");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    
    clearError: (state) => {
      state.isError = false;
      state.message = "";
    },
    
    clearSuccess: (state) => {
      state.isSuccess = false;
      state.message = "";
    },
    
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      
      .addCase(loadUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.token && action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadUserData.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = false;
        state.message = action.payload.message;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { 
  reset, 
  clearError, 
  clearSuccess, 
  setToken, 
  setUser 
} = authSlice.actions;

export default authSlice.reducer;