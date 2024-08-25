# Email Service

A resilient email sending service with retry, fallback, idempotency, rate limiting, and status tracking.

## Features

- Retry mechanism with exponential backoff
- Fallback between providers on failure
- Idempotency to prevent duplicate sends
- Basic rate limiting
- Status tracking for email sending attempts
- Circuit breaker pattern (bonus)
- Simple logging (bonus)
- Basic queue system (bonus)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/email-service.git
   cd email-service
   ```
