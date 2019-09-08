import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { request } from '../lib/api'

const { Option } = Select

function SearchUser({ onChange, value, style }) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])
  const lastFetchIdRef = useRef(0)

  const fetchUser = useCallback(
    debounce(
      async (searchValue, fetchId) => {
        setFetching(true)
        setOptions([])
        const { data } = await request({
          url: `/search/users?q=${searchValue}`,
        })
        const userOptions = data.items.map(((user) => ({
          text: user.login,
          value: user.login,
        })))

        if (fetchId === lastFetchIdRef.current) {
          setOptions(userOptions)
        } else {
          setOptions([])
        }
        setFetching(false)
      },
      500,
    ),
    [],
  )

  const fetchUserBefore = (searchValue) => {
    lastFetchIdRef.current += 1
    if (searchValue.trim()) {
      return fetchUser(searchValue, lastFetchIdRef.current)
    }
    return null
  }

  const handleChange = (selectValue) => {
    onChange(selectValue)
    setOptions([])
  }

  return (
    <Select
      allowClear
      showSearch
      value={value}
      onChange={handleChange}
      onSearch={fetchUserBefore}
      notFoundContent={fetching ? <Spin size="small" /> : <span>找不到用户</span>}
      // 禁用本地搜索
      filterOption={false}
      placeholder="创建者"
      style={({ width: 200, ...style })}
    >
      {options.map((option) => {
        const {
          value: optionValue,
          text: optionText,
        } = option
        return (
          <Option key={optionValue} value={optionValue}>
            {optionText}
          </Option>
        )
      })}
    </Select>
  )
}

export default SearchUser
