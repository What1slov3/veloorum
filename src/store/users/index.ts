import { TDefaultAction } from './../../types/reducers';
import { fetchLoadedUsers } from './thunk';
import { TLoadedUser, TUsersStore } from './types';
import { createSlice, current } from '@reduxjs/toolkit';

const initialState: TUsersStore = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUserData: (state, action: TDefaultAction<{ username: string; avatarUrl: string; uid: string }>) => {
      state[action.payload.uid] = {
        ...state[action.payload.uid],
        username: action.payload.username || state[action.payload.uid].username,
        avatarUrl: action.payload.avatarUrl || state[action.payload.uid].avatarUrl,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLoadedUsers.fulfilled, (state, action: TDefaultAction<Record<string, TLoadedUser>>) => {
      return { ...state, ...action.payload };
    });
  },
});

export const { updateUserData } = usersSlice.actions;
export default usersSlice.reducer;
