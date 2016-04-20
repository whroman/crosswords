export default class Tile {

    constructor (x, y) {
        Object.assign(this, {
            x, y,
            isInUse: false,
            isEditable: false,
            words: [],
            value: "",
            input: ""
        });
    }

    isFilled () {
        return this.isEditable && this.value.length === this.input.length;
    }

    isFulfilled () {
        return this.isEditable && this.value.toLowerCase() === this.input.toLowerCase();
    }

}