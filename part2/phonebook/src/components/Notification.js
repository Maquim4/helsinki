const Notification = ({ message, state }) => {
  if (message === null) {
    return null;
  }
  return state === 'error' ? (
    <div className="notification error">{message}</div>
  ) : (
    <div className="notification">{message}</div>
  );
};

export default Notification;
