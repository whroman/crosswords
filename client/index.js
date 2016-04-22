import angular from 'angular';
import CrosswordGrid from './../src/models/CrosswordGrid';
import content from './../fixtures/one.json';
import processContent from './../src/services/processContent';
import 'ng-focus-on';
import './index.scss';

angular
.module('Crossword', ['focusOn'])
.controller('CrosswordCtrl', function CountCtrl(focus) {
    const $scope = this;

    const { size, words } = processContent(content);
    $scope.crossword = new CrosswordGrid(size.x, size.y);
    words.forEach((item) => {
        $scope.crossword.setWord(item.word, item.coords);
    });

    const firstWord = $scope.crossword.words.get(0);
    let currentWordID = firstWord.id;

    const inputKeyBlacklist = [
        // 9,  // tab
        16, // shift
        17, // ctrl
        18  // alt
    ];

    $scope.onKeypress = ($event, tile) => {
        $event.preventDefault();
        const { input, x, y } = tile;

        const keyIsBlackedListed = inputKeyBlacklist.indexOf($event.keyCode) > -1;
        const inputIsEmpty = input.length === 0;
        if (keyIsBlackedListed || inputIsEmpty) return;

        const shouldCutInput = input.length > 1;
        if (shouldCutInput) tile.input = input[input.length - 1];

        const nextWord = $scope.crossword.getNextWord(currentWordID, x, y);
        if (!nextWord) return;

        const nextTile = nextWord.getNextTile(x, y);
        currentWordID = nextWord.id;
        focus(`tile-${nextTile.x}${nextTile.y}`);
    };

    $scope.ui = {
        showAllTiles: {
            enabled: true,
            action () {
                console.log(this.enabled);
                if (!this.enabled) return;
                $scope.crossword.setPlaceholders();
                this.enabled = false;
            }
        }
    };

});

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, ['Crossword']);
});