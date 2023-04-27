import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', {required: true})
    const octokit = github.getOctokit(githubToken)

    const credentials = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    }

    console.log(
      github.context.ref,
      github.context.payload.pull_request,
      github.context.payload.repository
    )

    console.log('===========================================\n\n')

    const {data: pr} = await octokit.rest.pulls.get({
      ...credentials,
      pull_number: github?.context?.payload?.pull_request?.number || 1
    })

    console.log(pr)

    console.log('===========================================\n\n')

    const {data: commits} = await octokit.rest.pulls.listCommits({
      ...credentials,
      pull_number: github?.context?.payload?.pull_request?.number || 1
    })

    console.log(commits)

    console.log('===========================================\n\n')

    core.notice('before pull')

    const {data} = await octokit.rest.pulls.list({
      ...credentials
    })

    core.notice('after pull')

    core.info(data.toString())
    console.log(data)

    console.log('===========================================\n\n')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
