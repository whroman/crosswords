import angular from 'angular';
import CrosswordGrid from './../src/models/CrosswordGrid.js';
import content from './../fixtures/one.json';
import { range } from 'lodash';
import 'ng-focus-on';
import './index.scss';

angular
.module('Crossword', ['focusOn'])
.controller('CrosswordCtrl', function CountCtrl(focus) {

    this.crossword = new CrosswordGrid(10,15);

    content.horizontal.forEach((item) => {
        const { word, location } = item;
        const startX = location[0];
        const endX = word.length + startX;
        const y = location[1];
        const coords = range(startX, endX).map((xx) => [xx, y]);
        this.crossword.setWord(word, coords);
    });

    content.vertical.forEach((item) => {
        const { word, location } = item;
        const startY = location[1];
        const endY = word.length + startY;
        const x = location[0];
        const coords = range(startY, endY).map((yy) => [x, yy]);
        this.crossword.setWord(word, coords);
    });

    this.currentWordID = this.crossword.words.get(0);

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