import { ServerResponse } from 'http';

export const notFound = (res: ServerResponse, message: string = 'Not Found'): void => {
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({message}));
};

export const badRequest = (res: ServerResponse, message: string): void => {
  res.writeHead(400, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({message}));
};

export const serverError = (res: ServerResponse, message: string = 'Internal Server Error'): void => {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
};
