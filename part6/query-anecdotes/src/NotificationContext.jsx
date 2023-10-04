import { createContext, useReducer, useContext } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'addNotification':
      console.log(JSON.parse(JSON.stringify(action)));
      return action.payload;
    case 'rmNotification':
      return '';
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const all = useContext(NotificationContext);
  return all[0];
};

export const useNotificationDispatch = () => {
  const all = useContext(NotificationContext);
  return all[1];
};

export default NotificationContext;
