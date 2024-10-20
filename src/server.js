import http from 'http'
import router from './router.js'

const server = http.createServer((req, res) => {
  router(req, res)
})

export default server
