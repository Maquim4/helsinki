import { createContext, useReducer } from 'react'

const INITIAL_STATE = { message: null, type: "info"}
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "info":
        return { message: action.payload, type: "info"}
    case "error":
        return { message: action.payload, type: "error"}
    default:
        return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, INITIAL_STATE)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext