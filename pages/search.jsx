import { memo, isValidElement } from 'react'
import { withRouter } from 'next/router'
import {
  Row, Col, List, Pagination,
} from 'antd'
import Link from 'next/link'
import classNames from 'classnames'
import Repo from '../components/Repo'
import { request } from '../lib/api'
/**
  * 关心的search条件
  * sort: 排序方式
  * order: 排序升降顺序
  * lang: 仓库开发主语言
  * page: 分页
  */
const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Vue', 'React']
const SORT_TYPES = [
  {
    name: 'Best Match',
  },
  {
    name: 'Most Starts',
    sort: 'stars',
    order: 'desc',
  },
  {
    name: 'Fewest Starts',
    sort: 'stars',
    order: 'asc',
  },
  {
    name: 'Most Forks',
    sort: 'forks',
    order: 'desc',
  },
  {
    name: 'Fewest Forks',
    sort: 'forks',
    order: 'asc',
  },
]

const PER_PAGE = 20

const FilterLink = memo(({
  children, query, lang, sort, order, page, selected,
}) => {
  if (selected) {
    return <span>{children}</span>
  }

  let queryString = `?query=${query}`

  if (lang) {
    queryString += `&lang=${lang}`
  }

  if (sort) {
    queryString += `&sort=${sort}&order=${order}`
  }

  if (page) {
    queryString += `&page=${page}`
  }

  queryString += `&per_page=${PER_PAGE}`

  return (
    <Link href={`/search${queryString}`}>
      {isValidElement(children) ? children : <a>{children}</a>}
    </Link>
  )
})

const Search = ({ router, repos }) => {
  const {
    sort, order, lang, page = 1,
  } = router.query

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGES}
            header={(
              <span className="list-header">语言</span>
            )}
            renderItem={(language) => {
              const selected = lang === language

              return (
                <List.Item className={classNames({
                  selected,
                })}
                >
                  <FilterLink
                    {...router.query}
                    selected={selected}
                    lang={language}
                  >{language}
                  </FilterLink>
                </List.Item>
              )
            }}
          />
          <List
            bordered
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            header={(
              <span className="list-header">排序</span>
            )}
            renderItem={(sortItem) => {
              const { name: itemName, sort: itemSort, order: itemOrder } = sortItem
              let selected = false
              if (itemName === 'Best Match' && !sort) {
                selected = true
              } else if (itemSort === sort && itemOrder === order) {
                selected = true
              }
              return (
                <List.Item className={classNames({
                  selected,
                })}
                >
                  <FilterLink
                    {...router.query}
                    selected={selected}
                    sort={itemSort}
                    order={itemOrder}
                  >{itemName}
                  </FilterLink>
                </List.Item>
              )
            }}
          />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          {
            repos.items.map((repo) => <Repo repo={repo} key={repo.id} />)
          }
          <div className="pagination">
            <Pagination
              pageSize={PER_PAGE}
              current={Number(page)}
              total={repos.total_count}
              onChange={() => {}}
              itemRender={(renderPage, renderType, renderOl) => {
                const targetPage = renderType === 'page'
                  ? renderPage
                  : renderType === 'prev'
                    ? page - 1
                    : page + 1

                const name = renderType === 'page' ? renderPage : renderOl

                return <FilterLink {...router.query} page={targetPage}>{name}</FilterLink>
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        :global(.ant-list-item.selected) {
          border-left: 2px solid #e36209;
          font-weight: 100
        }
        
        .root {
          padding: 20px 0;
        }

        .list-header {
          font-weight: 800;
          font-size: 16px;
        }

        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }

        .pagination {
          margin-top: 16px;
          text-align: right;
        }
       `}
      </style>
    </div>
  )
}

Search.getInitialProps = async ({ ctx }) => {
  const {
    query, sort, lang, order = 'desc', page,
  } = ctx.query

  if (!query) {
    return {
      repos: {
        total_count: 0,
      },
    }
  }

  let queryString = `?q=${query}`

  if (lang) {
    queryString += `+language:${lang}`
  }

  if (sort) {
    queryString += `&sort=${sort}&order=${order}`
  }

  if (page) {
    queryString += `&page=${page}`
  }

  queryString += `&per_page=${PER_PAGE}`

  const result = await request({
    url: `/search/repositories${queryString}`,
  }, ctx.req, ctx.res)

  return {
    repos: result.data,
  }
}

export default withRouter(Search)
