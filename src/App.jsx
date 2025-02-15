import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'

import blogService from './services/blogs'
import loginService from './services/login'
import './index.css';

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [successMsg, setSuccessMsg] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);

	useEffect(() => {

		const fetchBlogs = async () => {
			const blogs = await blogService.getAll()
			setBlogs(blogs);
		}
		fetchBlogs();
		
	}, [])

	useEffect(() => {

		let loggedInUser = window.localStorage.getItem('loggedBlogAppUser');
		if (loggedInUser) {
			loggedInUser = JSON.parse(loggedInUser);
			setUser(loggedInUser)
			console.log('Resuming session for previously logged in user.')
		}		
		
	}, [])

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	}

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	}

	const handleLoginSubmit = async (event) => {
		event.preventDefault();
		console.log('logging in with ', username, password);
		
		try {
			const userLogin = await loginService.login({ username, password });
			setUser(userLogin);
			window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(userLogin));
			setUsername("");
			setPassword("");
			setSuccessMsg(`${username} login successful`)
			setTimeout(() => { setSuccessMsg(null) }, 3000);
			console.log('login successful, token: ', userLogin);
		} catch (error) {
			setErrorMsg(`login failed - invalid username or password`)
			setTimeout(() => { setErrorMsg(null) }, 3000);
			console.log(error.message);
		}
	}

	const handleLogout = () => {
		setUser(null);
		window.localStorage.removeItem('loggedBlogAppUser');
		console.log('logged out')
	}

	const handleCreate = (createdBlog) => {
		setBlogs(blogs.concat(createdBlog));
	}

	return (
		<div>
			<h1>blogs</h1>
			<Notification message={successMsg} className={"successNotification"}/>
			<Notification message={errorMsg} className={"errorNotification"}/>
			
			{ user === null ? 
				<Login 
					username={username} 
					password={password} 
					onUsernameChange={handleUsernameChange} 
					onPasswordChange={handlePasswordChange} 
					onSubmit={handleLoginSubmit}
				/> :
				<>
					<div>
						{user.name} - logged in
						<button onClick={handleLogout}>logout</button>
					</div>
					<div>
						<CreateBlog setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg} user={user} onCreate={handleCreate} />
			
						{blogs.map(blog =>
							<Blog key={blog.id} blog={blog} />
						)}
					</div>
				</>
			}

		</div>
	)
}




export default App