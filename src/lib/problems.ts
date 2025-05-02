export const problems = [
    {
        id: 1,
        type: 'array',
        difficulty: 'easy',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        example: `Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
        expectedOutput: '[0,1]',
        code: `function twoSum(nums, target) {\n    // Your solution here\n}`
    },
    {
        id: 2,
        type: 'string',
        difficulty: 'easy',
        title: 'Reverse String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters.',
        example: `Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]`,
        expectedOutput: '["o","l","l","e","h"]',
        code: `function reverseString(s) {\n    // Your solution here\n}`
    },
    {
        id: 3,
        type: 'array',
        difficulty: 'medium',
        title: 'Maximum Subarray',
        description: 'Find the contiguous subarray (containing at least one number) which has the largest sum.',
        example: `Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.`,
        expectedOutput: '6',
        code: `function maxSubArray(nums) {\n    // Your solution here\n}`
    },
    {
        id: 4,
        type: 'string',
        difficulty: 'medium',
        title: 'Longest Palindromic Substring',
        description: 'Given a string s, return the longest palindromic substring in s.',
        example: `Input: s = "babad"\nOutput: "bab"\nNote: "aba" is also a valid answer.`,
        expectedOutput: '"bab"',
        code: `function longestPalindrome(s) {\n    // Your solution here\n}`
    }
];