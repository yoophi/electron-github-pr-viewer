import { useEffect, useState } from 'react'
import { useSettingStore } from '../settings/model'

export const RepositoriesPage = () => {
  const { setting } = useSettingStore((state) => state)
  const [repositories, setRepositories] = useState<any[]>()

  if (!setting?.accessToken) {
    return <div>access_token not found</div>
  }

  useEffect(() => {
    window.api.getRepositories(setting?.accessToken).then((resp) => {
      const { data } = resp
      setRepositories(data)
    })
  }, [])

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
