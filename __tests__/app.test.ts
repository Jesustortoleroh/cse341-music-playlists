import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import { app } from '../server'; // Import the Express app from server.ts

describe('API Basic Tests', () => {
  it('should return 200 OK on the root route', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Welcome');
  });

  it('should return 401 Unauthorized when trying to create a playlist without login', async () => {
    const res = await request(app)
      .post('/api/playlists')
      .send({ name: 'Test Playlist', creator: 'Test', genre: 'rock' });
    expect(res.status).toBe(401);
  });
});