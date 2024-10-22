import {IncomingMessage, ServerResponse} from 'http'
import * as userModel from '../models/userModel'
import {notFound, badRequest, serverError} from '../utils/errorHandlers'
import {isValidUUID} from '../utils/validators'

interface UserData {
  name: string
  age: number
  hobbies: string[]
}

export const getAllUsers = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const users = await userModel.getAllUsers()
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(users))
  } catch (error) {
    serverError(res, 'Error fetching users')
  }
}

export const getUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
): Promise<void> => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId')
    return
  }

  try {
    const user = await userModel.getUserById(userId)
    if (user) {
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(user))
    } else {
      notFound(res, 'User not found')
    }
  } catch (error) {
    serverError(res, 'Error fetching user')
  }
}

export const createUser = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  let body = ''
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString()
  })
  req.on('end', async () => {
    try {
      const userData: UserData = JSON.parse(body)
      if (!userData.name || !userData.age || !userData.hobbies) {
        badRequest(res, 'Missing required fields')
        return
      }
      const newUser = await userModel.createUser(userData)
      res.writeHead(201, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(newUser))
    } catch (error) {
      badRequest(res, 'Invalid JSON')
    }
  })
}

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
): Promise<void> => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId')
    return
  }

  let body = ''
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString()
  })
  req.on('end', async () => {
    try {
      const userData: Partial<UserData> = JSON.parse(body)
      const updatedUser = await userModel.updateUser(userId, userData)
      if (updatedUser) {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(updatedUser))
      } else {
        notFound(res, 'User not found')
      }
    } catch (error) {
      badRequest(res, 'Invalid JSON')
    }
  })
}

export const deleteUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
): Promise<void> => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId')
    return
  }

  try {
    const deleted = await userModel.deleteUser(userId)
    if (deleted) {
      res.writeHead(204)
      res.end()
    } else {
      notFound(res, 'User not found')
    }
  } catch (error) {
    serverError(res, 'Error deleting user')
  }
}
