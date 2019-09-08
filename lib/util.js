import moment from 'moment'

moment.locale('zh-cn')
export const genDetailCacheKey = (ctx) => {
  const { query, pathname } = ctx
  const { owner, name } = query
  return `${pathname}-${owner}-${name}`
}

export const genDetailCacheKeyStrate = (context) => {
  const { ctx } = context
  return genDetailCacheKey(ctx)
}

export const genCacheKeyByQuery = (query) => {
  return Object.keys(query).reduce((prev, cur) => {
    prev += query[cur]
    return prev
  }, '')
}

export function getTimeFromNow(time) {
  return moment(time).fromNow()
}
