const { db, server, request } = require('./config');

describe('search urls', () => {
    // it('should return URLs matching the search query', async () => {
    //     // Arrange
    //     const urls = [
    //       { name: 'Example URL 1', url: 'https://www.example.com/1' },
    //       { name: 'Example URL 2', url: 'https://www.example.com/2' },
    //       { name: 'Test URL', url: 'https://www.test.com' },
    //       { name: 'Another Example', url: 'https://www.another-example.com' },
    //     ];
      
    //     for (const url of urls) {
    //       await db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [
    //         url.name,
    //         url.url,
    //       ]);
    //     }
      
    //     const searchQuery = 'example';
      
    //     // Act
    //     const response = await request(server).get(`/urls?search=${searchQuery}`);
      
    //     // Assert
    //     expect(response.status).toBe(200);
    //     expect(response.body.items).toHaveLength(2);
    //     expect(response.body.items).toContainEqual(
    //       expect.objectContaining({
    //         name: 'Example URL 1',
    //         url: 'https://www.example.com/1',
    //       })
    //     );
    //     expect(response.body.items).toContainEqual(
    //       expect.objectContaining({
    //         name: 'Example URL 2',
    //         url: 'https://www.example.com/2',
    //       })
    //     );
    //   });
  
    it('should return empty result when no URLs match the search query', async () => {
      // Arrange
      const urls = [
        { name: 'Example URL 1', url: 'https://www.example.com/1' },
        { name: 'Example URL 2', url: 'https://www.example.com/2' },
        { name: 'Test URL', url: 'https://www.test.com' },
        { name: 'Another Example', url: 'https://www.another-example.com' },
      ];
  
      for (const url of urls) {
        await db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [
          url.name,
          url.url,
        ]);
      }
  
      const searchQuery = 'non-existent-query';
  
      // Act
      const response = await request(server).get(`/urls?search=${searchQuery}`);
  
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(0);
    });
  });