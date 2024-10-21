import { IncomingMessage, ServerResponse } from 'http';
import * as userModel from '../models/userModel';
import { notFound, badRequest } from '../utils/errorHandlers';
import { isValidUUID } from '../utils/validators';

interface UserData {
  name: string;	
  age: number;
  hobbies: string[];
}

export const getAllUsers = (req: IncomingMessage, res: ServerResponse): void => {
  const users = userModel.getAllUsers();
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(users));
};

export const getUser = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId');
    return;
  }

  const user = userModel.getUserById(userId);
  if (user) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(user));
  } else {
    notFound(res, 'User not found');
  }
};

export const createUser = (req: IncomingMessage, res: ServerResponse): void => {
  let body = '';
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const userData: UserData = JSON.parse(body);
      if (!userData.name || !userData.age || !userData.hobbies) {
        badRequest(res, 'Missing required fields');
        return;
      }
      const newUser = userModel.createUser(userData);
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(newUser));
    } catch (error) {
      badRequest(res, 'Invalid JSON');
    }
  });
};

export const updateUser = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId');
    return;
  }

  let body = '';
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const userData: Partial<UserData> = JSON.parse(body);
      const updatedUser = userModel.updateUser(userId, userData);
      if (updatedUser) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(updatedUser));
      } else {
        notFound(res, 'User not found');
      }
    } catch (error) {
      badRequest(res, 'Invalid JSON');
    }
  });
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse, userId: string): void => {
  if (!isValidUUID(userId)) {
    badRequest(res, 'Invalid userId');
    return;
  }

  const deleted = userModel.deleteUser(userId);
  if (deleted) {
    res.writeHead(204);
    res.end();
  } else {
    notFound(res, 'User not found');
  }
};
