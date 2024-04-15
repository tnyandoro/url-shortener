const { db, server, request } = require('./config');

describe('delete urls/:id', () => {
    it('should delete a URL when the provided ID is valid', async () => {
        // Arrange
        const urlToDelete = { id: 1, name: 'Example URL', url: 'https://www.example.com' };
        await db.runAsync('INSERT INTO urls (name, url) VALUES (?, ?)', [urlToDelete.name, urlToDelete.url]);

        // Act
        const response = await request(server)
        .delete(`/urls/${urlToDelete.id}`)
        .send();

        // Assert
        expect(response.status).toBe(204);

        // Check that the URL was deleted
        const deletedUrl = await db.getAsync('SELECT * FROM urls WHERE id = ?', [urlToDelete.id]);
        expect(deletedUrl).toBeUndefined();
    });

    it('should return an error when the provided ID is not an integer', async () => {
        const invalidId = 'abc';
        const response = await request(server)
        .delete(`/urls/${invalidId}`)
        .send();
        expect(response.status).toBe(400);
    });
});