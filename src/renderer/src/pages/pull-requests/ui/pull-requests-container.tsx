import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

export const PullRequestsContainerPage = () => {
  const location = useLocation()
  const isGroupByRepo = location.pathname.includes('group-by-repository')

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Pull Requests</h1>
      <div className="flex gap-2 mb-4">
        <Button variant={isGroupByRepo ? 'ghost' : 'default'} size="sm" asChild>
          <Link to="./all">All</Link>
        </Button>
        <Button variant={isGroupByRepo ? 'default' : 'ghost'} size="sm" asChild>
          <Link to="./group-by-repository">Group by Repository</Link>
        </Button>
      </div>
      <Separator className="mb-4" />
      <Outlet />
    </div>
  )
}
