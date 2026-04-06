import { useSettingStore } from '@/entities/settings'
import { RepositoriesList, useRepositories } from '@/entities/repository'
import { Badge } from '@/shared/ui/badge'
import { useState } from 'react'
import { Check } from 'lucide-react'

export const RepositoriesPage = () => {
  const { setting } = useSettingStore((state) => state)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const {
    data: repositories,
    isLoading,
    isError,
    error
  } = useRepositories(setting?.accessToken, setting?.org)

  if (!setting?.accessToken) {
    return <div>access_token not found</div>
  }

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
