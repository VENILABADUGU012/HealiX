import request from 'supertest'
import app from '../src/app.js'

describe('Health endpoint', () => {
  it('GET /api/v1/health returns success', async () => {
    const res = await request(app).get('/api/v1/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
