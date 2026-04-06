import type { GitHubPort } from '../ports/github-port'
import type { GetRepositoriesParams } from '../../domain/types'

export class GetRepositories {
  constructor(private readonly githubPort: GitHubPort) {}

  async execute(params: GetRepositoriesParams): Promise<any[]> {
    return this.githubPort.listRepositories(params.accessToken, params.org)
  }
}
