import dotenv from 'dotenv';

export default function readEnvironmentVariables() {
  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }

  if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    throw new Error('You must provide `GITHUB_PERSONAL_ACCESS_TOKEN` in your .env file.');
  }
}