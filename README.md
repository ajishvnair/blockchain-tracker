# Blockchain Price Tracker

A NestJS application that tracks cryptocurrency prices using Moralis API, with features for price alerts and swap rate calculations.

## Features

- Automatically tracks Ethereum and Polygon prices every 5 minutes
- Sends email alerts when price increases by more than 3% in an hour
- Calculates ETH to BTC swap rates with fee estimation
- Custom price alerts for users

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Moralis API key
- SMTP credentials for email notifications

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
MORALIS_API_KEY=your_moralis_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Installation & Running

1. Clone the repository:
```bash
git clone https://github.com/ajishvnair/blockchain-tracker.git
cd blockchain-tracker
```

2. Start the application using Docker:
```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`

## API Endpoints

### 1. Get Hourly Prices
```http
GET /prices/hourly?chain=ethereum
```
Returns price data for the last 24 hours for specified chain.

### 2. Get Swap Rate
```http
GET /prices/swap-rate?ethAmount=1.0
```
Calculates ETH to BTC conversion rate with fees.

### 3. Set Price Alert
```http
POST /alerts
Content-Type: application/json

{
  "chain": "ethereum",
  "targetPrice": 2000.00,
  "email": "user@example.com"
}
```
Sets up email alerts for when a cryptocurrency reaches a target price.

## Project Structure

```
blockchain-tracker/
├── src/
│   ├── alert/
│   │   ├── alert.controller.ts
│   │   ├── alert.service.ts
│   │   ├── alert.module.ts
│   │   └── alert.entity.ts
│   ├── price/
│   │   ├── price.controller.ts
│   │   ├── price.service.ts
│   │   ├── price.module.ts
│   │   └── price.entity.ts
│   ├── email/
│   │   ├── email.service.ts
│   │   └── email.module.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml
├── Dockerfile
├── .env
├── .gitignore
└── package.json
```

## Database Schema

### Price Table
```sql
CREATE TABLE price (
    id SERIAL PRIMARY KEY,
    chain VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Alert Table
```sql
CREATE TABLE alert (
    id SERIAL PRIMARY KEY,
    chain VARCHAR(50) NOT NULL,
    target_price DECIMAL(10, 2) NOT NULL,
    email VARCHAR(255) NOT NULL,
    triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Automatic Features

1. **Price Tracking**
   - Runs every 5 minutes
   - Stores prices in database
   - Tracks Ethereum and Polygon

2. **Price Increase Alerts**
   - Checks for >3% increase in last hour
   - Sends email to hyperhire_assignment@hyperhire.in

3. **Custom Price Alerts**
   - Users can set target prices
   - Email notification when price reaches target

## Development

### Running in Development Mode
```bash
# Start with debug logging
docker compose up --build

# View logs
docker compose logs -f




