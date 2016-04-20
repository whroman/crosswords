import { expect } from 'chai';
import Tile from './Tile.js';

console.log(Tile);

describe('Tile Model', () => {
    describe("#isFulfilled", () => {
        let tile;

        beforeEach(() => {
            tile = new Tile(0,0);
            tile.isEditable = true;
        });

        it('it should return `true` when `value` and `input` are the same', () => {
            [
                ['foo', 'foo'],
                ['foo', 'FoO']
            ].forEach((test) => {
                tile.isEditable = true;
                tile.input = test[0];
                tile.value = test[1];
                expect(tile.isFulfilled()).to.equal(true);

            });
        });

        it('it should return `false` when `value` and `input` are not the same', () => {
            [
                ['foo', 'bar'],
                ['a', 'b']
            ].forEach((test) => {
                tile.input = test[0];
                tile.value = test[1];
                expect(tile.isFulfilled()).to.equal(false);
            });
        });

    });
});