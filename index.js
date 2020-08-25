import readEnvironmentVariables from './lib/dotenv';
import GitHub from './lib/github';


async function main() {
  try {
    readEnvironmentVariables();

    const client = new GitHub({
      repoOwner: 'ijlee2',
      repoName: 'ember-container-query',
      workflowFileName: 'ci.yml'
    });

    console.log(client.repoName);

  } catch(error) {
    console.error(error);

  }
}


main();