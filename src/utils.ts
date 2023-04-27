import * as github from '@actions/github';
import {octokit} from './octokit';
import {
  bodyRegexp,
  credentials,
  linksBlockTitle,
  taskNumberRegexp,
  taskUrlPattern,
  taskUrlPlaceholder
} from './consts';

export async function getLinksList(): Promise<string[]> {
  const pullRequest = github.context.payload.pull_request;

  const {data: commits} = await octokit.rest.pulls.listCommits({
    ...credentials,
    pull_number: pullRequest!.number
  });

  const links = [];

  links.push(...(pullRequest!.head.ref.match(taskNumberRegexp) || []));

  for (const {commit} of commits) {
    links.push(...(commit.message?.match(taskNumberRegexp) || []));
  }

  return links;
}

export function getLinksBlock(links: string[]): string {
  const linksString = Array.from(new Set(links))
    .map(
      link => `- [${link}](${taskUrlPattern.replace(taskUrlPlaceholder, link)})`
    )
    .join('\n');

  return `${linksBlockTitle}\n\n${linksString}\n---\n\n`;
}

export function getPreparedPullRequestBody(body: string): string {
  return body.replace(/\r\n/g, '\n').replace(bodyRegexp, '');
}
