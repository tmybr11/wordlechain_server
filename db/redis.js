require('dotenv').config()
const Redis = require('ioredis');
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST) 

module.exports = client