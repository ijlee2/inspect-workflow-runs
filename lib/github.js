import { Octokit } from '@octokit/rest';


export default class GitHub {
  constructor({ repoOwner, repoName, workflowFileName }) {
    this.repoOwner = repoOwner;
    this.repoName = repoName;
    this.workflowFileName = workflowFileName;

    this.octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    });
  }
}