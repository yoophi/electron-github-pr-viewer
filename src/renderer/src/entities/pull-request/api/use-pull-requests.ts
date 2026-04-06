import { useQueries } from '@tanstack/react-query'

export function usePullRequests(repositories: string[], accessToken?: string) {
  return useQueries({
    queries: repositories.map((repository) => ({
      queryKey: ['pull-requests', repository],
      queryFn: async () => {
        const result = await window.api.getPullRequests({
          accessToken: accessToken!,
          repository,
          params: { state: 'all' }
        })
        return result.data
      },
      meta: { repository },
      enabled: !!accessToken
    }))
  })
}
