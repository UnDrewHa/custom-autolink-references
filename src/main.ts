import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', {required: true})

    console.log(github.context)

    const credentials = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    }

    const octokit = github.getOctokit(githubToken)

    core.notice('before pull')

    const {data} = await octokit.rest.pulls.list({
      ...credentials
    })

    core.notice('after pull')

    core.info(data.toString())
    console.log(data)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
