import { useEffect } from 'react'
import LRU from 'lru-cache'

const isServer = typeof window === 'undefined'
const CACHE_KEY = 'cache'
export default function initClientCache(lruConfig) {
  // 默认10分钟缓存
  const {
    maxAge = 1000 * 60 * 10,
    ...restConfig
  } = lruConfig || {}

  const lruCache = new LRU({
    maxAge,
    ...restConfig,
  })

  function cache(fn) {
    // 服务端不能保留缓存 会在多个用户之间共享
    if (isServer) {
      return fn
    }

    return async (...args) => {
      const cached = lruCache.get(CACHE_KEY)
      if (cached) {
        return cached
      }
      const result = await fn(...args)
      lruCache.set(CACHE_KEY, result)
      return result
    }
  }

  function setCache(cachedData) {
    lruCache.set(CACHE_KEY, cachedData)
  }

  // 允许客户端外部手动设置缓存数据
  function useCache(cachedData) {
    useEffect(() => {
      setCache(cachedData)
    }, [])
  }

  return {
    cache,
    useCache,
    setCache,
  }
}
