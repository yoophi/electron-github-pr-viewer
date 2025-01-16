import { useSettingStore } from '@/entities/settings'
import { cn } from '@/shared/lib/utils'
import { Cal } from '@/shared/ui/cal-heatmap'
import { RepoHeatmap } from '@/shared/ui/repo-heatmap'
import { useQueries } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { RecordType } from 'zod'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Link } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'

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
  const mmm = { ...members }
  pullRequests.forEach((pull) => {
    if (!users.hasOwnProperty(pull.user.login)) {
      users[pull.user.login] = {}
    }
    users[pull.user.login][pull.state] =
      typeof users[pull.user.login][pull.state] === 'number'
        ? users[pull.user.login][pull.state] + 1
        : 1

    // if (!members.hasOwnProperty(pull))
    // if (!memberIdMap.hasOwnProperty(pull.user.id)) {
    //   console.log(pull.user.id)
    //   memberIdMap[pull.user.id] = { name: pull.user.login, ids: [pull.user.id], groups: [] }
    //   mmm[pull.user.login] = { name: pull.user.login, ids: [pull.user.id], groups: [] }
    // }
    // memberIdMap[pull.user.id][pull.state] =
    //   typeof memberIdMap[pull.user.id][pull.state] === 'number'
    //     ? memberIdMap[pull.user.id][pull.state] + 1
    //     : 1
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

  // chart

  // const chartData = [
  //   { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  //   { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  //   { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
  //   { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  //   { browser: 'other', visitors: 190, fill: 'var(--color-other)' }
  // ]

  const chartData = Object.keys(contributers).map((username) => ({
    browser: username,
    visitors: contributers[username],
    fill: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }))

  const chartConfig = {
    visitors: {
      label: 'Visitors'
    },
    chrome: {
      label: 'Chrome',
      color: 'hsl(var(--chart-1))'
    },
    safari: {
      label: 'Safari',
      color: 'hsl(var(--chart-2))'
    },
    firefox: {
      label: 'Firefox',
      color: 'hsl(var(--chart-3))'
    },
    edge: {
      label: 'Edge',
      color: 'hsl(var(--chart-4))'
    },
    other: {
      label: 'Other',
      color: 'hsl(var(--chart-5))'
    }
  } satisfies ChartConfig

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])

  return (
    <div>
      {/* <pre>{JSON.stringify({ members, memberIdMap }, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify({ mmm, memberIdMap }, null, 2)}</pre> */}
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
        {Object.keys(mmm).map((username) => (
          <Badge key={username} variant="outline" className="mr-1" onClick={() => {}}>
            {username}
          </Badge>
        ))}
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
      </div>
      <div className="mb-4">
        <Button
          size="sm"
          onClick={() => {
            setUserFilter(null)
            setRepositoryFilter(null)
          }}
        >
          reset user filter
        </Button>
      </div>
      <div>TOTAL: {filteredPullRequests.length}</div>

      <ChartContainer config={chartConfig} className="aspect-square max-h-[250px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="text-3xl font-bold fill-foreground"
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Pull Requests
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <div>
        {repositoryFilter && (
          <>
            <h3 className="mt-4 text-xl font-bold">{repositoryFilter}</h3>
            <div>
              <Button size="sm" onClick={() => setRepositoryFilter(null)}>
                reset
              </Button>
            </div>
          </>
        )}

        {!userFilter && repositoryFilter && (
          <ul>
            {Object.keys(contributers).map((username) => (
              <li key={username}>
                {username}: {contributers[username]}
              </li>
            ))}
          </ul>
        )}
      </div>

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
                    <a
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block ml-1"
                    >
                      <Link size={10} />
                    </a>
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
