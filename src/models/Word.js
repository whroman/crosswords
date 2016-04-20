import Tile from './Tile';

export default class Word {
    constructor (wordID, tiles) {
        tiles.forEach((tile) => {
            if (!(tile instanceof Tile)) throw Error('`tiles` must be composed of only instances of Tile');
            tile.words.push(wordID);
        });

        this.id = wordID;
        this.collection = tiles;
    }

    isFilled () {
        let filled = 0;
        this.collection.forEach((tile) => {
            if (tile.isFilled()) filled++;
        });
        return filled === this.collection.length;
    }

    isFulfilled () {
        let fulfilled = 0;
        this.collection.forEach((tile) => {
            if (tile.isFulfilled()) fulfilled++;
        });
        return fulfilled === this.collection.length;
    }

    get (x, y) {
        const tile = this.collection.find( (tile) => tile.x === x && tile.y === y);
        return tile;
    }

    getNextTile (x, y) {
        const nextXTile = this.get(x + 1, y);
        const nextYTile = this.get(x, y + 1);
        if (nextXTile) return nextXTile;
        if (nextYTile) return nextYTile;

        for (let iter = 0; iter < this.collection.length; iter++) {
            const tile = this.collection[iter];
            if (!tile.isFilled()) return tile;
        }

        return this.collection[0];
    }
}