import { useState } from 'react';

const LoginForm = ({ handleSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = (event) => {
    event.preventDefault();
    handleSubmit({
      username: username,
      password: password,
    });

    setUsername('');
    setPassword('');
  };
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={login}>
        <div>
          username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
