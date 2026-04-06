import { useSettingStore } from '@/entities/settings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'

export const HomePage = () => {
  const { setting } = useSettingStore((state) => state)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">GitHub PR Viewer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          GitHub 조직의 Pull Request를 시각적으로 분석하는 데스크톱 애플리케이션
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">PR 시각화</CardTitle>
            <CardDescription>날짜별 히트맵과 파이 차트로 PR 활동 패턴을 분석합니다.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">다중 레포 조회</CardTitle>
            <CardDescription>조직 내 여러 리포지토리의 PR을 한번에 수집하고 비교합니다.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">필터링</CardTitle>
            <CardDescription>사용자별, 리포지토리별로 PR을 필터링하여 분석합니다.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">팀 멤버 관리</CardTitle>
            <CardDescription>GitHub 사용자 ID와 팀 멤버를 매핑하고 그룹별로 분류합니다.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Separator className="my-8" />

      {setting ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">현재 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">조직:</span>
                <Badge variant="secondary">{setting.org || '-'}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">레포지토리:</span>
                <Badge variant="outline">{setting.repositories?.length ?? 0}개</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">토큰:</span>
                <Badge variant={setting.accessToken ? 'default' : 'destructive'}>
                  {setting.accessToken ? '설정됨' : '미설정'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">시작하기</CardTitle>
            <CardDescription>
              Settings 페이지에서 GitHub 토큰과 조직명을 설정하면 PR 분석을 시작할 수 있습니다.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
