import * as core from '@actions/core';
import * as github from '@actions/github';
import {octokit} from './octokit';
import {credentials} from './consts';
import {getLinksBlock, getLinksList, getPreparedPullRequestBody} from './utils';

async function run(): Promise<void> {
  try {
    const pullRequest = github.context.payload.pull_request;

    if (typeof pullRequest?.number !== 'number') {
      core.setFailed('Please, use this github actions only for pull requests!');
    }

    const links = await getLinksList();

    if (links.length === 0) {
      core.debug('Task links not found.');
      return;
    }

    const linksBlock = getLinksBlock(links);

    const body =
      linksBlock + getPreparedPullRequestBody(pullRequest!.body || '');

    await octokit.rest.pulls.update({
      ...credentials,
      pull_number: pullRequest!.number,
      body
    });
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
