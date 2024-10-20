import url from 'url'
import * as userController from './controllers/userController.js'
import {notFound} from './utils/errorHandlers.js'

function router(req, res) {
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()

  if (trimmedPath === 'api/users') {
    switch (method) {
      case 'get':
        userController.getAllUsers(req, res)
        break
      case 'post':
        userController.createUser(req, res)
        break
      default:
        notFound(res)
    }
  } else if (trimmedPath.startsWith('api/users/')) {
    const userId = trimmedPath.split('/')[2]
    switch (method) {
      case 'get':
        userController.getUser(req, res, userId)
        break
      case 'put':
        userController.updateUser(req, res, userId)
        break
      case 'delete':
        userController.deleteUser(req, res, userId)
        break
      default:
        notFound(res)
    }
  } else {
    notFound(res)
  }
}

export default router
