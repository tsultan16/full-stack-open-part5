import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import CreateBlog from './components/CreateBlog'
import Togglable from './components/Togglable'

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
	const togglableRef = useRef(null);

	useEffect(() => {

		const fetchBlogs = async () => {
			const blogs = await blogService.getAll()
			setBlogs(blogs);
			console.log(blogs);
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

	const handleCreate = async (blogObject) => {
		try {
			const createdBlog = await blogService.create(blogObject, user.token);
			setBlogs(blogs.concat(createdBlog));
            
			// hide form after successful blog creation
			togglableRef.current.setVisible(false);

			setSuccessMsg(`blog created`)
			setTimeout(() => { setSuccessMsg(null) }, 3000);
			console.log('blog created: ', createdBlog);

		} catch (error) {
			setErrorMsg(`blog creation failed - ${error.message}`)
			setTimeout(() => { setErrorMsg(null) }, 3000);
			console.log(error.message);
		}
	}

	const handleLike = async (blogObject) => {
		const updatedBlogObject = {...blogObject, likes: blogObject.likes+1};
		try {
			const updatedBlog = await blogService.update(updatedBlogObject, user.token);
			setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
        
			setSuccessMsg(`blog updated`)
			setTimeout(() => { setSuccessMsg(null) }, 3000);
			console.log('blog updated: ', updatedBlog);

		} catch (error) {
			setErrorMsg(`blog update failed - ${error.message}`)
			setTimeout(() => { setErrorMsg(null) }, 3000);
			console.log(error.message);
		}
	}

	const handleDelete = async (blogObject) => {
		if(window.confirm(`Remove blog: ${blogObject.title} by ${blogObject.author}`)) {
			try {
				await blogService.remove(blogObject, user.token);
				setBlogs(blogs.filter(blog => blog.id !== blogObject.id));
	
				setSuccessMsg(`blog deleted`)
				setTimeout(() => { setSuccessMsg(null) }, 3000);
				console.log('blog deleted');
	
			} catch (error) {
				setErrorMsg(`blog deletion failed - ${error.message}`)
				setTimeout(() => { setErrorMsg(null) }, 3000);
				console.log(error.message);
			}
		}
	}

	const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes); 

	return (
		<div>
			<h1>blogs</h1>
			<Notification message={successMsg} className={"successNotification"}/>
			<Notification message={errorMsg} className={"errorNotification"}/>
			
			{ user === null ? 
				<Togglable buttonLabel="login"> 
					<Login 
						username={username} 
						password={password} 
						onUsernameChange={handleUsernameChange} 
						onPasswordChange={handlePasswordChange} 
						onSubmit={handleLoginSubmit}
					/>
				</Togglable> :
				<>
					<div>
						{user.name} - logged in
						<button onClick={handleLogout}>logout</button>
					</div>
					<div>
						<Togglable buttonLabel="new blog" refProp={(ref) => {togglableRef.current = ref}} > 
							<CreateBlog setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg} onCreate={handleCreate} />
						</Togglable>
						
						{sortedBlogs.map(blog =>
							<Blog key={blog.id} user={user} blog={blog} onLike={handleLike} onDelete={handleDelete} />
						)}
					</div>
				</>
			}

		</div>
	)
}




export default App