import { useQueries } from '@tanstack/react-query'
import { useSettingStore } from '@/entities/settings'

export const PullRequestsGroupByRepositoryPage = () => {
  const { setting } = useSettingStore((state) => state)

  if (!setting) {
    return <>setting not found</>
  }

  const queries = useQueries({
    queries: setting.repositories?.map((repository) => ({
      queryKey: ['pull-requests', repository],
      queryFn: async () => {
        const { data } = await window.api.getPullRequests({
          accessToken: setting.accessToken,
          repository: repository
        })
        return data
      },
      meta: { repository }
    }))
  })

  return (
    <div>
      {queries.map((query, i) => (
        <div className="p-4 border" key={i}>
          {Array.isArray(query.data) &&
            query.data?.map((pull) => (
              <div className="p-4 border" key={pull.id}>
                <div>
                  {pull.base.repo.full_name} - {pull.base.ref}
                </div>
                <div className="text-lg font-bold">{pull.title}</div>
                <div>{pull.user.login}</div>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
