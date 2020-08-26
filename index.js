import readEnvironmentVariables from './lib/dotenv';
import Workflow from './utils/workflow';


async function main() {
  try {
    readEnvironmentVariables();

    const workflow = new Workflow({
      repoOwner: 'ijlee2',
      repoName: 'ember-container-query',
      workflowFileName: 'ci.yml'
    });

    await workflow.analyzeSuccessfulRuns();

  } catch(error) {
    console.error(error);

  }
}


main();