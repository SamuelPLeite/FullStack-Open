const Login = ({ username, setUsername, password, setPassword, handleLogin }) => (
  <form onSubmit={handleLogin}>
    <div>
      Username:
      <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <div>
      Password:
      <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
        style={{ marginLeft: 5 }}
      />
    </div>
    <button type="submit">Login</button>
  </form>
)

export default Login