const Grid = require('./models/Grid');

var foo = new Grid(6,5);
var bar = foo.words.set('cat', [
    [0,0],
    [1,0],
    [2,0],
]);
