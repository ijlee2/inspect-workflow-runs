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
    console.log(this.client.repoName);
  }
}