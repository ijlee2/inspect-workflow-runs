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
    runs = await this._appendRunDuration(runs);

    this._analyzeRuntime(runs);
  }


  async _getSuccessfulRuns() {
    const { runs } = await this.client.findWorkflowRuns();

    return runs.filter(({ conclusion }) => conclusion === 'success');
  }


  async _appendRunDuration(runs) {
    const mapRunIdToRun = convertArrayToMap(runs);
    const runIds = Array.from(mapRunIdToRun.keys());

    const results = await Promise.allSettled(
      runIds.map(runId => {
        return this.client.findWorkflowRuntime(runId);
      })
    );

    results.forEach(({ status, value }) => {
      if (status !== 'fulfilled') {
        // Discard bad data
        mapRunIdToRun.delete(id);
        return;
      }

      const { id, durationInSeconds } = value;
      let run = mapRunIdToRun.get(id);

      run.durationInSeconds = durationInSeconds;
    });

    return Array.from(mapRunIdToRun.values());
  }


  _analyzeRuntime(runs) {
    console.log(runs);
  }
}


function convertArrayToMap(runs) {
  const kvArray = runs.map(run => [run.id, run]);

  return new Map(kvArray);
};