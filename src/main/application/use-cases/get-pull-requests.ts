import dayjs from 'dayjs'
import type { GitHubPort } from '../ports/github-port'
import type { GetPullRequestsParams } from '../../domain/types'

export class GetPullRequests {
  constructor(private readonly githubPort: GitHubPort) {}

  async execute(params: GetPullRequestsParams): Promise<any[]> {
    const { accessToken, repository, params: queryParams } = params
    const [owner, repo] = repository.split('/')
    const pages = this.githubPort.listPullRequests(accessToken, owner, repo, queryParams?.state)

    const result: any[] = []
    const oneYearAgo = dayjs().subtract(1, 'year')

    for await (const pulls of pages) {
      let reachedEnd = false
      for (const pull of pulls) {
        if (dayjs(pull.created_at).isBefore(oneYearAgo)) {
          reachedEnd = true
          break
        }
        result.push(pull)
      }
      if (reachedEnd) break
    }

    return result
  }
}
