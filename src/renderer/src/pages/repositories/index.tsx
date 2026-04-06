import { useSettingStore } from '@/entities/settings'
import { RepositoriesList, useRepositories } from '@/entities/repository'
import { extractTopics, filterByTopics, TopicFilter } from '@/features/repo-discovery'
import { useState } from 'react'

export const RepositoriesPage = () => {
  const { setting } = useSettingStore((state) => state)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const { data: repositories, isLoading, isError, error } = useRepositories(
    setting?.accessToken,
    setting?.org
  )

  if (!setting?.accessToken) {
    return <div>access_token not found</div>
  }

  if (isLoading) {
    return <div>loading...</div>
  }

  if (isError) {
    return <div>{error?.message}</div>
  }

  const topics = extractTopics(repositories)
  const filtered = filterByTopics(repositories, selectedTopics)

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Repositories</h1>
      <TopicFilter
        topics={topics}
        selectedTopics={selectedTopics}
        onToggle={(topic) => {
          if (selectedTopics.includes(topic)) {
            setSelectedTopics((prev) => prev.filter((v) => v !== topic))
          } else {
            setSelectedTopics((prev) => [topic, ...prev])
          }
        }}
      />
      <RepositoriesList data={filtered} />
    </div>
  )
}
