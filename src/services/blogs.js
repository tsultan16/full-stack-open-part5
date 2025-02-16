import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'


const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
}


const create = async (blogObject, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }, 
    };

    const response = await axios.post(baseUrl, blogObject, config);
    return response.data;
}

const update = async (blogObject, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }, 
    };

    const response = await axios.put(baseUrl+`/${blogObject.id}`, blogObject, config);
    return response.data;
}

const remove = async (blogObject, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }, 
    };

    const response = await axios.delete(baseUrl+`/${blogObject.id}`, config);
    return response.data;
}


export default { getAll, create, update, remove }