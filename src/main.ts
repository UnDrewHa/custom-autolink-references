import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', {required: true})
    const taskUrlPattern = core.getInput('task_url_pattern', {required: true})
    const taskUrlPlaceholder = core.getInput('task_url_placeholder', {
      required: true
    })
    const taskNumberRegexp = new RegExp(
      core.getInput('task_number_regexp', {
        required: true
      }),
      'ig'
    )
    const octokit = github.getOctokit(githubToken)

    const credentials = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    }

    const links = []

    const PR = github.context.payload.pull_request

    links.push(...(PR?.head?.ref?.match(taskNumberRegexp) || []))

    const {data: commits} = await octokit.rest.pulls.listCommits({
      ...credentials,
      pull_number: github?.context?.payload?.pull_request?.number || 1
    })

    for (const {commit} of commits) {
      links.push(...(commit.message.match(taskNumberRegexp) || []))
    }

    console.log(links, taskUrlPattern, taskUrlPlaceholder, taskNumberRegexp)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
