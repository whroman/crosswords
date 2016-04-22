import Word from './Word';

export default class Words {
    constructor () {
        this.id = 1;
        this.collection = {};
    }

    set (LetterTiles, direction, clue) {
        const word = new Word(this.id, LetterTiles, direction, clue);
        this.collection[this.id] = word;
        this.id += 1;
        return word;
    }

    get (key) {
        return this.collection[key];
    }

    isFulfilled () {
        let fulfilled = 0;
        for (let key in this.collection) {
            const word = this.get(key);
            if (word.isFulfilled()) fulfilled++;
        }
        const isFulfilled = fulfilled === Object.keys(this.collection).length;
        return isFulfilled;
    }

    getUnfilled () {
        for (let key in this.collection) {
            const word = this.get(key);
            if (!word.isFilled()) return word;
        }
        return null;
    }
}