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
import {
  useDateRange,
  DatePresetButtons,
  DateRangePicker
} from '@/features/pr-date-filter'
import { cn } from '@/shared/lib/utils'
import { Cal } from '@/shared/ui/cal-heatmap'
import { RepoHeatmap } from '@/shared/ui/repo-heatmap'
import { Separator } from '@/shared/ui/separator'
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
  const { dateRange, activePreset, selectPreset, setCustomRange } = useDateRange()

  const queries = usePullRequests(setting?.repositories ?? [], setting?.accessToken)

  const queryStatus = useMemo(() => flattenQueryResults(queries), [queries])
  const { pullRequests: allPullRequests } = queryStatus

  const pullRequests = useMemo(() => {
    const fromDate = dateRange.from.toLocaleDateString('sv-SE')
    const toDate = dateRange.to.toLocaleDateString('sv-SE')
    return allPullRequests.filter((pr) => {
      // pr.created_at은 UTC ISO 문자열 — UTC 날짜 기준으로 비교 (GitHub UI 표시 기준)
      const createdDate = pr.created_at.slice(0, 10) // "2025-12-31T15:00:00Z" → "2025-12-31"
      return createdDate >= fromDate && createdDate <= toDate
    })
  }, [allPullRequests, dateRange])

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
      <div className="mb-4 space-y-3">
        <DatePresetButtons activePreset={activePreset} onSelect={selectPreset} />
        <DateRangePicker dateRange={dateRange} onChange={setCustomRange} />
      </div>

      <Separator className="mb-4" />

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
            <Cal data={heatmapData} startDate={dateRange.from} endDate={dateRange.to} />
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
                  <CardTitle className="flex items-center gap-1">
                    <Button variant="link" className="h-auto p-0 text-base" onClick={() => setRepositoryFilter(repo)}>
                      {repo}
                    </Button>
                    <Button variant="ghost" size="sm" className="w-6 h-6 p-0" asChild>
                      <a href={`https://github.com/${repo}`} target="_blank" rel="noreferrer">
                        <Link size={10} />
                      </a>
                    </Button>
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
                    startDate={dateRange.from}
                    endDate={dateRange.to}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pull-requests">
          <div className="space-y-2">
            {[...filteredByRepo]
              .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
              .map((pull) => (
                <Card key={pull.id} className={cn({ 'opacity-60': pull.state === 'closed' })}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardDescription>
                        {pull.base.repo.full_name} &middot; {pull.base.ref}
                      </CardDescription>
                      <Badge variant={pull.state === 'open' ? 'default' : 'secondary'}>
                        {pull.state}
                      </Badge>
                    </div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Button variant="ghost" size="sm" className="w-6 h-6 p-0 shrink-0" asChild>
                        <a href={pull.html_url} target="_blank" rel="noreferrer">
                          <Link size={12} />
                        </a>
                      </Button>
                      <span className="truncate">{pull.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap items-center gap-1">
                      {pull.labels.map((label) => (
                        <Badge key={label.id} variant="outline" className="text-xs">
                          {label.name}
                        </Badge>
                      ))}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {pull.user.login} &middot; {pull.created_at}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
