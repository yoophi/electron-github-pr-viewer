import { Outlet } from 'react-router-dom'
import { Separator } from '@/shared/ui/separator'

export const MembersContainerPage = () => {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Members</h1>
      <Separator className="mb-4" />
      <Outlet />
    </div>
  )
}
