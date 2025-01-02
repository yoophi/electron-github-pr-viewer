import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useSettingStore } from '@/entities/settings'
import { cn } from '@/shared/lib/utils'
import { RecordType } from 'zod'
import { Cal } from '@/shared/ui/cal-heatmap'
import dayjs from 'dayjs'
import { RepoHeatmap } from '@/shared/ui/repo-heatmap'

export const PullRequestsAllPage = () => {
  const { setting } = useSettingStore((state) => state)
  const [userFilter, setUserFilter] = useState<string | null>()
  const [repositoryFilter, setRepositoryFilter] = useState<string | null>()

  if (!setting) {
    return <>setting not found</>
  }

  const queries = useQueries({
    queries: setting.repositories?.map((repository) => ({
      queryKey: ['pull-requests', repository],
      queryFn: async () => {
        const { data } = await window.api.getPullRequests({
          accessToken: setting.accessToken,
          repository: repository,
          params: {
            state: 'all'
          }
        })
        return data
      },
      meta: { repository }
    }))
  })

  const pullRequests: any[] = []
  queries.forEach((query, i) => {
    if (!Array.isArray(query.data)) {
      return
    }

    query.data.forEach((pull) => {
      pullRequests.push(pull)
    })
  })

  const users: RecordType<string, any> = {}
  pullRequests.forEach((pull) => {
    if (!users.hasOwnProperty(pull.user.login)) {
      users[pull.user.login] = {}
    }
    users[pull.user.login][pull.state] =
      typeof users[pull.user.login][pull.state] === 'number'
        ? users[pull.user.login][pull.state] + 1
        : 1
  })

  const filteredPullRequests = userFilter
    ? pullRequests.filter((pull) => pull.user.login === userFilter)
    : pullRequests

  const respositoryPullRequestsCount = new Map()
  filteredPullRequests.forEach((pull) => {
    respositoryPullRequestsCount.set(
      pull.base.repo.full_name,
      (respositoryPullRequestsCount.get(pull.base.repo.full_name) || 0) + 1
    )
  })

  const pullRequestsCount = new Map()
  filteredPullRequests
    .filter((repo) => (repositoryFilter ? repo.base.repo.full_name === repositoryFilter : true))
    .forEach((pull) => {
      const pullRequestCreatedDate = dayjs(pull.created_at).format('YYYY-MM-DDT00:00:00')
      pullRequestsCount.set(
        pullRequestCreatedDate,
        (pullRequestsCount.get(pullRequestCreatedDate) || 0) + 1
      )
    })

  const heatmapData = [...pullRequestsCount.keys()].map((key) => ({
    date: key,
    value: pullRequestsCount.get(key)
  }))

  const contributers = filteredPullRequests
    .filter((repo) => (repositoryFilter ? repo.base.repo.full_name === repositoryFilter : true))
    .reduce((prev, curr) => {
      const username = curr.user.login
      return { ...prev, [username]: (prev[username] || 0) + 1 }
    }, {})

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">All</h1>
      <Cal foo="some- text" data={heatmapData} />
      <div className="mb-4">
        {Object.keys(users).map((username) => (
          <button
            key={username}
            className="mr-2"
            onClick={() => {
              setUserFilter(username)
              setRepositoryFilter(null)
            }}
          >
            @{username} ({users[username]['open'] || 0}/{users[username]['closed'] || 0})
          </button>
        ))}
        <button
          className="mr-4"
          onClick={() => {
            setUserFilter(null)
            setRepositoryFilter(null)
          }}
        >
          reset user filter
        </button>
      </div>
      <div>TOTAL: {filteredPullRequests.length}</div>
      <ul>
        {[...respositoryPullRequestsCount.keys()].map((repo) => (
          <li key={repo} className="mr-2">
            <div>
              <button onClick={() => setRepositoryFilter(repo)}>{repo}</button> (
              {respositoryPullRequestsCount.get(repo)})
            </div>
            <div>
              <RepoHeatmap
                data={pullRequests}
                repository={repo}
                userIds={userFilter ? [userFilter] : []}
              />
            </div>
          </li>
        ))}
      </ul>
      {repositoryFilter && <h3 className="my-4 text-xl font-bold">{repositoryFilter}</h3>}

      {!userFilter && repositoryFilter && (
        <ul>
          {Object.keys(contributers).map((username) => (
            <li key={username}>
              {username}: {contributers[username]}
            </li>
          ))}
        </ul>
      )}
      <div>
        {[...filteredPullRequests]
          .filter((repo) =>
            repositoryFilter ? repo.base.repo.full_name === repositoryFilter : true
          )
          .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
          .map((pull) => (
            <div
              className={cn('p-4 border', { 'bg-slate-200': pull.state === 'closed' })}
              key={pull.id}
            >
              <div>
                {pull.base.repo.full_name} - {pull.base.ref}
              </div>
              <div className="text-lg font-bold">{pull.title}</div>
              <div>{pull.user.login}</div>
              <div>{pull.created_at}</div>
              <div>state: {pull.state}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
