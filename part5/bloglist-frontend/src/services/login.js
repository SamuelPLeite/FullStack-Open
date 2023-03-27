import axios from 'axios'
const baseUrl = '/api/login'

const login = async (userInfo) => {
  const response = await axios.post(baseUrl, userInfo)
  console.log(response.data)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login }