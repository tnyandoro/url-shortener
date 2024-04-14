const { db, server, request } = require('./config');

describe('post url', () => {

  it('when correct input, should insert url into db', async () => {

    const response = await request(server)
      .post('/urls')
      .send({ name: 'test', url: 'http://test' });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('url');
    expect(response.body).toHaveProperty('shortUrl');

    expect(response.body.name).toBe('test');
    expect(response.body.url).toBe('http://test');

  });

  it('when input has no name, should return error', async () => {

    const response = await request(server)
      .post('/urls')
      .send({ url: 'http://test' });

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('errors');

    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0].msg).toBe('Name is required');

  });

  it('when input has no url, should return error', async () => {

    const response = await request(server)
      .post('/urls')
      .send({ name: 'test' });

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('errors');

    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0].msg).toBe('URL is required');

  });

  it('when input has invalid url, should return error', async () => {

    const response = await request(server)
      .post('/urls')
      .send({ name: 'test', url: 'http//test' });

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('errors');

    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0].msg).toBe('Invalid URL');

  });

});