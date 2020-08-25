import readEnvironmentVariables from './lib/dotenv';


async function main() {
  try {
    readEnvironmentVariables();

  } catch(error) {
    console.error(error);

  }
}


main();