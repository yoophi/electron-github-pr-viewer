import dayjs from 'dayjs'
import { Cal } from './cal-heatmap'

type RepoHeatmapProps = {
  data?: any[]
  userIds?: string[]
  repository?: string
}

export const RepoHeatmap = ({ data, userIds, repository }: RepoHeatmapProps) => {
  if (data === undefined) {
    return 'data is empty'
  }

  const pullRequestsCount = new Map()
  const filteredData = data
    .filter((value) => value?.base?.repo?.full_name === repository)
    .filter((value) => {
      if (userIds === undefined) {
        return true
      }
      if (userIds.length === 0) {
        return true
      }

      return userIds.includes(value.user.login)
    })
  filteredData.forEach((pull) => {
    const pullRequestCreateDate = dayjs(pull.created_at).format('YYYY-MM-DDT00:00:00')
    pullRequestsCount.set(
      pullRequestCreateDate,
      (pullRequestsCount.get(pullRequestCreateDate) || 0) + 1
    )
  })
  const heatmapData = [...pullRequestsCount.keys()].map((key) => ({
    date: key,
    value: pullRequestsCount.get(key)
  }))

  return <Cal foo={repository} data={heatmapData} />
}
