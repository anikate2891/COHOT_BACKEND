import {sum} from '../utils.js';

describe('sum function', () => {
    test('adds 1+2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    });
});


// NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" 
// npx jest 
// - for running the test cases in node v18 and above



// npx jest - for running the test cases