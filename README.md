# URL Shortening Service

<img width="1440" alt="Screenshot 2024-04-14 at 14 20 02" src="https://github.com/tnyandoro/url-shortener/assets/30318155/33d1b697-accd-4e9b-a30e-ae811efb147c">

## Overview

This Node.js application provides a basic URL shortening service, allowing users to submit long URLs and receive shortened versions that redirect to the original URLs.

## How its working 

Here's how the base62 function is working in the context of a URL shortening application:

- **Encoding**:
  - When a new URL is added to the database, the application generates a unique integer ID for the URL.
  - This ID is then converted to a base62 string using the `base62.encode(id)` function.
  - The resulting base62 string is used as the "short URL" that will be displayed to the user.

- **Decoding**:
  - When a user accesses the short URL (e.g., `http://localhost:3000/ab12cd`), the application needs to determine the original URL that corresponds to the short URL.
  - The base62 string in the URL is decoded back to the original integer ID using the `base62.decode(shortUrl)` function.
  - The application then uses this ID to retrieve the corresponding URL from the database.

## Features

1. **Shortening URLs**: Users can submit a long URL to be shortened.
2. **Redirection**: Shortened URLs redirect users to the original URLs.
3. **Simple API**: The service exposes simple endpoints for URL submission and redirection.
4. **Unique Short IDs**: Shortened URLs are generated using unique, random 7-character IDs.
5. **In-Memory Storage**: URL mappings are stored in-memory for simplicity.

## Technologies Used

- **Node.js**: A JavaScript runtime for executing server-side code.
- **Express.js**: A minimal and flexible Node.js web application framework for building APIs.
- **body-parser**: Middleware for parsing request bodies.
- **react.js**: A Javascript Frontend framework

## Implementation

- **POST /shorten Endpoint**: Allows users to submit a URL to be shortened. Responds with a shortened URL.
- **GET /:shortId Endpoint**: Redirects users from a shortened URL to the original URL.
- **In-Memory Storage**: URL mappings are stored in a JavaScript object (`urlDatabase`).

"base62": "^2.0.2",
    "body-parser": "^1.20.2",
    "express": "^4.19.2",
    "express-validator": "^7.0.1",
    "sqlite3": "^5.1.7",
    "valid-url": "^1.0.9"

## Usage

1. **Clone or download the repository**:

   ```shell
   git clone https://github.com/tnyandoro/url-shortener
   ```

2. **Change directory into the `url-shortener` folder**:

   ```shell
   cd url-shortener
   ```

3. **Install the dependencies**:

   ```shell
   npm install
   ```

   Install Node.js and dependencies just run npm install to install (`express`, `body-parser`, `express-validator`, `sqlite3`, `valid-url`).

4. **Run the application**:

   ```shell
   npm start
   ```

5. **Use the application**:
   - Go to [localhost:3000](http://localhost:3000) to use the app.
   - Click the "Add" button to add a new URL.
   - You can edit or delete URLs as needed.
6. Run the Node.js application.
7. To run tests on the app type `npm test`

## Example

- **Request**:

  ```json
  POST /shorten
  {
    "url": "https://example.com/very-long-url-to-be-shortened"
  }

## Authors

👤 **Author**

- GitHub: [@Tendai Nyandoro](https://github.com/tnyandoro)
- Twitter: [@tendai28](https://twitter.com/tendai28)
- LinkedIn: [Tendai Nyandoro](https://www.linkedin.com/in/tendai-nyandoro-a8060826/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/tnyandoro/url-shortener).
