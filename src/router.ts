import {IncomingMessage, ServerResponse} from 'http'
import url from 'url'
import * as userController from './controllers/userController'
import {notFound, serverError} from './utils/errorHandlers'

function router(req: IncomingMessage, res: ServerResponse): void {
  try {
    const parsedUrl = url.parse(req.url || '', true)
    const path = parsedUrl.pathname
    const trimmedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''
    const method = req.method ? req.method.toLowerCase() : ''

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
  } catch (error) {
    serverError(res, error instanceof Error ? error.message : 'Unknown error')
  }
}

export default router
