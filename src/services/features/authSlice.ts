import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthUser } from '@/interfaces/auth.interface';

// interface AuthState: kieu du lieu cua state cua authSlice
// user: IAuthUser | null: user la IAuthUser hoac null
// isAuthenticated: boolean: isAuthenticated la boolean (true: da dang nhap, false: chua dang nhap)
interface AuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
}

// initialState: state ban dau cua authSlice
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// authSlice: slice cua authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthUser>) => {
      // action.payload: du lieu truyen vao
      // state.user = action.payload: gan du lieu truyen vao cho user
      // state.isAuthenticated = true: gan true cho isAuthenticated
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      // state.user = null: gan null cho user
      // state.isAuthenticated = false: gan false cho isAuthenticated
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// export action cua authSlice
export const { setUser, clearUser } = authSlice.actions;

// export reducer cua authSlice
export default authSlice.reducer;