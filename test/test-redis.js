const Redis = require('ioredis')

const redis = new Redis()

redis.keys('*').then(keys => console.log(keys))
