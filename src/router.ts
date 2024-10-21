import {IncomingMessage, ServerResponse} from 'http'
import url from 'url'
import * as userController from './controllers/userController'
import {notFound, serverError} from './utils/errorHandlers'

async function router(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const parsedUrl = url.parse(req.url || '', true)
    const path = parsedUrl.pathname
    const trimmedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''
    const method = req.method ? req.method.toLowerCase() : ''

    if (trimmedPath === 'api/users') {
      switch (method) {
        case 'get':
          await userController.getAllUsers(req, res)
          break
        case 'post':
          await userController.createUser(req, res)
          break
        default:
          notFound(res)
      }
    } else if (trimmedPath.startsWith('api/users/')) {
      const userId = trimmedPath.split('/')[2]
      switch (method) {
        case 'get':
          await userController.getUser(req, res, userId)
          break
        case 'put':
          await userController.updateUser(req, res, userId)
          break
        case 'delete':
          await userController.deleteUser(req, res, userId)
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
