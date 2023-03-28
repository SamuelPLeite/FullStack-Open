import axios from 'axios'
const baseUrl = '/api/login'

const login = async (userInfo) => {
  const response = await axios.post(baseUrl, userInfo)
  console.log(response.data)
  return response.data
}

export default { login }