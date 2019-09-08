import Link from 'next/link'
import { withRouter } from 'next/router'
import Repo from './Repo'
import { request } from '../lib/api'
import initCache from '../lib/client-cache'
import { genDetailCacheKeyStrate, genDetailCacheKey } from '../lib/util'

function makeQuery(queryObject) {
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join('='))
      return result
    }, [])
    .join('&')
  return `?${query}`
}

const { cache, useCache } = initCache({
  genCacheKeyStrate: genDetailCacheKeyStrate,
})
export default (Comp, type = 'index') => {
  const WithDetail = ({ repoBasic, router, ...rest }) => {
    useCache(genDetailCacheKey(router), { repoBasic, ...rest })
    const query = makeQuery(router.query)
    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            <Link href={`/detail${query}`}>
              {type === 'index' ? (
                <span className="tab">Readme</span>
              ) : (
                <a title="readme" className="tab index">Readme</a>
              )}
            </Link>
            <Link href={`/detail/issues${query}`}>
              {type === 'issues' ? (
                <span className="tab">Issues</span>
              ) : (
                <a title="issues" className="tab issues">Issues</a>
              )}
            </Link>
          </div>
        </div>
        <div>
          <Comp {...rest} />
        </div>
        <style jsx>{`
            .root {
              padding-top: 20px;
            }
  
            .repo-basic {
              padding: 20px;
              border: 1px solid #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }
  
            .tab + .tab {
              margin-left: 20px;
            }
          `}
        </style>
      </div>
    )
  }

  WithDetail.getInitialProps = cache(async (context) => {
    const { ctx } = context
    const { owner, name } = ctx.query
    const { data } = await request({
      url: `/repos/${owner}/${name}`,
    }, ctx.req, ctx.res)

    let pageData = {}
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context)
    }
    return {
      repoBasic: data,
      ...pageData,
    }
  })

  return withRouter(WithDetail)
}
