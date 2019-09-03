// 加上前缀
function getRedisSessionId(sessionId) {
  return `ssid:${sessionId}`
}

class RedisSessionStore {
  constructor(client) {
    // node.js的redis-client
    this.client = client
  }

  // 获取redis中存储的session数据
  async get(sessionId) {
    console.log('get sessionId: ', sessionId);
    const id = getRedisSessionId(sessionId)
    // 对应命令行操作redis的get指令，获取value
    const data = await this.client.get(id)
    if (!data) {
      return null
    }
    try {
      const result = JSON.parse(data)
      return result
    } catch (err) {
      console.error(err)
    }
  }

  // 在redis中存储session数据
  async set(sessionId, session, ttl /** 过期时间 */) {
    console.log('set sessionId: ', sessionId);
    const id = getRedisSessionId(sessionId)
    let ttlSecond
    if (typeof ttl === 'number') {
      // 毫秒转秒
      ttlSecond = Math.ceil(ttl / 1000)
    }

    try {
      const sessionStr = JSON.stringify(session)
      // 根据是否有过期时间 调用不同的api
      if (ttl) {
        // set with expire
        await this.client.setex(id, ttlSecond, sessionStr)
      } else {
        await this.client.set(id, sessionStr)
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }

  // 从resid中删除某个session
  // 在koa中 设置ctx.session = null时，会调用这个方法
  async destroy(sessionId) {
    console.log('destroy sessionId: ', sessionId);
    const id = getRedisSessionId(sessionId)
    await this.client.del(id)
  }
}

module.exports = RedisSessionStore
