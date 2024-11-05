import path from 'node:path'
import os from 'os'
import cluster from 'cluster'
import server from './src/server'

const PORT = Number(process.env.PORT ?? 4000)
const isClusterMode = process.argv.includes('--cluster')
const numberWorkers = os.availableParallelism()

function startServer(port: number) {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

if (isClusterMode) {
  if (cluster.isPrimary) {
    console.log(`Node.js CRUD API\n(CLUSTER MODE)`)

    for (let i = 0; i < numberWorkers; i += 1) {
      cluster.fork({WORKER_PORT: PORT + i})
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`)
      cluster.fork({WORKER_PORT: PORT + worker.id})
    })
  } else {
    const workerPort = Number(process.env.WORKER_PORT)
    startServer(workerPort)
  }
} else {
  startServer(PORT)
  console.log(`Node.js CRUD API\n(SINGLE MODE)`)
}
