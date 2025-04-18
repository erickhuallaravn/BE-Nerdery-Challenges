/*
    Challenge 1: "Make a request with retries"
    
    The function makeRequest under utils/make-requests accepts a number representing the number of attempts to make a request. If the request fails, it should retry up to the specified number of attempts. If all attempts fail, it should return an error message.
    
    Requirements:
    - You should work only within the method in this file
    - The function should accept a number representing the number of attempts.
    - The function should make a request and retry if it fails.
    - If all attempts fail, it should return an error message.
    - The function should not modify the original number of attempts.
    - The function should handle network errors gracefully.
    - The function should not use any external libraries.

    Example:
    makeRequestWithRetries(3); // Expected output: "Request successful on attempt X" or "All attempts failed."


*/

const makeRequest = require("./utils/make-requests");

/*
// ASYNC/AWAIT
const makeRequestWithRetries = async (attempts) => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        makeRequest(attempt, (error, result) => {
          if (error) {
            console.log(error.message);
            reject(error);
          }
          else {
            console.log(result);
            resolve(result);
          }
        });
      });
      return result;
    } catch (error) {
      if (attempt == attempts)
        throw error;
    }
  }
}

makeRequestWithRetries(10)
  .then(result => console.log("\nFinal result:", result))
  .catch(error => console.error("\nAll attempts failed:", error.message));
*/

/*
// PROMISES
const makeRequestWithRetries = (attempts) => {
  function tryRequest(attempt) {
    return new Promise((resolve, reject) => {
      makeRequest(attempt, (error, result) => {
        if (error) {
          if (attempt === attempts) {
            console.log(error.message);
            reject(error);
          } else {
            console.log(error.message);
            resolve(tryRequest(attempt+1));
          }
        }
        else {
          console.log(result);
          resolve(result);
        }
      })
    });
  }
  return tryRequest(1);
}

makeRequestWithRetries(10)
  .then(result => console.log("\nFinal result:", result))
  .catch(error => console.error("\nAll attempts failed:", error.message));
*/

// CALLBACKS
const makeRequestWithRetries = (attempts) => {
  function tryRequest(attempt) {
    makeRequest(attempt, (error, result) => {
      if (error) {
        if (attempt === attempts) {
          console.log(error.message);
        } else {
          console.log(error.message);
          tryRequest(attempt + 1)
        }
      }
      else
        console.log(result);
    })
  }
  return tryRequest(1);
}

makeRequestWithRetries(10);