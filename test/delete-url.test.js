const { db, server, request } = require('./config');


describe('delete urls/:id', () => {
    it('should delete a URL when the provided ID is valid', async () => {
        // Arrange
        const urlToDelete = {
        id: 1,
        name: 'Example URL',
        url: 'https://www.example.com'
        };
    
        await db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [
        urlToDelete.name,
        urlToDelete.url
        ]);
    
        const response = await request(server)
        .delete(`/urls/${urlToDelete.id}`)
        .send();
    
        expect(response.status).toBe(204);
    
        const deletedUrl = await db.get('SELECT * FROM urls WHERE id = ?', [
        urlToDelete.id
        ]);
        expect(Object.keys(deletedUrl).length).toBe(0);
    });
    it('should return an error when the provided ID is not an integer', async () => {

        const invalidId = 'abc';
    
        const response = await request(server)
        .delete(`/urls/${invalidId}`)
        .send();
    
        expect(response.status).toBe(400);
    });
    });