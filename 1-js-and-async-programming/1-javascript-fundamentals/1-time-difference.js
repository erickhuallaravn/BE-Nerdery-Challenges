/*
Challenge 1

"Time difference calculator"

The function timeDifference accepts two positive numbers representing time in seconds. You should modify the function to return the difference between the two times in a human-readable format HH:MM:SS.

Requirements:
- The function should accept two positive numbers representing time in seconds.
- The function should return the absolute difference between the two times.
- The result should be formatted as HH:MM:SS.

Example:

timeDifference(7200, 3400); // Expected output: "01:03:20"

*/

const timeDifference = (a, b) => {
    let diff = Math.abs(a-b);
    let hrs = String(Math.floor(diff/(60*60))).padStart(2, '0');
    let mins = String(Math.floor(diff/60%60)).padStart(2, '0');
    let secs = String(diff%60).padStart(2, '0');
    let formattedDiff = `${hrs}:${mins}:${secs}`;
    return formattedDiff;
}

module.exports = timeDifference;
