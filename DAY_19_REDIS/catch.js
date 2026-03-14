// npm i ioredis
const redis = require('ioredis');

const redisDatabase = new redis({
    port: process.env.REDIS_PORT, // Redis port
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
});

redisDatabase.on('connect', () => { 
    console.log('Connected to Redis'); 
});

module.exports = redisDatabase;