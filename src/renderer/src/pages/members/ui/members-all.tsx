import { useSettingStore } from '@/entities/settings'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Skeleton } from '@/shared/ui/skeleton'
import { AlertCircle } from 'lucide-react'

export const MembersAllPage = () => {
  const { setting, members, error } = useSettingStore((state) => state)

  if (!setting) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-full h-32" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const memberList = Object.values(members)

  if (memberList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
          <CardDescription>
            등록된 멤버가 없습니다. 설정 파일에 members 항목을 추가해주세요.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {memberList.map((member) => (
        <Card key={member.name}>
          <CardHeader>
            <CardTitle className="text-base">{member.name}</CardTitle>
            <CardDescription>
              {member.groups.length > 0 && (
                <span className="flex gap-1 mt-1">
                  {member.groups.map((group) => (
                    <Badge key={group} variant="outline">{group}</Badge>
                  ))}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              GitHub IDs: {member.ids.join(', ')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
