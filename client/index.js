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
    $scope.words = words;
    $scope.crossword = new CrosswordGrid(size.x, size.y);
    $scope.words.forEach((item) => {
        $scope.crossword.setWord(item.word, item.coords);
    });

    const firstWord = $scope.crossword.words.get(0);
    $scope.currentWordID = firstWord.id;

    const inputKeyBlacklist = [
        // 9,  // tab
        16, // shift
        17, // ctrl
        18  // alt
    ];

    const focusTileByCoords = (x, y) => {
        focus(`tile-${x}${y}`);
    };

    $scope.onKeypress = ($event, tile) => {
        $event.preventDefault();
        tile.input = tile.input.toUpperCase();
        const { input, x, y } = tile;

        const keyIsBlackedListed = inputKeyBlacklist.indexOf($event.keyCode) > -1;
        const inputIsEmpty = input.length === 0;
        if (keyIsBlackedListed || inputIsEmpty) return;

        const shouldCutInput = input.length > 1;
        if (shouldCutInput) tile.input = input[input.length - 1];
        tile.input = tile.input.toUpperCase();

        const nextWord = $scope.crossword.getNextWord($scope.currentWordID, x, y);
        if (!nextWord) return;

        const nextTile = nextWord.getNextTile(x, y);
        $scope.currentWordID = nextWord.id;
        focusTileByCoords(nextTile.x, nextTile.y);
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
        },
        handleClueClick: {
            action (id) {
                console.log(id)
                $scope.currentWordID = id;
                const word = $scope.crossword.words.get(id);
                const { x, y } = word.collection[0];

                $scope.crossword.collection.forEach((tile) => {
                    tile.belongsToCurrentWord = false;
                    tile.words.forEach((wordID) => {
                        if ($scope.currentWordID === wordID) tile.belongsToCurrentWord = true;
                    });
                    console.log(tile.words);
                });

                focusTileByCoords(x, y);
            }
        }
    };

});

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, ['Crossword']);
});