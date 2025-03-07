import Opossum from 'opossum';

// Define the options type for the circuit breaker configuration
interface CircuitBreakerOptions {
  timeout: number; // Timeout in milliseconds
  errorThresholdPercentage: number; // Error threshold percentage to trip the circuit
  resetTimeout: number; // Timeout before trying again after the circuit is open
  rollingCountTimeout: number; // Time to wait before resetting the failure count
  rollingCountBuckets: number; // Number of buckets to divide the rolling window into
}

// Define the options object
const options: CircuitBreakerOptions = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 1000, // After 1 second, try again
  rollingCountTimeout: 25000,
  rollingCountBuckets: 5,
};
const runCallback = async function sendRequest(asyncCallback) {
  return await asyncCallback();
};

export function circuitBuilder() {
  return new Opossum(runCallback, options);
}
