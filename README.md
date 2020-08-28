[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/inspect-workflow-runs/workflows/CI/badge.svg?branch=main)](https://github.com/ijlee2/inspect-workflow-runs/actions?query=workflow%3ACI)

inspect-workflow-runs
==============================================================================

Make a **data-driven decision** for setting `timeout-minutes` for jobs in a [GitHub Actions](https://docs.github.com/actions) workflow.


Installation
------------------------------------------------------------------------------

1. Clone and install the repo.

    ```bash
    git clone git@github.com:ijlee2/inspect-workflow-runs.git
    cd inspect-workflow-runs

    yarn install
    ```

1. Rename `.env-sample` to `.env`. In the file, set a [GitHub personal access token](https://docs.github.com/github/authenticating-to-github/creating-a-personal-access-token) that has the correct read permission (e.g. `repo:public_repo` for public repos).

    ```
    GITHUB_PERSONAL_ACCESS_TOKEN=secret123
    ```


How to run
------------------------------------------------------------------------------

1. In `index.js`, specify the workflow you'd like to inspect. Save the file.

    ```javascript
    const workflow = new Workflow({
      repoOwner: 'ijlee2',
      repoName: 'ember-container-query',
      workflowFileName: 'ci.yml'
    });
    ```

1. Run the script.

    ```bash
    yarn start
    ```


Contributing
------------------------------------------------------------------------------

Due to lack of time, I won't be accepting issues and pull requests at the moment.

If you found this repo helpful in maintaining your workflow, you can star this project! 🌟