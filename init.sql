DROP TABLE IF EXISTS price CASCADE;
DROP TABLE IF EXISTS alert CASCADE;

-- Create price table
CREATE TABLE price (
    id SERIAL PRIMARY KEY,
    chain VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alert table
CREATE TABLE alert (
    id SERIAL PRIMARY KEY,
    chain VARCHAR(50) NOT NULL,
    target_price DECIMAL(10, 2) NOT NULL,
    email VARCHAR(255) NOT NULL,
    triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_price_chain_timestamp ON price(chain, timestamp);
CREATE INDEX idx_alert_chain_triggered ON alert(chain, triggered);