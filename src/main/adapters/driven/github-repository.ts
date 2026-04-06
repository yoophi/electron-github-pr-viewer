import type { GitHubPort } from '../../application/ports/github-port'

const API_VERSION = '2022-11-28'

export class OctokitGitHubRepository implements GitHubPort {
  async listRepositories(accessToken: string, org: string): Promise<any[]> {
    const { Octokit } = await import('octokit')
    const octokit = new Octokit({ auth: accessToken })
    const iterator = octokit.paginate.iterator(octokit.rest.repos.listForOrg, {
      org,
      per_page: 100,
      headers: { 'X-GitHub-Api-Version': API_VERSION }
    })

    const result: any[] = []
    for await (const { data: repos } of iterator) {
      for (const repo of repos) {
        result.push(repo)
      }
    }
    return result
  }

  async *listPullRequests(
    accessToken: string,
    owner: string,
    repo: string,
    state?: string
  ): AsyncIterable<any[]> {
    const { Octokit } = await import('octokit')
    const octokit = new Octokit({ auth: accessToken })
    const options: Record<string, any> = {
      owner,
      repo,
      per_page: 100,
      sort: 'created',
      direction: 'desc',
      headers: { 'X-GitHub-Api-Version': API_VERSION }
    }
    if (state) {
      options.state = state
    }
    const iterator = octokit.paginate.iterator(octokit.rest.pulls.list, options)

    for await (const { data: pulls } of iterator) {
      yield pulls
    }
  }
}
