# URL Shortening Service

This project is a simple URL shortening service built with Node.js and NestJS. It allows users to shorten URLs, decode them back to their original form, and view statistics about URL usage.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v18.17.0 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/arxarinze/shortner.git
   cd shortner
   ```

2. Install the project dependencies:

   ```bash
   npm install
   ```

   ```bash
   yarn install
   ```

### Running the Application

1. Start the application in development mode:

```bash
npm run start:dev
````

### OR

```bash
 yarn run start:dev
```

2. The service will be available at [http://localhost:3000](http://localhost:3000).

## API Endpoints

The service provides the following endpoints:

- **POST /url/encode**: Encodes a given URL to a shortened URL.

  **Body**: `{ "url": "https://example.com" }`

  **Response**: `{ "shortUrl": "http://short.est/abcd1234" }`

- **GET /url/decode/:urlPath**: Decodes a shortened URL to its original URL.

  **Response**: `{ "originalUrl": "https://example.com" }`

- **GET /url/statistic/:urlPath**: Returns statistics for a shortened URL.

  **Response**: `{ "originalUrl": "https://example.com", "accessCount": 5 }`

- **GET /:urlPath**: Redirects to the original URL associated with the shortened path.

### Using the API

You can use tools like Postman or cURL to interact with the API. Here are some example cURL commands:

- Encode a URL:

  ```bash
  curl -X POST http://localhost:3000/url/encode -H 'Content-Type: application/json' -d '{"url": "https://example.com"}'
  ```

- Decode a URL:

  ```bash
  curl http://localhost:3000/url/decode/abcd1234
  ```

- Get URL statistics:

  ```bash
  curl http://localhost:3000/url/statistic/abcd1234
  ```

- You can also use the link provided to perform the neccessary redirect

## Running Tests

To run the automated tests for this project, execute:

```bash
npm run test
```
