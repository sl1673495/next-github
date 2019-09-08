import { useState, useCallback } from 'react'
import { Avatar, Button, Select } from 'antd'
import { useRouter } from 'next/router'
import WithRepoBasic from '../../components/WithRepoBasic'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import SearchUser from '../../components/SearchUser'
import { request } from '../../lib/api'
import { getTimeFromNow, genDetailCacheKeyStrate, genDetailCacheKey } from '../../lib/util'
import initCache from '../../lib/client-cache'

const { Option } = Select

const { cache, useCache } = initCache({
  genCacheKeyStrate: (context) => {
    return genDetailCacheKeyStrate(context)
  },
})

const IssueDetail = ({ issue }) => {
  return (
    <div className="root">
      <MarkdownRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">打开issue讨论页面</Button>
      </div>
      <style jsx>{`
        .root {
          background: #fefefe;
          padding: 20px;
        }
        
        .actions {
          text-align: right;
        }
      `}
      </style>
    </div>
  )
}

const Label = ({ label }) => {
  return (
    <>
      <span
        className="label"
      >
        {label.name}
        <style jsx>{`
        .label {
          margin-left: 8px;
          height: 20px;
          padding: .15em 4px;
          font-size: 12px;
          font-weight: 600;
          line-height: 15px;
          border-radius: 2px;
          box-shadow: inset 0 -1px 0 rgba(27,31,35,.12);
          background-color: #${label.color};
        }
      `}
        </style>
      </span>
    </>
  )
}

const IssueItem = ({ issue }) => {
  const [showDetail, setShowDetail] = useState(false)

  const toggleShowDetail = useCallback(() => {
    setShowDetail((show) => !show)
  }, [])

  return (
    <div className="root">
      <div className="issue">
        <Button
          onClick={toggleShowDetail}
          className="view-btn"
          type="primary"
          size="small"
        >查看
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {
              issue.labels.map((label) => <Label label={label} key={label.id} />)
            }
          </h6>
          <p className="sub-info">
            <span>Updated at {getTimeFromNow(issue.updated_at)}</span>
          </p>
        </div>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
      <style jsx>
        {`
          :global(.view-btn) {
            position: absolute;
            right: 10px;
            top: 10px
          }

          .root + .root {
            border-top: 1px solid #eee;
          }

          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }

          .issue:hover {
            background: #fafafa;
          }

          .main-info > h6 {
            padding-right: 40px;
            font-size: 16px;
            word-break: break-all;
          }

          .avatar {
            margin-right: 20px;
          }

          .sub-info {
            margin-bottom: 0;
          }

          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}
      </style>
    </div>

  )
}

function makeQuery(creator, state, labels) {
  const creatorStr = creator ? `creator=${creator}` : ''
  const stateStr = state ? `state=${state}` : ''
  let labelStr = ''
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(',')}`
  }

  const arr = []

  if (creatorStr) {
    arr.push(creatorStr)
  }
  if (stateStr) {
    arr.push(stateStr)
  }
  if (labelStr) {
    arr.push(labelStr)
  }

  return `?${arr.join('&')}`
}

const Issues = ({ services }) => {
  const router = useRouter()
  useCache(genDetailCacheKey(router), { services })

  const { initIssues, labels } = services
  const [creator, setCreator] = useState()
  const [issueState, setIssueState] = useState()
  const [selectedLabels, setSelectedLabels] = useState([])
  const [issues, setIssues] = useState(initIssues)
  const [fetching, setFetching] = useState(false)
  const handleLabelsChange = (selected) => {
    setSelectedLabels(selected)
  }

  const { owner, name } = router.query
  const handleSearch = async () => {
    setFetching(true)
    const { data: resultIssues } = await request({
      url: `/repos/${owner}/${name}/issues${makeQuery(creator, issueState, selectedLabels)}`,
    })
    setIssues(resultIssues)
    setFetching(false)
  }

  const selectCommenStyle = {
    alignSelf: 'flex-start',
    width: 200,
    marginLeft: 20,
  }
  return (
    <div className="root">
      <div className="search">
        <SearchUser
          style={selectCommenStyle}
          value={creator}
          onChange={setCreator}
        />
        <Select
          allowClear
          onChange={setIssueState}
          value={issueState}
          placeholder="状态"
          style={selectCommenStyle}
        >
          <Option value="all">全部</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>

        <Select
          allowClear
          mode="multiple"
          onChange={handleLabelsChange}
          value={selectedLabels}
          placeholder="Label"
          style={{ flexGrow: 1, width: 200, margin: '0 20px' }}
        >
          {labels.map((label) => (
            <Option value={label.id} key={label.id}>
              {label.name}
            </Option>
          ))}
        </Select>
        <Button
          loading={fetching}
          onClick={handleSearch}
          size="small"
          type="primary"
          style={{ marginRight: 11 }}
        >
          搜索
        </Button>
      </div>
      <div className="issues">
        {issues.map((issue) => {
          return <IssueItem key={issue.id} issue={issue} />
        })}
      </div>
      <style jsx>
        {`
          .issues {
            border: 1px solid #eee;
            border-radius: 5px;
            margin-bottom: 20px;
            margin-top: 20px;
          }

          .search {
            display: flex;
            align-items: center;
          }
        `}
      </style>
    </div>
  )
}

Issues.getInitialProps = cache(async ({ ctx }) => {
  const { owner, name } = ctx.query
  const [
    { data: initIssues },
    { data: labels },
  ] = await Promise.all(
    [
      request(
        {
          url: `/repos/${owner}/${name}/issues`,
        },
        ctx.req,
        ctx.res,
      ),
      request(
        {
          url: `/repos/${owner}/${name}/labels`,
        },
        ctx.req,
        ctx.res,
      ),
    ],
  )

  return {
    services: {
      initIssues,
      labels,
    },
  }
})

export default WithRepoBasic(Issues, 'issues')
