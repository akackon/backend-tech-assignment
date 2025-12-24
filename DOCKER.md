# Docker Setup

This directory contains Docker configuration for the Quiz API project.

## What's Included

- `docker-compose.yml` - Docker Compose configuration for MongoDB
- `mongo-init/init.js` - MongoDB initialization script

## Quick Start

1. Start the MongoDB container:
   ```bash
   docker-compose up -d
   ```

2. Check that MongoDB is running:
   ```bash
   docker-compose ps
   ```

3. View MongoDB logs:
   ```bash
   docker-compose logs mongodb
   ```

4. Stop the container:
   ```bash
   docker-compose down
   ```

## MongoDB Configuration

- **Container name:** quiz-api-mongodb
- **Port:** 27017
- **Database:** quiz-api
- **Admin user:** admin / adminpassword
- **App user:** quiz_user / quiz_password

## Connection String

For local development with Docker:
```
mongodb://quiz_user:quiz_password@localhost:27017/quiz-api?authSource=quiz-api
```

## Volumes

MongoDB data is persisted in a Docker volume named `mongodb_data`. To completely remove all data:

```bash
docker-compose down -v
```

## Accessing MongoDB Shell

To access the MongoDB shell inside the container:

```bash
docker exec -it quiz-api-mongodb mongosh -u admin -p adminpassword
```

Then switch to the quiz-api database:
```javascript
use quiz-api
```
