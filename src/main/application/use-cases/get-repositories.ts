import type { GitHubPort } from '../ports/github-port'
import type { GetRepositoriesParams, IPCResponse } from '../../domain/types'

export class GetRepositories {
  constructor(private readonly githubPort: GitHubPort) {}

  async execute(params: GetRepositoriesParams): Promise<IPCResponse<any[]>> {
    try {
      const data = await this.githubPort.listRepositories(params.accessToken, params.org)
      return { error: false, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      return { error: true, message: `failed to get repositories: ${message}`, data: [] }
    }
  }
}
