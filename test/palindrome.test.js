const palindrome = require('../utils/for_testing').palindrome

test('palindorm of a,', () => {
    const result = palindrome('a')
    expect(result).toBe('a')
})

test('palindorm of ok', () => {
    const result = palindrome('ok')
    expect(result).toBe('ko')
})

test('互相', () => {
    const result = palindrome('互相')
    expect(result).toBe('相互')
})