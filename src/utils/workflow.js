import GitHub from '../lib/github';
import { getMean, getStandardDeviation } from './math';


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

    const results = this._analyzeRuntime(runs);
    this._displayResults(results);
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
    const runtimes = runs.map(({ durationInSeconds }) => durationInSeconds);
    const sampleSize = runtimes.length;

    const mean = getMean(runtimes);
    const standardDeviation = getStandardDeviation(runtimes);
    const recommendedTimeoutInMinutes = Math.ceil((mean + 2 * standardDeviation) / 60);

    return {
      mean,
      recommendedTimeoutInMinutes,
      sampleSize,
      standardDeviation,
    };
  }


  _displayResults(results) {
    const {
      mean,
      recommendedTimeoutInMinutes,
      sampleSize,
      standardDeviation,
    } = results;

    console.log(`\nOver the last ${sampleSize} successful runs, the workflow took the following time to run (in seconds):\n`);
    console.log(`  Mean: ${mean.toFixed(2)}`);
    console.log(`  Standard Deviation: ${standardDeviation.toFixed(2)}`);

    console.log(`\nBased on these numbers, please consider setting each job\'s \`timeout-minutes\` to \`${recommendedTimeoutInMinutes}\`.\n`);
  }
}


function convertArrayToMap(runs) {
  const kvArray = runs.map(run => [run.id, run]);

  return new Map(kvArray);
};