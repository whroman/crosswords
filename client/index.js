import angular from 'angular';
import CrosswordGrid from './../src/models/CrosswordGrid.js';
import 'ng-focus-on';
import './index.scss';

angular
.module('Crossword', ['focusOn'])
.controller('CrosswordCtrl', function CountCtrl(focus) {

    this.crossword = new CrosswordGrid(10,15);
    const firstWord = this.crossword.setWord('cat', [0, 1, 2].map((xx) => [xx, 0]));
    this.crossword.setWord('taco', [0,1,2,3].map((yy) => [2, yy]));
    this.crossword.setWord('octopus', [1,2,3,4,5,6,7].map((xx) => [xx, 2]));
    this.crossword.setWord('dog', [1,2,3].map((yy) => [4, yy]));
    this.currentWordID = firstWord.id;

    const inputKeyBlacklist = [
        // 9,  // tab
        16, // shift
        17, // ctrl
        18  // alt
    ];

    this.onKeypress = ($event, tile) => {
        $event.preventDefault();
        const { input, x, y } = tile;

        const keyIsBlackedListed = inputKeyBlacklist.indexOf($event.keyCode) > -1;
        const inputIsEmpty = input.length === 0;
        if (keyIsBlackedListed || inputIsEmpty) return;

        const shouldCutInput = input.length > 1;
        if (shouldCutInput) tile.input = input[input.length - 1];

        const nextWord = this.crossword.getNextWord(this.currentWordID, x, y);
        if (!nextWord) return;

        const nextTile = nextWord.getNextTile(x, y);
        this.currentWordID = nextWord.id;
        focus(`tile-${nextTile.x}${nextTile.y}`);
    };
});

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, ['Crossword']);
});