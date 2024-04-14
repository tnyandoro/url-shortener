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

  // when there is 1 urll in database, should return 1 url
  // when there are 2 urls in database, should return 2 urls
  // scenarios:
  // - size, page, search, order (alphabetically order by name)

});