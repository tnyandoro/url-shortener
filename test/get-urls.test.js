const { db, server, request } = require('./config');

describe('get urls', () => {
  it('when there is no urls in database, should return no urls', async () => {
    const response = await request(server)
      .get('/urls')
      .send();
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
    expect(response.body.items.length).toBe(0);
    expect(response.body.page).toBe(0);
    expect(response.body.size).toBe(5);
  });

  it('when there is 1 url in database, should return 1 url', async () => {
    // Arrange
    const urlToInsert = { name: 'Example URL', url: 'https://www.example.com' };
    await db.runAsync('INSERT INTO urls (name, url) VALUES (?, ?)', [urlToInsert.name, urlToInsert.url]);
    const insertedUrl = await db.getAsync('SELECT * FROM urls ORDER BY id DESC LIMIT 1');

    // Act
    const response = await request(server)
      .get('/urls')
      .send();

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0].id).toBe(insertedUrl.id);
    expect(response.body.items[0].name).toBe(insertedUrl.name);
    expect(response.body.items[0].url).toBe(insertedUrl.url);
    expect(response.body.page).toBe(0);
    expect(response.body.size).toBe(5);
  });

  it('when there are 2 urls in database, should return 2 urls', async () => {
    // Arrange
    const url1 = { name: 'URL 1', url: 'https://www.example.com/1' };
    const url2 = { name: 'URL 2', url: 'https://www.example.com/2' };
    await db.runAsync('INSERT INTO urls (name, url) VALUES (?, ?)', [url1.name, url1.url]);
    await db.runAsync('INSERT INTO urls (name, url) VALUES (?, ?)', [url2.name, url2.url]);
    const url1Result = await db.getAsync('SELECT * FROM urls WHERE name = ?', [url1.name]);
    const url2Result = await db.getAsync('SELECT * FROM urls WHERE name = ?', [url2.name]);

    // Act
    const response = await request(server)
      .get('/urls')
      .send();

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(2);
    expect(response.body.items.length).toBe(2);
    expect(response.body.items[0].id).toBe(url1Result.id);
    expect(response.body.items[0].name).toBe(url1Result.name);
    expect(response.body.items[0].url).toBe(url1Result.url);
    expect(response.body.items[1].id).toBe(url2Result.id);
    expect(response.body.items[1].name).toBe(url2Result.name);
    expect(response.body.items[1].url).toBe(url2Result.url);
    expect(response.body.page).toBe(0);
    expect(response.body.size).toBe(5);
  });
});