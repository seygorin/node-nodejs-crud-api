import request from 'supertest'
import server from '../src/server'
import {v4 as uuidv4} from 'uuid'

describe('User API', () => {
  let createdUserId: string

  beforeAll(async () => {
    const newUser = {
      name: 'John Doe',
      age: 30,
      hobbies: ['reading', 'swimming'],
    }
    const response = await request(server).post('/api/users').send(newUser)
    createdUserId = response.body.id
  })

  afterAll(async () => {
    await request(server).delete(`/api/users/${createdUserId}`)
  })

  describe('GET /api/users', () => {
    it('should return an array of users', async () => {
      const response = await request(server).get('/api/users')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Alice Smith',
        age: 25,
        hobbies: ['painting', 'yoga'],
      }
      const response = await request(server).post('/api/users').send(newUser)
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(typeof response.body.id).toBe('string')
      expect(response.body.name).toBe(newUser.name)
      expect(response.body.age).toBe(newUser.age)
      expect(Array.isArray(response.body.hobbies)).toBe(true)
      expect(response.body.hobbies).toEqual(newUser.hobbies)
    })

    it('should return 400 when creating user with missing required fields', async () => {
      const invalidUser = {
        name: 'John Doe',
        hobbies: [],
      }
      const response = await request(server)
        .post('/api/users')
        .send(invalidUser)
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('GET /api/users/:id', () => {
    it('should get the created user by id', async () => {
      const response = await request(server).get(`/api/users/${createdUserId}`)
      expect(response.status).toBe(200)
      expect(response.body.id).toBe(createdUserId)
    })

    it('should return 400 when trying to get user with invalid UUID', async () => {
      const response = await request(server).get('/api/users/invalid-uuid')
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })

    it('should return 404 when trying to get non-existent user', async () => {
      const nonExistentId = uuidv4()
      const response = await request(server).get(`/api/users/${nonExistentId}`)
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('PUT /api/users/:id', () => {
    it('should update the created user', async () => {
      const updatedUser = {
        name: 'Jane Doe',
        age: 31,
        hobbies: ['reading', 'swimming', 'cycling'],
      }
      const response = await request(server)
        .put(`/api/users/${createdUserId}`)
        .send(updatedUser)
      expect(response.status).toBe(200)
      expect(response.body.id).toBe(createdUserId)
      expect(response.body.name).toBe(updatedUser.name)
      expect(response.body.age).toBe(updatedUser.age)
      expect(response.body.hobbies).toEqual(updatedUser.hobbies)
    })

    it('should return 400 when updating user with invalid UUID', async () => {
      const response = await request(server)
        .put('/api/users/invalid-uuid')
        .send({name: 'John Doe', age: 30, hobbies: []})
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })

    it('should return 404 when updating non-existent user', async () => {
      const nonExistentId = uuidv4()
      const response = await request(server)
        .put(`/api/users/${nonExistentId}`)
        .send({name: 'John Doe', age: 30, hobbies: []})
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should delete the created user', async () => {
      const response = await request(server).delete(
        `/api/users/${createdUserId}`
      )
      expect(response.status).toBe(204)
    })

    it('should return 400 when deleting user with invalid UUID', async () => {
      const response = await request(server).delete('/api/users/invalid-uuid')
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })

    it('should return 404 when deleting non-existent user', async () => {
      const nonExistentId = uuidv4()
      const response = await request(server).delete(
        `/api/users/${nonExistentId}`
      )
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('Non-existing endpoints', () => {
    it('should return 404 for non-existing endpoints', async () => {
      const response = await request(server).get('/non-existing-endpoint')
      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('message')
    })
  })
})
