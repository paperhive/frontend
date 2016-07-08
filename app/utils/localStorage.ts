// Test localStorage availability
// it may be missing or access is forbidden due to the cookies settings
// (for example in Firefox)
export let localStorageAvailable = false;
try {
  if (window.localStorage) localStorageAvailable = true;
} catch (err) {
  if (err.name !== 'SecurityError') throw err;
}
