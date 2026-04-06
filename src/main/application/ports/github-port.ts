export interface GitHubPort {
  listRepositories(accessToken: string, org: string): Promise<any[]>
  listPullRequests(
    accessToken: string,
    owner: string,
    repo: string,
    state?: string
  ): AsyncIterable<any[]>
}
