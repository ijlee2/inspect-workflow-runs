import GitHub from '../lib/github';


export default class Workflow {
  constructor({ repoOwner, repoName, workflowFileName }) {
    this.client = new GitHub({
      repoOwner,
      repoName,
      workflowFileName
    });
  }


  async analyzeSuccessfulRuns() {
    let runs = await this._getSuccessfulRuns();

    this._analyzeRuntime(runs);
  }


  async _getSuccessfulRuns() {
    const { runs } = await this.client.findWorkflowRuns();

    return runs.filter(({ conclusion }) => conclusion === 'success');
  }


  _analyzeRuntime(runs) {
    console.log(runs);
  }
}