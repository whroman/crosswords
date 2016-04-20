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

    setWord (wordStr, coordSets) {
        const letterTiles = coordSets.map( (coords, index) => {
            const x = coords[0];
            const y = coords[1];
            const letterTile = this.setInput(x, y, wordStr[index]);
            return letterTile;
        });

        const word = this.words.set(letterTiles);
        return word;
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
}