// The prototype of an async funtion is not available in the global context
// so we get it through the backdoor
export const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;