import { assert } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import nock from 'nock';
import GitHub from '../../src/lib/github';


describe('lib/github', function() {
  beforeEach(function() { 
    nock.disableNetConnect();

    this.client = new GitHub({
      repoOwner: 'ijlee2',
      repoName: 'ember-container-query',
      workflowFileName: 'ci.yml'
    });
  });


  afterEach(function() {
    nock.enableNetConnect();
  });


  describe('GitHub.findWorkflowRuns()', function() {
    it('works', async function() {
      const scope = nock('https://api.github.com:443', { encodedQueryParams: true })
        .get('/repos/ijlee2/ember-container-query/actions/workflows/ci.yml/runs')
        .query({ per_page: 50 })
        .reply(200, {
          total_count: 5,
          // Other attributes have been omitted
          workflow_runs: [
            {
              id: 138926310,
              run_number: 5,
              conclusion: 'success',
            },
            {
              id: 138930402,
              run_number: 4,
              conclusion: 'timed_out',
            },
            {
              id: 138758247,
              run_number: 3,
              conclusion: 'failure',
            },
            {
              id: 138723945,
              run_number: 2,
              conclusion: 'success',
            },
            {
              id: 138460583,
              run_number: 1,
              conclusion: 'cancelled',
            },
          ]
        });

      const response = await this.client.findWorkflowRuns(5);

      assert.deepEqual(
        response,
        {
          totalCount: 5,
          runs: [
            {
              id: 138926310,
              number: 5,
              conclusion: 'success',
            },
            {
              id: 138930402,
              number: 4,
              conclusion: 'timed_out',
            },
            {
              id: 138758247,
              number: 3,
              conclusion: 'failure',
            },
            {
              id: 138723945,
              number: 2,
              conclusion: 'success',
            },
            {
              id: 138460583,
              number: 1,
              conclusion: 'cancelled',
            },
          ],
        },
        'We get the correct response.'
      );

      scope.done();
    });
  });


  describe('GitHub.findWorkflowRuntime()', function() {
    it('works', async function() {
      const scope = nock('https://api.github.com:443', { encodedQueryParams: true })
        .get('/repos/ijlee2/ember-container-query/actions/runs/138926310/timing')
        .reply(200, {
          run_duration_ms: 273000,
        });

      const response = await this.client.findWorkflowRuntime(138926310);

      assert.deepEqual(
        response,
        {
          id: 138926310,
          durationInSeconds: 273,
        },
        'We get the correct response.'
      );

      scope.done();
    });
  });
});