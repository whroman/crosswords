import { expect } from 'chai';
import Tile from './Tile.js';
import Word from './Word.js';

describe('Word Model', () => {
    describe("#isFulfilled", () => {
        let word;

        beforeEach(() => {
            const tiles = [
                new Tile(0, 0),
                new Tile(1, 0),
                new Tile(2, 0)
            ];

            tiles.forEach((tile) => tile.isEditable = true);
            word = new Word(0, tiles);
        });

        context('when `value` and `input` are the same for all `Tile`s in `.collection`', () => {
            it('should return `true`', () => {
                expect(word.isFulfilled()).to.equal(true);
                word.collection[0].value = 'a';
                word.collection[0].input = 'a';
                expect(word.isFulfilled()).to.equal(true);
            });
        });

        context('when `value` and `input` are not the same for all `Tile`s in `.collection`', () => {
            it('should return `false`', () => {
                expect(word.isFulfilled()).to.equal(true);
                word.collection[0].value = 'a';
                expect(word.isFulfilled()).to.equal(false);
                word.collection[0].input = 'b';
                expect(word.isFulfilled()).to.equal(false);
                word.collection[0].input = 'ba';
                expect(word.isFulfilled()).to.equal(false);
            });
        });
    });
});