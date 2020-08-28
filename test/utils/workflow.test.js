import { assert } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import nock from 'nock';
import Workflow from '../../src/utils/workflow';


describe('utils/workflow', function() {
  beforeEach(function() { 
    nock.disableNetConnect();

    this.workflow = new Workflow({
      repoOwner: 'ijlee2',
      repoName: 'ember-container-query',
      workflowFileName: 'ci.yml'
    });
  });


  afterEach(function() {
    nock.enableNetConnect();
  });


  describe('Workflow._getSuccessfulRuns()', function() {
    it('returns workflow runs that were successful', async function() {
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

      const runs = await this.workflow._getSuccessfulRuns();

      assert.deepEqual(
        runs,
        [
          {
            id: 138926310,
            number: 5,
            conclusion: 'success',
          },
          {
            id: 138723945,
            number: 2,
            conclusion: 'success',
          },
        ]
      );

      scope.done();
    });
  });


  describe('Workflow._appendRunDuration()', function() {
    it('appends runtime to workflow runs', async function() {
      const scope_138926310 = nock('https://api.github.com:443', { encodedQueryParams: true })
        .get('/repos/ijlee2/ember-container-query/actions/runs/138926310/timing')
        .reply(200, {
          run_duration_ms: 273000,
        });

      const scope_138723945 = nock('https://api.github.com:443', { encodedQueryParams: true })
        .get('/repos/ijlee2/ember-container-query/actions/runs/138723945/timing')
        .reply(200, {
          run_duration_ms: 258000,
        });

      let runs = [
        {
          id: 138926310,
          number: 5,
          conclusion: 'success',
        },
        {
          id: 138723945,
          number: 2,
          conclusion: 'success',
        },
      ];

      runs = await this.workflow._appendRunDuration(runs);

      assert.deepEqual(
        runs,
        [
          {
            id: 138926310,
            number: 5,
            conclusion: 'success',
            durationInSeconds: 273,
          },
          {
            id: 138723945,
            number: 2,
            conclusion: 'success',
            durationInSeconds: 258,
          },
        ]
      );

      scope_138926310.done();
      scope_138723945.done();
    });
  });


  describe('Workflow._analyzeRuntime()', function() {
    it('recommends timeout-minutes based on 95% confidence interval', async function() {
      const runs = [
        {
          id: 138926310,
          number: 5,
          conclusion: 'success',
          durationInSeconds: 273,
        },
        {
          id: 138723945,
          number: 2,
          conclusion: 'success',
          durationInSeconds: 258,
        },
      ];

      const {
        mean,
        recommendedTimeoutInMinutes,
        sampleSize,
        standardDeviation,
      } = await this.workflow._analyzeRuntime(runs);

      assert.equal(
        mean,
        265.5,
        'We get the correct mean.'
      );

      assert.equal(
        recommendedTimeoutInMinutes,
        5,
        'We get the correct recommended timeout in minutes.'
      );

      assert.equal(
        sampleSize,
        2,
        'We get the correct sample size.'
      );

      assert.approximately(
        standardDeviation,
        Math.sqrt(2/1 * 56.25),
        0.001,
        'We get the correct standard deviation.'
      );
    });
  });
});