/*
Challenge 3

"Factorial Chain"

The function factorialChain accepts two arguments: length and lastDigits.

The length tells you how many numbers to include in the series, and your job is to calculate the factorial of each number from 1 to length, then sum all those factorials.

lastDigits indicates how many digits from the end of the final sum should be returned, as a string.

Example:

factorialChain(5, 3); // Expected output: "153"
factorialChain(5, 1); // Expected output: "3
factorialChain(5, 5); // Expected output: "00153"

1! = 1  
2! = 2  
3! = 6  
4! = 24  
5! = 120  
Total = 153 

Requirements:
- The function should accept two positive integers.
- The first integer (length) should represent the number of terms in the series.
- The second integer (lastDigits) should represent how many digits from the end of the final sum should be returned.
- The function should return the lastDigits digits of the sum as a string.
- In case the sum has fewer digits than lastDigits, the function should return the sum padded with leading zeros to match the length of lastDigits.

*/

const factorialChain = (number, lastDigits) => {
    const factorials = [];
    factorials[0] = 1;
    let prevNumber = factorials[0];
    let totalSum = 0;
    for (let index = 1; index < number; index++) {
        prevNumber = factorials[index-1];
        factorials[index] = (index+1) * prevNumber;
    }
    factorials.forEach(n => {
        totalSum += n;
    });
    let result = String(totalSum);
    return result.substring(result.length-lastDigits, result.length).padStart(lastDigits, '0');
};
module.exports = factorialChain;
