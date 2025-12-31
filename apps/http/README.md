# HTTP API Service

## Security

This API is secured with **API Key authentication**. All requests must include a valid API key in the request headers.

### Authentication

Include the API key in the `X-Api-Key` header:

```bash
curl -X POST http://localhost:3002/api/message \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: your-api-key-here" \
  -d '{
    "phoneNumber": "0123456789",
    "message": "Hello World",
    "metadata": {
      "doctorName": "Dr. Smith",
      "jobTitle": "Surgeon",
      "facilityName": "General Hospital",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-31T23:59:59.000Z",
      "confirmationUrl": "https://example.com/confirm",
      "applicationId": "APP-12345"
    }
  }'
```

### Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set your API key in `.env`:
   ```env
   API_KEY=your-secure-random-api-key
   ```

3. Generate a secure API key:
   ```bash
   # Using openssl
   openssl rand -base64 32
   
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

### Response Codes

- **200 OK**: Request successful
- **401 Unauthorized**: Missing or invalid API key
- **400 Bad Request**: Invalid request body/validation error

### Security Best Practices

1. **Never commit** your `.env` file to version control
2. **Use strong, random API keys** (minimum 32 characters)
3. **Rotate API keys** periodically
4. **Use HTTPS** in production
5. **Store API keys securely** in your calling services (environment variables, secrets manager)

## API Endpoints

### POST /api/message

Send a WhatsApp message notification.

**Request Body:**
```json
{
  "phoneNumber": "string (9-13 digits)",
  "message": "string",
  "metadata": {
    "doctorName": "string",
    "jobTitle": "string",
    "facilityName": "string",
    "startDate": "Date",
    "endDate": "Date",
    "confirmationUrl": "string",
    "applicationId": "string"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Development

```bash
# Run locally
bun dev

# Build
bun run build

# Run with Docker
docker compose -p maulocum up -d
```
