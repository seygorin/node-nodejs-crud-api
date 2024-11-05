import http from 'http'
import router from './router'

const server: http.Server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader(
      'X-Worker-Port',
      process.env.WORKER_PORT || process.env.PORT || '4000'
    )
    router(req, res)
  }
)

export default server
