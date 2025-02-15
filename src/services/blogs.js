import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'


const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
}


const create = async ( blogObject, token ) => {
    console.log(token)
    const config = {
        headers: { Authorization: `Bearer ${token}` }, 
    };

    const response = await axios.post(baseUrl, blogObject, config);
    return response.data;
}
  


export default { getAll, create }