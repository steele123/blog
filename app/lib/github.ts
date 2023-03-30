export interface GetGithubContributions {
    username: string
    token: string
}

export interface GithubCommitsResponse {
    data: {
        user: {
            name: string
            contributionsCollection: {
                contributionCalendar: {
                    colors: string[]
                    totalContributions: number
                    weeks: {
                        firstDay: string
                        contributionDays: Array<{
                            color: string
                            contributionCount: number
                            date: string
                            weekday: number
                        }>
                    }[]
                }
            }
        }
    }
}

export const getGithubContributions = async ({
                                                 username,
                                                 token
                                             }: GetGithubContributions): Promise<Response> => {
    if (!username || !token) {
        throw new Error('You must provide a github username and token')
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Steele-Blog"
    }
    const body = {
        query: `query {
        user(login: "${username}") {
          name
          contributionsCollection {
            contributionCalendar {
              colors
              totalContributions
              weeks {
                contributionDays {
                  color
                  contributionCount
                  date
                  weekday
                }
                firstDay
              }
            }
          }
        }
      }`
    }

    return await fetch("https://api.github.com/graphql", {
        method: "POST",
        body: JSON.stringify({query: body.query}),
        headers
    })
}
