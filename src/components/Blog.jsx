import { useState } from 'react';

const Blog = ({ user, blog, onLike, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false)
    const boxStyle = { border: '1px solid rgb(0, 0, 0)', margin: '0.5em', padding: '0.5em'};
    const removeButtonStyle = {backgroundColor: 'rgb(108, 152, 255)'}

    return (
        <>
            { showDetails === false ?
            <div style={boxStyle} >
                <div>
                    {blog.title}, {blog.author}
                    <button onClick={() => {setShowDetails(true)}} >view</button>
                </div>
            </div> :

            <div style={boxStyle}>
                <div>
                    {blog.title}, {blog.author}
                    <button onClick={() => {setShowDetails(false)}} >hide</button>
                </div>
                <div>
                    {blog.url}
                </div>
                <div>
                    <div>likes {blog.likes} <button onClick={() => onLike(blog)}>like</button></div>
                </div>
                <div>
                    {blog.user.name}
                </div>
                {(blog.user.username === user.username) && <button onClick={() => onDelete(blog)} style={removeButtonStyle} >remove</button>}
            </div>
            
            } 
        </>  
    )

}




  
  export default Blog