import { useQueries } from '@tanstack/react-query'
import type { PullRequest } from '../model/types'

export function usePullRequests(repositories: string[], accessToken?: string) {
  return useQueries({
    queries: repositories.map((repository) => ({
      queryKey: ['pull-requests', repository],
      queryFn: async (): Promise<PullRequest[]> => {
        const result = await window.api.getPullRequests({
          accessToken: accessToken!,
          repository,
          params: { state: 'all' }
        })
        return result.data as PullRequest[]
      },
      meta: { repository },
      enabled: !!accessToken
    }))
  })
}
