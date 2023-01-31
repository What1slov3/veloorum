import { fetchLoadedUsers } from './thunk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadedUser, UsersStore } from '@customTypes/redux/users.types';

const initialState: UsersStore = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<{ username: string; avatarUrl: string; uid: string }>) => {
      state[action.payload.uid] = {
        ...state[action.payload.uid],
        username: action.payload.username || state[action.payload.uid].username,
        avatarUrl: action.payload.avatarUrl || state[action.payload.uid].avatarUrl,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLoadedUsers.fulfilled, (state, action: PayloadAction<Record<string, LoadedUser>>) => {
      return { ...state, ...action.payload };
    });
  },
});

export const { updateUserData } = usersSlice.actions;
export default usersSlice.reducer;
