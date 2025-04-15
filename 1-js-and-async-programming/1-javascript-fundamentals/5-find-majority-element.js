/* 
Challenge: "Find Majority Element";

The function findMajorityElement accepts an array of numbers and returns the majority element if it exists, otherwise returns null. The majority element is the element that appears more than n/2 times in the array.

Requirements:
- The function should handle arrays of any length.
- The function should return the majority element if it exists, otherwise return null.
- The function should be efficient and handle large arrays.
- The function should not modify the original array.

Example:
findMajorityElement([1, 2, 3, 1, 1]); // Expected output: 1
findMajorityElement([1, 2, 3, 4]); // Expected output: null
findMajorityElement([1, 1, 2, 2, 2]); // Expected output: 2
findMajorityElement([1, 2, 2, 3, 3, 3]); // Expected output: null
findMajorityElement([1, 2, 3, 4, 5]); // Expected output: null

*/

const findMajorityElement = (arr) => {
    arr = arr.sort();
    let currentCount = 1;
    let majorNumber = null;
    let majorCount = 0;
    for(let i = 1; i < arr.length; i++){
        if (arr[i-1] == arr[i])
            currentCount++;
        if (currentCount > majorCount && currentCount > arr.length/2) {
            majorCount = currentCount;
            majorNumber = arr[i-1];
        }
        if (arr[i-1] != arr[i])
            currentCount = 1;
    }
    if (arr.length == 1) {
        majorNumber = arr[0];
    }
    return majorNumber;
};

module.exports = findMajorityElement;
