// import opossum, { CircuitBreakerOptions, CircuitBreaker } from 'opossum';

// // Define the type of the service
// type ServiceFunction = () => Promise<any>;

// // The factory function to create a circuit breaker
// const createCircuitBreaker = (service: ServiceFunction, options: CircuitBreakerOptions): CircuitBreaker => {
//   // Create and return the circuit breaker instance
//   const circuit = new opossum(service, options);

//   // Optional: Listen for events to track the state
//   circuit.on('open', () => console.log('Circuit is OPEN'));
//   circuit.on('halfOpen', () => console.log('Circuit is HALF-OPEN'));
//   circuit.on('close', () => console.log('Circuit is CLOSED'));

//   return circuit;
// };

// export { createCircuitBreaker };
