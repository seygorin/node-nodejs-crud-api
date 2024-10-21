import http from 'http'
import router from './router'

const server: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    router(req, res)
  }
)

export default server
