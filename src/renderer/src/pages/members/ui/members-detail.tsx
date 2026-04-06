import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

export const MembersDetailPage = () => {
  const { memberId } = useParams()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Member Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">Member ID: {memberId}</div>
      </CardContent>
    </Card>
  )
}
