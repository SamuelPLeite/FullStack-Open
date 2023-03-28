import axios from 'axios'
const baseUrl = '/api/users'

const getWithUsername = async (username) => {
  const response = await axios.get(baseUrl)
  return response.data.find(user => user.username === username)
}

export default { getWithUsername }