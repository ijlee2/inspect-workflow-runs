import { assert } from 'chai';
import { describe, it } from 'mocha';
import {
  getMean,
  getStandardDeviation,
  getVariance
} from '../../src/utils/math';


describe('utils/math', function() {
  describe('getMean', function() {
    it('works', function() {
      console.log(`${getMean([1])} = 1.`);
    });
  });
});