import { useSettingStore } from '@/entities/settings'
import { cn } from '@/shared/lib/utils'
import { Cal } from '@/shared/ui/cal-heatmap'
import { RepoHeatmap } from '@/shared/ui/repo-heatmap'
import { useQueries } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { RecordType } from 'zod'

import { Badge } from '@/shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

export const PullRequestsAllPage = () => {
  const { setting, members, memberIdMap } = useSettingStore((state) => state)
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
      <pre>{JSON.stringify({ members, memberIdMap }, null, 2)}</pre>
      <h1 className="mb-4 text-3xl font-bold">All</h1>
      <div className="flex flex-wrap">
        <Card className="mb-2 mr-2">
          <CardHeader>
            <CardTitle>All Repositories</CardTitle>
            <CardDescription>TOTAL PULL Requests: {filteredPullRequests.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Cal foo="some- text" data={heatmapData} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mb-4">
        {Object.keys(users).map((username) => (
          <Badge
            key={username}
            variant="outline"
            className="mr-1"
            onClick={() => {
              setUserFilter(username)
              setRepositoryFilter(null)
            }}
          >
            @{username} ({users[username]['open'] || 0}/{users[username]['closed'] || 0})
          </Badge>
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
      <Tabs defaultValue="repositories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="repositories">
          <div className="flex flex-wrap">
            {[...respositoryPullRequestsCount.keys()].map((repo) => (
              <Card key={repo} className="mb-2 mr-2">
                <CardHeader>
                  <CardTitle>
                    <button onClick={() => setRepositoryFilter(repo)}>{repo}</button>
                  </CardTitle>
                  <CardDescription>
                    PULL Requests: ({respositoryPullRequestsCount.get(repo)})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <RepoHeatmap
                      data={pullRequests}
                      repository={repo}
                      userIds={userFilter ? [userFilter] : []}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        </TabsContent>
        <TabsContent value="pull-requests">
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
                  <div>{pull.user.id}</div>
                  <div>{pull.created_at}</div>
                  <div>state: {pull.state}</div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
