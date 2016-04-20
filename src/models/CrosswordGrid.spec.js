import { expect } from 'chai';
import CrosswordGrid from './CrosswordGrid.js';

const tests = [
    [2, 2],
    [13, 21]
];

describe('CrosswordGrid Model', () => {
    describe("#constructor", () => {
        it('should populate `.collection` correctly', () => {
            tests.forEach((test) => {
                const x = test[0];
                const y = test[1]
                const grid = new CrosswordGrid(x, y);
                expect(grid.collection.length).to.equal(x * y);
            });

        });
    });

    describe("#setLetter", () => {
        it('should throw an error if `value` is invalid', () => {
            [
                '', 'as', 12, Infinity
            ].forEach((test) => {
                const xy = [0, 0];

                const grid = new CrosswordGrid(2, 2);
                const tile = grid.get(...xy);
                expect(tile.isInUse).to.equal(false);
                expect(() => { grid.setLetter(...xy, test) }).to.throw;
            });
        });


        it('should alter `.value` and `.isInUsed` correctly', () => {
            [
                'a', 'C', 1
            ].forEach((test) => {
                const xy = [0, 0];

                const grid = new CrosswordGrid(2, 2);
                const tile = grid.get(...xy);

                expect(tile.isInUse).to.equal(false);
                grid.setLetter(...xy, test);
                expect(tile.value).to.equal(test);
                expect(tile.isInUse).to.equal(true);
            });
        });
    });


    describe("#setWord", () => {
        it('should alter `.value` and `.isInUsed` correctly', () => {
            [
                'a', 'C', 1
            ].forEach((test) => {
                const xy = [0, 0];

                const grid = new CrosswordGrid(2, 2);
                const tile = grid.get(...xy);

                expect(tile.isInUse).to.equal(false);
                grid.setLetter(...xy, test);
                expect(tile.value).to.equal(test);
                expect(tile.isInUse).to.equal(true);
            });
        });
    });

});