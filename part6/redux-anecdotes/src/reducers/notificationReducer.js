import { createSlice } from '@reduxjs/toolkit';

const initialState = 'hello';
const notificationSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addNotification(state, action) {
      console.log(JSON.parse(JSON.stringify(state)));
      return 'you voted' + action.payload;
    },
    removeNotification() {},
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
