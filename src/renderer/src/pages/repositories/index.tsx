import { useQuery } from '@tanstack/react-query'
import { useSettingStore } from '../settings/model'

export const RepositoriesPage = () => {
  const { setting } = useSettingStore((state) => state)

  if (!setting?.accessToken) {
    return <div>access_token not found</div>
  }

  const {
    data: repositories,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      const { data } = await window.api.getRepositories(setting.accessToken)
      return data
    }
  })

  if (isLoading) {
    return <div>loading...</div>
  }

  if (isError) {
    return <div>{error?.message}</div>
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Repositories</h1>
      {repositories &&
        repositories
          .filter((repo) => repo.topics.includes('frontend'))
          .map((repo, index) => {
            const { full_name, topics } = repo
            return (
              <div key={repo.full_name} className="p-4 border">
                <p>#{index + 1}</p>
                <pre className="font-sm">{JSON.stringify({ full_name, topics }, null, 2)} </pre>
              </div>
            )
          })}
    </div>
  )
}
