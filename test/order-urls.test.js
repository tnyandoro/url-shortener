const { db, server, request } = require('./config');

describe('get urls', () => {
it('should return URLs in alphabetical order by name', async () => {
    // Arrange
    const urls = [
    { name: 'Example URL 2', url: 'https://www.example.com/2' },
    { name: 'Another Example', url: 'https://www.another-example.com' },
    { name: 'Example URL 1', url: 'https://www.example.com/1' },
    { name: 'Test URL', url: 'https://www.test.com' },
    ];

    for (const url of urls) {
    await db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [
        url.name,
        url.url,
    ]);
    }

    // Act
    const response = await request(server).get('/urls');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(4);
    expect(response.body.items).toEqual(
    expect.arrayContaining([
        expect.objectContaining({
        name: 'Another Example',
        url: 'https://www.another-example.com',
        }),
        expect.objectContaining({
        name: 'Example URL 1',
        url: 'https://www.example.com/1',
        }),
        expect.objectContaining({
        name: 'Example URL 2',
        url: 'https://www.example.com/2',
        }),
        expect.objectContaining({
        name: 'Test URL',
        url: 'https://www.test.com',
        }),
    ])
    );
});

it('when there is no urls in database, should return no urls', async () => {
    const response = await request(server).get('/urls');
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
    expect(response.body.items.length).toBe(0);
    expect(response.body.page).toBe(0);
    expect(response.body.size).toBe(5);
});
});