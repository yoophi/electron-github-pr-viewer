import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

export const PullRequestsContainerPage = () => {
  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">Pull Requests</h1>
      <ul>
        <li>
          <Link to="./all">all</Link>
        </li>
        <li>
          <Link to="./group-by-repository">group by repositories</Link>
        </li>
      </ul>
      <div>
        <Outlet />
      </div>
    </>
  )
}
