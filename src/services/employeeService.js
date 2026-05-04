import axios from 'axios'

const api = axios.create({
  baseURL: 'https://69f07f2bc1533dbedc9d140b.mockapi.io/api'
})

const resource = '/employees'

const getEmployees = () => {
  console.log('Fetching employees from:', `${api.defaults.baseURL}${resource}`)
  return api.get(resource)
}

const createEmployee = (payload) => {
  console.log('Creating employee:', payload)
  return api.post(resource, payload)
}

const updateEmployee = (id, payload) => {
  console.log('Updating employee:', id, payload)
  return api.put(`${resource}/${id}`, payload)
}

const deleteEmployee = (id) => {
  console.log('Deleting employee:', id)
  return api.delete(`${resource}/${id}`)
}

export default {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
}
