import { useSettingStore } from '@/entities/settings'
import { RepositoriesList, useRepositories } from '@/entities/repository'
import { extractTopics, filterByTopics, TopicFilter } from '@/features/repo-discovery'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Skeleton } from '@/shared/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'

export const RepositoriesPage = () => {
  const { setting } = useSettingStore((state) => state)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const { data: repositories, isLoading, isError, error } = useRepositories(
    setting?.accessToken,
    setting?.org
  )

  if (!setting?.accessToken) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>access_token이 설정되지 않았습니다. Settings에서 토큰을 입력해주세요.</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-48 h-8" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-6 rounded-full" />
          ))}
        </div>
        <Skeleton className="w-full h-64" />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    )
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
