const Login = ({ username, password, onUsernameChange, onPasswordChange, onSubmit }) => {
	return (
		<>
		<h2>Login</h2>
			<form onSubmit={onSubmit}>
				<div>
					username
					<input type="text" value={username} name="Username" onChange={onUsernameChange}/>
				</div>
				<div>
					password
					<input type="password" value={password} name="Password" onChange={onPasswordChange}/>
				</div>
				<button type='submit'>login</button>
			</form>
		</>
	);
}

export default Login;