import { useQuery } from '@tanstack/react-query'

export function useRepositories(accessToken?: string, org?: string) {
  return useQuery({
    queryKey: ['repositories', org],
    queryFn: async () => {
      const { data } = await window.api.getRepositories({
        accessToken: accessToken!,
        org: org!
      })
      return data
    },
    enabled: !!accessToken && !!org,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60
  })
}
