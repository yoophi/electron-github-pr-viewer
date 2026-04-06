import { Badge } from '@/shared/ui/badge'
import { Check } from 'lucide-react'

type TopicFilterProps = {
  topics: string[]
  selectedTopics: string[]
  onToggle: (topic: string) => void
}

export function TopicFilter({ topics, selectedTopics, onToggle }: TopicFilterProps) {
  return (
    <div className="flex flex-wrap">
      {topics.map((topic) => (
        <Badge
          key={topic}
          className="mb-1 mr-1"
          variant={selectedTopics.includes(topic) ? 'default' : 'outline'}
          onClick={() => onToggle(topic)}
        >
          {selectedTopics.includes(topic) && <Check size={18} className="mr-1" />}
          {topic}
        </Badge>
      ))}
    </div>
  )
}
