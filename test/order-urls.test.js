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
                await db.runAsync('INSERT INTO urls (name, url) VALUES (?, ?)', [
                    url.name,
                    url.url,
                ]);
            }
            
            // Act
            const response = await request(server).get('/urls');
            
            // Assert
            expect(response.status).toBe(200);
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

    it('should return URLs in alphabetical order by name, with pagination', async () => {
        // Arrange
        const urls = [
          { name: 'Example URL 1', url: 'https://www.example.com/1' },
          { name: 'Example URL 2', url: 'https://www.example.com/2' },
          { name: 'Example URL 3', url: 'https://www.example.com/3' },
          { name: 'Example URL 4', url: 'https://www.example.com/4' },
          { name: 'Example URL 5', url: 'https://www.example.com/5' },
          { name: 'Example URL 6', url: 'https://www.example.com/6' },
          { name: 'Example URL 7', url: 'https://www.example.com/7' },
          { name: 'Example URL 8', url: 'https://www.example.com/8' },
        ];
    
        for (const url of urls) {
            await db.runAsync('INSERT INTO urls (name, url) VALUES (?, ?)', [
                url.name,
                url.url,
            ]);
        }
    
        // Act
        const response1 = await request(server).get('/urls?page=1&size=5');
        const response2 = await request(server).get('/urls?page=2&size=5');
    
        // Assert
        expect(response1.status).toBe(200);
        expect(response1.body.page).toBe("1");
        expect(response1.body.size).toBe("5");
        expect(response1.body.count).toBe(8);
    
        expect(response2.status).toBe(200);
    
        expect(response2.body.page).toBe("2");
        expect(response2.body.size).toBe("5");
        expect(response2.body.count).toBe(8);
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