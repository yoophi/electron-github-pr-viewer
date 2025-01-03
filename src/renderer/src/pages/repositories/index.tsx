import { useQuery } from '@tanstack/react-query'
import { useSettingStore } from '@/entities/settings'
import { RepositoriesList } from '@/entities/repositories'
import { Badge } from '@/shared/ui/badge'
import { useState } from 'react'
import { Check, CircleCheck } from 'lucide-react'

export const RepositoriesPage = () => {
  const { setting } = useSettingStore((state) => state)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

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
    },
    staleTime: 1000 * 60 * 10, // 10분 동안 데이터를 신선한 상태로 유지
    gcTime: 1000 * 60 * 60 // 1시간 동안 캐시 유지
  })

  if (isLoading) {
    return <div>loading...</div>
  }

  if (isError) {
    return <div>{error?.message}</div>
  }

  const topics = repositories
    .filter((repo) => repo.topics.includes('frontend'))
    .map((repo) => {
      return repo.topics.map((topic) => {
        const result = topic.match(/^([a-z-]+)-(v[0-9]+)/)
        if (!result) {
          return [topic]
        }
        return [result[0], result[1]]
      })
    })
    .flat(Infinity)
    .reduce((prev, curr) => {
      if (!prev.includes(curr)) {
        prev.push(curr)
      }
      return prev
    }, [])
    .sort()

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Repositories</h1>
      <div className="flex flex-wrap">
        {topics.map((topic) => {
          return (
            <Badge
              key={topic}
              className="mb-1 mr-1"
              variant={selectedTopics.includes(topic) ? 'default' : 'outline'}
              onClick={() => {
                if (selectedTopics.includes(topic)) {
                  setSelectedTopics((prev) => prev.filter((v) => v !== topic))
                } else {
                  setSelectedTopics((prev) => [topic, ...prev])
                }
              }}
            >
              {selectedTopics.includes(topic) && <Check size={18} className="mr-1" />}
              {topic}
            </Badge>
          )
        })}
      </div>

      <RepositoriesList
        data={repositories
          .filter((repo) => repo.topics.includes('frontend'))
          .filter((repo) => {
            if (selectedTopics.length === 0) {
              return true
            }
            return selectedTopics.every(
              (selectedTopic) =>
                repo.topics.filter((topic) => topic.startsWith(selectedTopic)).length > 0
            )
          })}
      />
    </div>
  )
}
