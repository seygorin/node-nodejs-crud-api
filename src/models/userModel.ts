import {v4 as uuidv4} from 'uuid'

interface User {
  id: string
  name: string
  age: number
  hobbies: string[]
}

let users: User[] = []

export const getAllUsers = (): User[] => users

export const getUserById = (id: string): User | undefined =>
  users.find((u) => u.id === id)

export const createUser = (userData: Omit<User, 'id'>): User => {
  const newUser: User = {
    id: uuidv4(),
    ...userData,
  }
  users.push(newUser)
  return newUser
}

export const updateUser = (
  id: string,
  userData: Partial<Omit<User, 'id'>>
): User | null => {
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = {...users[index], ...userData}
    return users[index]
  }
  return null
}

export const deleteUser = (id: string): boolean => {
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users.splice(index, 1)
    return true
  }
  return false
}
