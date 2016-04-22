import angular from 'angular';
import CrosswordGrid from './../src/models/CrosswordGrid';
import content from './../fixtures/one.json';
import processContent from './../src/services/processContent';
import { each } from 'lodash';
import 'ng-focus-on';

angular
.module('Crossword', ['focusOn'])
.controller('CrosswordCtrl', function CountCtrl(focus) {
    const $scope = this;

    const { size, words } = processContent(content);
    $scope.crossword = new CrosswordGrid(size.x, size.y);
    words.forEach((item) => $scope.crossword.setWord(item));

    $scope.words = { horizontal: [], vertical: [] };
    each($scope.crossword.words.collection, (word) => {
        console.log(word)
        $scope.words[word.direction].push(word);
    });


    const firstWord = $scope.crossword.words.get(1);

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

        const nextWord = $scope.crossword.getNextWord($scope.ui.currentWord.id, x, y);
        if (!nextWord) return;

        const nextTile = nextWord.getNextTile(x, y);
        $scope.ui.currentWord.set(nextWord.id);
        focusTileByCoords(nextTile.x, nextTile.y);
    };

    $scope.ui = {
        currentWord: {
            id: false,
            set (id) {
                console.log(id)
                this.id = id;
                $scope.crossword.collection.forEach((tile) => {
                    tile.belongsToCurrentWord = false;
                    tile.words.forEach((wordID) => {
                        if (this.id === wordID) tile.belongsToCurrentWord = true;
                    });
                });
            }
        },
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
                $scope.ui.currentWord.set(id);
                const word = $scope.crossword.words.get(id);
                const { x, y } = word.collection[0];
                focusTileByCoords(x, y);
            }
        },
        handleTileClick: {
            action (tile) {
                let id = tile.words[0];
                const wordTwo = tile.words[1];
                const shouldSetSecondWord = (
                    $scope.ui.currentWord.id === id &&
                    wordTwo
                );
                if (shouldSetSecondWord) id = wordTwo;
                $scope.ui.currentWord.set(id);
            }
        }
    };

    $scope.ui.currentWord.set(firstWord.id);

});

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, ['Crossword']);
});