import angular from 'angular';
import CrosswordGrid from './../src/models/CrosswordGrid';
import content from './../fixtures/one.json';
import processContent from './../src/services/processContent';
import { each } from 'lodash';
import 'ng-focus-on';

angular
.module('Crossword', ['focusOn'])
.controller('CrosswordCtrl', function CountCtrl(focus, $timeout, $q) {
    const $scope = this;

    const { size, words } = processContent(content);
    $scope.crossword = new CrosswordGrid(size.x, size.y);
    words.forEach((item) => $scope.crossword.setWord(item));

    $scope.words = { horizontal: [], vertical: [] };
    each($scope.crossword.words.collection, (word, key) => {
        const firstTile = word.collection[0];
        firstTile.isFirstInWord.push(word.id);
        const lastTile = word.collection[word.collection.length - 1];
        lastTile.isLastInWord.push(word.id);
        $scope.words[word.direction].push(word);
    });

    const firstWord = $scope.crossword.words.get(1);

    const inputKeyBlacklist = [
        16, // shift
        17, // ctrl
        18  // alt
    ];


    const setCurrentTile = (x, y) => {
        const { crossword } = $scope;
        const tile = crossword.get(x, y);
        if (tile && tile.isInUse) {
            crossword.collection.forEach(tile => tile.isCurrent = false);
            tile.isCurrent = true;
            $scope.ui.tile.focusByCoords(tile.x, tile.y)
        }
    }

    $scope.ui = {
        tile: {
            focusByCoords(x, y) {
                focus(`tile-${x}${y}`);
            },
            navigationMapping: {
                // Left
                37: (x, y) => [x - 1, y],
                // Up
                38: (x, y) => [x, y - 1],
                // Right
                39: (x, y) => [x + 1, y],
                // Down
                40: (x, y) => [x, y + 1],
            },

            onKeypress($event, tile) {
                const { keyCode } = $event;
                $timeout(() => {
                    $event.preventDefault();
                    tile.input = tile.input.toUpperCase();
                    const { input, x, y } = tile;

                    const isNavKey = this.navigationMapping[keyCode];
                    if (isNavKey) {
                        return setCurrentTile(...isNavKey(x, y));
                    }

                    const keyIsBlackedListed = inputKeyBlacklist.indexOf(keyCode) > -1;
                    const inputIsEmpty = input.length === 0;
                    if (keyIsBlackedListed || inputIsEmpty) {
                        setCurrentTile(x, y);
                        return;
                    }

                    const shouldCutInput = input.length > 1;
                    if (shouldCutInput) tile.input = String.fromCharCode(keyCode).toUpperCase();

                    let nextTile;

                    if (tile.isLastInWord.indexOf($scope.ui.currentWord.id) > -1) {
                        let nextWord = $scope.crossword.words.get($scope.ui.currentWord.id + 1);
                        if (!nextWord) nextWord = $scope.crossword.words.get(1);
                        nextTile = nextWord.collection[0];
                        $scope.ui.currentWord.set(nextWord.id);
                    } else {
                        nextTile = $scope.crossword.words.get($scope.ui.currentWord.id).getNextTile(x, y);
                    }

                    setCurrentTile(nextTile.x, nextTile.y);
                }, 0);
            },

            onFocus (words) {
                const wordIndex = words.indexOf($scope.ui.currentWord.id);
                if (wordIndex === -1) {
                    $scope.ui.currentWord.set(words[0]);
                }
            },

            onClick (tile) {
                let id = tile.words[0];
                const wordTwo = tile.words[1];
                const shouldSetSecondWord = (
                    $scope.ui.currentWord.id === id &&
                    wordTwo
                );
                if (shouldSetSecondWord) id = wordTwo;
                setCurrentTile(tile.x, tile.y);
                $scope.ui.currentWord.set(id);
            },

        },

        currentWord: {
            id: false,
            set (id) {
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
                if (!this.enabled) {
                    this.enabled = true;
                    $scope.crossword.unsetPlaceholders();
                    return;
                }
                $scope.crossword.setPlaceholders();
                this.enabled = false;
            }
        },
        handleClueClick: {
            action (id) {
                $scope.ui.currentWord.set(id);
                const word = $scope.crossword.words.get(id);
                const { x, y } = word.collection[0];
                $scope.ui.tile.focusByCoords(x, y);
            }
        },
        submitGame: {
            hasOccurred: false,
            action () {
                this.hasOccurred = true;
            }
        },
        successModal: {
            isVisible: false,
            show () {
                this.isVisible = true;
                $timeout(() => {
                    this.isVisible = false;
                }, 2000);
            }

        }
    };

    $scope.ui.currentWord.set(firstWord.id);
    const firstTile = firstWord.collection[0];
    setCurrentTile(firstTile.x, firstTile.y);

});

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, ['Crossword']);
});