import { useSettingStore } from '@/entities/settings'
import { usePullRequests } from '@/entities/pull-request'
import {
  flattenQueryResults,
  aggregateUserStats,
  aggregateByRepository,
  aggregateByDate,
  aggregateContributors,
  toChartData,
  PrContributionChart,
  PrUserFilter
} from '@/features/pr-analysis'
import { cn } from '@/shared/lib/utils'
import { Cal } from '@/shared/ui/cal-heatmap'
import { RepoHeatmap } from '@/shared/ui/repo-heatmap'
import { useMemo, useState } from 'react'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Link } from 'lucide-react'

export const PullRequestsAllPage = () => {
  const { setting } = useSettingStore((state) => state)
  const [userFilter, setUserFilter] = useState<string | null>(null)
  const [repositoryFilter, setRepositoryFilter] = useState<string | null>(null)

  const queries = usePullRequests(setting?.repositories ?? [], setting?.accessToken)

  const queryStatus = useMemo(() => flattenQueryResults(queries), [queries])
  const { pullRequests } = queryStatus
  const users = useMemo(() => aggregateUserStats(pullRequests), [pullRequests])

  const filteredPullRequests = useMemo(
    () => (userFilter ? pullRequests.filter((pull) => pull.user.login === userFilter) : pullRequests),
    [pullRequests, userFilter]
  )

  const repositoryPrCount = useMemo(() => aggregateByRepository(filteredPullRequests), [filteredPullRequests])

  const filteredByRepo = useMemo(
    () =>
      repositoryFilter
        ? filteredPullRequests.filter((pr) => pr.base.repo.full_name === repositoryFilter)
        : filteredPullRequests,
    [filteredPullRequests, repositoryFilter]
  )

  const heatmapData = useMemo(() => aggregateByDate(filteredByRepo), [filteredByRepo])
  const contributorsByUser = useMemo(() => aggregateContributors(filteredByRepo, 'user'), [filteredByRepo])
  const contributorsByRepo = useMemo(() => aggregateContributors(filteredPullRequests, 'repository'), [filteredPullRequests])

  const chartData = useMemo(
    () => (userFilter ? toChartData(contributorsByRepo) : toChartData(contributorsByUser)),
    [userFilter, contributorsByRepo, contributorsByUser]
  )

  if (!setting) {
    return <>setting not found</>
  }

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">All</h1>

      {(queryStatus.loadingCount > 0 || queryStatus.errorCount > 0) && (
        <div className="flex gap-2 mb-4">
          {queryStatus.loadingCount > 0 && (
            <Badge variant="outline">
              loading: {queryStatus.loadingCount}/{queryStatus.totalQueries}
            </Badge>
          )}
          {queryStatus.errorCount > 0 && (
            <Badge variant="destructive">
              failed: {queryStatus.errorCount}/{queryStatus.totalQueries}
            </Badge>
          )}
          <Badge variant="secondary">
            loaded: {queryStatus.successCount}/{queryStatus.totalQueries}
          </Badge>
        </div>
      )}

      <div className="flex flex-wrap">
        <Card className="mb-2 mr-2">
          <CardHeader>
            <CardTitle>All Repositories</CardTitle>
            <CardDescription>TOTAL PULL Requests: {filteredPullRequests.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Cal data={heatmapData} />
          </CardContent>
        </Card>
      </div>

      <PrUserFilter
        users={users}
        activeUser={userFilter}
        onSelectUser={(username) => {
          setUserFilter(username)
          setRepositoryFilter(null)
        }}
        onReset={() => {
          setUserFilter(null)
          setRepositoryFilter(null)
        }}
      />

      <div>TOTAL: {filteredPullRequests.length}</div>
      {userFilter && <div>USER_FILTER: {userFilter}</div>}

      <PrContributionChart data={chartData} label="Pull Requests" />

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
            {Object.keys(contributorsByUser).map((username) => (
              <li key={username}>
                {username}: {contributorsByUser[username]}
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
            {[...repositoryPrCount.keys()].map((repo) => (
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
                    PULL Requests: ({repositoryPrCount.get(repo)})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RepoHeatmap
                    data={pullRequests}
                    repository={repo}
                    userIds={userFilter ? [userFilter] : []}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pull-requests">
          <div>
            {[...filteredByRepo]
              .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
              .map((pull) => (
                <div
                  className={cn('p-4 border', { 'bg-slate-200': pull.state === 'closed' })}
                  key={pull.id}
                >
                  <div>
                    {pull.base.repo.full_name} - {pull.base.ref}
                  </div>
                  <div className="text-lg font-bold">
                    <a
                      href={pull.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mr-2"
                    >
                      <Link size={12} />
                    </a>
                    {pull.title}
                  </div>
                  <div>
                    {pull.labels.map((label) => (
                      <Badge key={label.id} variant="default" className="mr-1">
                        {label.name}
                      </Badge>
                    ))}
                  </div>
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
