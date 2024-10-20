import {v4 as uuidv4} from 'uuid'

let users = []

export const getAllUsers = () => users

export const getUserById = (id) => users.find((u) => u.id === id)

export const createUser = (userData) => {
  const newUser = {
    id: uuidv4(),
    ...userData,
  }
  users.push(newUser)
  return newUser
}

export const updateUser = (id, userData) => {
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = {...users[index], ...userData}
    return users[index]
  }
  return null
}

export const deleteUser = (id) => {
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users.splice(index, 1)
    return true
  }
  return false
}
