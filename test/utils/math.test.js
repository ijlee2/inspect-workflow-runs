import { assert } from 'chai';
import { describe, it } from 'mocha';
import {
  getMean,
  getStandardDeviation,
  getVariance
} from '../../src/utils/math';


describe('utils/math', function() {
  describe('getMean', function() {
    it('returns NaN if values is an empty array', function() {
      const mean = getMean([]);

      assert.isNaN(mean);
    });


    it('returns the mean if values is an array with 1 number', function() {
      const mean = getMean([10]);

      assert.strictEqual(mean, 10);
    });


    it('returns the mean if values is an array with more than 1 number', function() {
      const mean = getMean([10, 75, -45, 20, 20]);

      assert.strictEqual(mean, 16);
    });
  });


  describe('getStandardDeviation', function() {
    it('returns NaN if values is an empty array', function() {
      const standardDeviation = getStandardDeviation([]);

      assert.isNaN(standardDeviation);
    });


    it('returns NaN if values is an array with 1 number', function() {
      const standardDeviation = getStandardDeviation([10]);

      assert.isNaN(standardDeviation);
    });


    it('returns the standard deviation if values is an array with more than 1 number', function() {
      const standardDeviation = getStandardDeviation([10, 75, -45, 20, 20]);

      assert.approximately(standardDeviation, Math.sqrt(5/4 * 1454), 0.001);
    });
  });


  describe('getVariance', function() {
    it('returns NaN if values is an empty array', function() {
      const variance = getVariance([]);

      assert.isNaN(variance);
    });


    it('returns 0 if values is an array with 1 number', function() {
      const variance = getVariance([10]);

      assert.strictEqual(variance, 0);
    });


    it('returns the standard deviation if values is an array with more than 1 number', function() {
      const variance = getVariance([10, 75, -45, 20, 20]);

      assert.approximately(variance, 1454, 0.001);
    });
  });
});