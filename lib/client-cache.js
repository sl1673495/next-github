import { useEffect } from 'react'
import LRU from 'lru-cache'

const isServer = typeof window === 'undefined'
const DEFAULT_CACHE_KEY = 'cache'
export default function initClientCache({ lruConfig = {}, genCacheKeyStrate } = {}) {
  // 默认10分钟缓存
  const {
    maxAge = 1000 * 60 * 10,
    ...restConfig
  } = lruConfig || {}

  const lruCache = new LRU({
    maxAge,
    ...restConfig,
  })

  function getCacheKey(context) {
    return genCacheKeyStrate ? genCacheKeyStrate(context) : DEFAULT_CACHE_KEY
  }

  function cache(fn) {
    // 服务端不能保留缓存 会在多个用户之间共享
    if (isServer) {
      return fn
    }

    return async (...args) => {
      const key = getCacheKey(...args)
      const cached = lruCache.get(key)
      if (cached) {
        return cached
      }
      const result = await fn(...args)
      lruCache.set(key, result)
      return result
    }
  }

  function setCache(key, cachedData) {
    lruCache.set(key, cachedData)
  }

  // 允许客户端外部手动设置缓存数据
  function useCache(key, cachedData) {
    useEffect(() => {
      if (!isServer) {
        setCache(key, cachedData)
      }
    }, [])
  }

  return {
    cache,
    useCache,
    setCache,
  }
}
