import * as userModel from '../models/userModel.js'
import {notFound, badRequest} from '../utils/errorHandlers.js'
import {isValidUUID} from '../utils/validators.js'

export const getAllUsers = (req, res) => {
  const users = userModel.getAllUsers()
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(users))
}

export const getUser = (req, res, userId) => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId')
    return
  }

  const user = userModel.getUserById(userId)
  if (user) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(user))
  } else {
    notFound(res, 'User not found')
  }
}

export const createUser = (req, res) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })
  req.on('end', () => {
    try {
      const userData = JSON.parse(body)
      if (!userData.name || !userData.age || !userData.hobbies) {
        badRequest(res, 'Missing required fields')
        return
      }
      const newUser = userModel.createUser(userData)
      res.writeHead(201, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(newUser))
    } catch (error) {
      badRequest(res, 'Invalid JSON')
    }
  })
}

export const updateUser = (req, res, userId) => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId')
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })
  req.on('end', () => {
    try {
      const userData = JSON.parse(body)
      const updatedUser = userModel.updateUser(userId, userData)
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

export const deleteUser = (req, res, userId) => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId')
    return
  }

  const deleted = userModel.deleteUser(userId)
  if (deleted) {
    res.writeHead(204)
    res.end()
  } else {
    notFound(res, 'User not found')
  }
}
