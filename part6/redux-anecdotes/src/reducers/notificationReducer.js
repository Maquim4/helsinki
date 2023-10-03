import { createSlice } from '@reduxjs/toolkit';

const initialState = '';
const notificationSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addNotification(state, action) {
      // eslint-disable-next-line
      return 'you voted' + ' "' + action.payload + '" ';
    },
    removeNotification() {
      return '';
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
