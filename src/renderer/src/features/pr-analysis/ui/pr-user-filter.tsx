import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

type PrUserFilterProps = {
  users: Record<string, Record<string, number>>
  activeUser: string | null | undefined
  onSelectUser: (username: string) => void
  onReset: () => void
}

export function PrUserFilter({ users, activeUser, onSelectUser, onReset }: PrUserFilterProps) {
  return (
    <>
      <div className="mb-4">
        {Object.keys(users).map((username) => (
          <Badge
            key={username}
            variant="outline"
            className="mr-1"
            onClick={() => onSelectUser(username)}
          >
            @{username} ({users[username]['open'] || 0}/{users[username]['closed'] || 0})
          </Badge>
        ))}
      </div>
      {activeUser && (
        <div className="mb-4">
          <Button size="sm" onClick={onReset}>
            reset user filter
          </Button>
        </div>
      )}
    </>
  )
}
