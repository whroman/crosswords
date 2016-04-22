import angular from 'angular';
import CrosswordGrid from './../src/models/CrosswordGrid';
import content from './../fixtures/one.json';
import processContent from './../src/services/processContent';
import 'ng-focus-on';
import './index.scss';

angular
.module('Crossword', ['focusOn'])
.controller('CrosswordCtrl', function CountCtrl(focus) {

    const { size, words } = processContent(content);

    this.crossword = new CrosswordGrid(size.x, size.y);

    words.forEach((item) => {
        const { word, coords } = item;
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