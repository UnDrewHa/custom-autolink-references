import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', {required: true})
    const sourceBranch = github.context.ref.replace(/^refs\/heads\//, '')

    const credentials = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    }

    const octokit = github.getOctokit(githubToken)

    const branchHead = `${credentials.owner}:${sourceBranch}`
    const {data} = await octokit.rest.pulls.list({
      ...credentials,
      base: 'main',
      head: branchHead
    })

    core.info(data.toString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
