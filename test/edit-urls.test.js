const { db, server, request } = require('./config');

describe('update urls/:id', () => {
  // it('should update a URL when the provided ID is valid', async () => {
  //   // Arrange
  //   const urlToUpdate = {
  //     id: 1,
  //     name: 'Example URL',
  //     url: 'https://www.example.com'
  //   };
  
  //   await db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [
  //     urlToUpdate.name,
  //     urlToUpdate.url
  //   ]);
  
  //   const updatedUrl = {
  //     name: 'Updated URL',
  //     url: 'https://www.updatedurl.com'
  //   };
  
  //   // Act
  //   const updateResponse = await request(server)
  //     .put(`/urls/${urlToUpdate.id}`)
  //     .send(updatedUrl);
  
  //   // Assert
  //   expect(updateResponse.status).toBe(200);
  //   expect(updateResponse.body).toEqual({
  //     id: String(urlToUpdate.id),
  //     name: updatedUrl.name,
  //     url: updatedUrl.url,
  //     shortUrl: expect.any(String)
  //   });
  
  //   // Fetch the list of URLs and check that the updated URL is present
  //   const listResponse = await request(server).get('/urls');
  //   expect(listResponse.status).toBe(200);
  //   expect(listResponse.body.items).toContainEqual({
  //     id: String(urlToUpdate.id),
  //     name: updatedUrl.name,
  //     url: updatedUrl.url,
  //     shortUrl: expect.any(String)
  //   });
  // });

    it('should return an error when the provided ID is not an integer', async () => {
      // Arrange
      const invalidId = 'abc';
      const updatedUrl = {
        name: 'Updated URL',
        url: 'https://www.updatedurl.com'
      };
    
      // Act
      const response = await request(server)
        .put(`/urls/${invalidId}`)
        .send(updatedUrl);
    
      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors[0]).toMatchObject({
        location: 'params',
        msg: 'ID must be an integer',
        path: 'id',
        type: 'field',
        value: invalidId
      });
    });
    
    it('should return an error when the provided URL is invalid', async () => {
      // Arrange
      const urlToUpdate = {
        id: 1,
        name: 'Example URL',
        url: 'https://www.example.com'
      };
  
      await db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [
        urlToUpdate.name,
        urlToUpdate.url
      ]);
  
      const invalidUrl = {
        name: 'Updated URL',
        url: 'http//updatedurl.com'
      };
  
      // Act
      const response = await request(server)
        .put(`/urls/${urlToUpdate.id}`)
        .send(invalidUrl);
  
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].msg).toBe('Invalid URL');
    });
  });