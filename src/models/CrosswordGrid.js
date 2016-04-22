import Words from './Words';
import Tile from './Tile';

export default class CrosswordGrid {

    constructor (width, height) {
        Object.assign(this, {
            words: new Words(),
            collection: [],
            width,
            height
        });

        for (let yy = 0; yy < height; yy++) {
            for (let xx = 0; xx < width; xx++) {
                this.collection.push( new Tile(xx, yy) );
            }
        }
    }

    get (x, y) {
        return this.collection.find( (tile) => tile.x === x && tile.y === y);
    }

    setLetter (x, y, value) {
        if (String(value).length !== 1) throw new Error('`value` must be a String of length 1');
        const tile = this.get(x, y);
        value = value.toUpperCase();
        Object.assign(tile, {
            value,
            isInUse: true
        });
        return tile;
    }

    setInput (x, y, value) {
        const tile = this.setLetter(x, y, value);
        tile.isEditable = true;
        return tile;
    }

    setWord (rawWord) {
        const { word, coords, direction, clue } = rawWord;
        const letterTiles = coords.map( (coords, index) => {
            const x = coords[0];
            const y = coords[1];
            const letterTile = this.setInput(x, y, word[index]);
            return letterTile;
        });

        const setWord = this.words.set(letterTiles, direction, clue);
        return setWord;
    }

    getNextWord (currentWordID, tileX, tileY) {
        const currentWord = this.words.get(currentWordID);
        const shouldNotChangeWords = currentWord && !currentWord.isFilled();
        if (shouldNotChangeWords) return currentWord;

        const tile = this.get(tileX, tileY);
        for (let iter = 0; iter < tile.words.length; iter++) {
            const id = tile.words[iter];
            const word = this.words.get(id);
            if (!word.isFilled()) return word;
        }

        return this.words.getUnfilled();
    }

    setPlaceholders () {
        for (let key in this.words.collection) {
            const word = this.words.collection[key];
            word.setPlaceholders();
        }
    }

    unsetPlaceholders () {
        for (let key in this.words.collection) {
            this.words[key].unsetPlaceholders();
        }
    }
}