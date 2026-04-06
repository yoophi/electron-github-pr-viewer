import dayjs from 'dayjs'
import type { GitHubPort } from '../ports/github-port'
import type { GetPullRequestsParams, IPCResponse } from '../../domain/types'

export class GetPullRequests {
  constructor(private readonly githubPort: GitHubPort) {}

  async execute(params: GetPullRequestsParams): Promise<IPCResponse<any[]>> {
    const { accessToken, repository, params: queryParams } = params

    try {
      const [owner, repo] = repository.split('/')
      const pages = this.githubPort.listPullRequests(
        accessToken,
        owner,
        repo,
        queryParams?.state
      )

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

      return { error: false, data: result }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return { error: true, message: `failed to get pull requests: ${message}`, data: [] }
    }
  }
}
