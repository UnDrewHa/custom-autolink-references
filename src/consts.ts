import * as github from '@actions/github';
import * as core from '@actions/core';

const taskNumberRegexpFromParams = core.getInput('task_number_regexp', {
  required: true
});

export const taskUrlPattern = core.getInput('task_url_pattern', {
  required: true
});

export const taskUrlPlaceholder = core.getInput('task_url_placeholder', {
  required: true
});

export const taskNumberRegexp = new RegExp(
  `\\b${taskNumberRegexpFromParams}\\b`,
  'ig'
);

export const linksBlockTitle = '#### Tasks associated with this pull request:';

export const bodyRegexp = new RegExp(
  `(^${linksBlockTitle}\\n\\n)((?:- \\[${taskNumberRegexpFromParams}\\].+\\n)+)---`,
  'i'
);

export const credentials = {
  owner: github.context.repo.owner,
  repo: github.context.repo.repo
};
