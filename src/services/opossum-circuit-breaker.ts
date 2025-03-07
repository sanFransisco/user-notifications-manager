import Opossum from 'opossum';
import { WINDOW_COUNT, WINDOW_TIMEOUT } from '@config';

interface CircuitBreakerOptions {
  timeout: number;
  errorThresholdPercentage: number;
  resetTimeout: number;
  rollingCountTimeout: number;
  rollingCountBuckets: number;
}

const options: CircuitBreakerOptions = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 1000, // After 1 second, reset circuit
  rollingCountTimeout: parseInt(WINDOW_TIMEOUT, 10) || 20000,
  rollingCountBuckets: parseInt(WINDOW_COUNT, 10) || 5,
};
const runCallback = async function sendRequest(asyncCallback) {
  return await asyncCallback();
};

export function circuitBuilder() {
  return new Opossum(runCallback, options);
}
