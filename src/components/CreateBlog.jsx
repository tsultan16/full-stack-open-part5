import { useState } from 'react';
import blogService from '../services/blogs'

const CreateBlog = ({ setSuccessMsg, setErrorMsg, user, onCreate }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");
	const [likes, setLikes] = useState(0);
	
	const handleBlogSubmit = async (event) => {
		event.preventDefault();

		const blogObject = {
			title, author, url, likes
		}

		try {
			const createdBlog = await blogService.create(blogObject, user.token);
			onCreate(createdBlog);
            setTitle("")
			setAuthor("")
			setUrl("")
			setLikes(0)

			setSuccessMsg(`blog created`)
			setTimeout(() => { setSuccessMsg(null) }, 3000);
			console.log('blog created: ', createdBlog);

		} catch (error) {
			setErrorMsg(`blog creation failed - ${error.message}`)
			setTimeout(() => { setErrorMsg(null) }, 3000);
			console.log(error.message);
		}

	}

	return (
		<>
		<h2>create new</h2>
			<form onSubmit={handleBlogSubmit}>
				<div>
					title
					<input type="text" value={title} name="Title" onChange={e => setTitle(e.target.value)}/>
				</div>
				<div>
					author
					<input type="text" value={author} name="Author" onChange={e => setAuthor(e.target.value)}/>
				</div>
				<div>
					url
					<input type="text" value={url} name="URL" onChange={e => setUrl(e.target.value)}/>
				</div>
				<div>
					likes
					<input type="number" value={likes} name="Likes" onChange={e => {if (e.target.value >= 0 ) setLikes(e.target.value)}}/>
				</div>
				<button type='submit'>add</button>
			</form>
		</>
	);

}

export default CreateBlog;