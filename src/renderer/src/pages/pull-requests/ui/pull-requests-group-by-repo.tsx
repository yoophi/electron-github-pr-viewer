import { useSettingStore } from '@/entities/settings'
import { usePullRequests } from '@/entities/pull-request'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { AlertCircle } from 'lucide-react'

export const PullRequestsGroupByRepositoryPage = () => {
  const { setting } = useSettingStore((state) => state)

  const queries = usePullRequests(setting?.repositories ?? [], setting?.accessToken)

  if (!setting) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>설정이 로드되지 않았습니다.</AlertDescription>
      </Alert>
    )
  }

  const repositories = (setting.repositories ?? []).map((repo, i) => ({
    name: repo,
    pulls: Array.isArray(queries[i]?.data) ? queries[i].data! : [],
    isLoading: queries[i]?.isLoading ?? true,
    isError: queries[i]?.isError ?? false
  }))

  return (
    <div className="space-y-4">
      {repositories.map(({ name, pulls, isLoading, isError }) => (
        <Card key={name}>
          <CardHeader>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>
              {isLoading ? 'loading...' : isError ? 'failed to load' : `${pulls.length} PRs`}
            </CardDescription>
          </CardHeader>
          {pulls.length > 0 && (
            <CardContent>
              <div className="space-y-2">
                {pulls.map((pull) => (
                  <div key={pull.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{pull.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {pull.base.ref} &middot; {pull.user.login}
                      </div>
                    </div>
                    <Badge variant={pull.state === 'open' ? 'default' : 'secondary'}>
                      {pull.state}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
