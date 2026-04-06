export function extractTopics(repositories: any[]): string[] {
  return repositories
    .filter((repo) => repo.topics.includes('frontend'))
    .map((repo) => {
      return repo.topics.map((topic: string) => {
        const result = topic.match(/^([a-z-]+)-(v[0-9]+)/)
        if (!result) {
          return [topic]
        }
        return [result[0], result[1]]
      })
    })
    .flat(Infinity)
    .reduce((prev: string[], curr: string) => {
      if (!prev.includes(curr)) {
        prev.push(curr)
      }
      return prev
    }, [] as string[])
    .sort()
}

export function filterByTopics(repositories: any[], selectedTopics: string[]): any[] {
  return repositories
    .filter((repo) => repo.topics.includes('frontend'))
    .filter((repo) => {
      if (selectedTopics.length === 0) return true
      return selectedTopics.every(
        (selectedTopic) =>
          repo.topics.filter((topic: string) => topic.startsWith(selectedTopic)).length > 0
      )
    })
}
