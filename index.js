let _ = require('lodash');

let test = [1, 2, 3, 4, 5];

try {
    _.each(test, (num) => {
        _.each(test, (num2) => {
            console.log({num, num2});
            if (num == 3 && num2 == 3) {
                throw new Error();
            }
        });
    });
} catch (e) {
    console.log('well this is fortunate');
}

console.log('done!');
