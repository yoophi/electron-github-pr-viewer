import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { useSettingStore } from '../settings/model'

export const PullRequestsPage = () => {
  const { setting } = useSettingStore((state) => state)

  if (!setting) {
    return <>setting not found</>
  }

  const queries = useQueries({
    queries: setting.repositories?.map((repo) => ({
      queryKey: ['pull-requests', repo],
      queryFn: async () => {
        const { data } = await window.api.getPullRequests({
          accessToken: setting.accessToken,
          repository: repo
        })
        return data
      }
    }))
  })

  return (
    <>
      <div>PullRequestsPage</div>
      <div>
        {queries.map((query, i) => (
          <div className="p-4 border" key={i}>
            {query.data?.map((pull) => (
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
    </>
  )
}
