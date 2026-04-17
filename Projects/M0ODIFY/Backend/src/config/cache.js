const Redis = require('ioredis').default;

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redis;
// Middleware jayega ye cache ke liye, jisme hum check karenge ki data cache me hai ya nahi, agar hai to cache se data return karenge, agar nahi hai to database se data fetch karenge aur cache me store karenge.
