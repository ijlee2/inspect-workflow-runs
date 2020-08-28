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


  async findWorkflowRuns() {
    const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_file_name}/runs', {
      owner: this.repoOwner,
      repo: this.repoName,
      workflow_file_name: this.workflowFileName,
      per_page: 50
    });

    // Runs have been sorted by run number in descending order
    return {
      totalCount: data.total_count,
      runs: data.workflow_runs.map(normalize)
    };
  }


  async findWorkflowRuntime(runId) {
    const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing', {
      owner: this.repoOwner,
      repo: this.repoName,
      run_id: runId
    });

    // Report in seconds
    return {
      id: runId,
      durationInSeconds: data.run_duration_ms / 1000
    };
  }
}


function normalize(run) {
  return {
    id: run.id,
    number: run.run_number,
    conclusion: run.conclusion,
  };
};