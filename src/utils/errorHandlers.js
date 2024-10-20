export const notFound = (res, message = 'Not Found') => {
  res.writeHead(404, {'Content-Type': 'application/json'})
  res.end(JSON.stringify({message}))
}

export const badRequest = (res, message) => {
  res.writeHead(400, {'Content-Type': 'application/json'})
  res.end(JSON.stringify({message}))
}