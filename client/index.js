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

    this.bar = {
        x: 0,
        y: 3,
        val: 'asdf  ',
        wordLength: 6,
        latinAlphabet: 'abcdefghijklmnopqrstuvwxyz'.toUpperCase(),
        isInLatinAlphabet (character) {
            return this.latinAlphabet.indexOf(character.toUpperCase()) > -1;
        },
        setCursor (node, index) {
            $timeout(() => node.setSelectionRange(index, index), 0);
        },
        handleCharacter ($event) {
            const { target, keyCode } = $event;
            const character = String.fromCharCode(keyCode).toUpperCase();

            if (this.isInLatinAlphabet(character)) {
                $event.preventDefault();
                const { selectionEnd } = target;

                this.insertChar(selectionEnd, character);

                if (this.val.length >= this.wordLength) {
                    this.val = this.val.slice(0, this.wordLength);
                }

                const newCursorIndex = selectionEnd + 1;
                const x = this.x + newCursorIndex;
                setCurrentTile(x, this.y);
                this.setCursor(target, newCursorIndex);
            }
        },
        insertChar(inserIndex, newCharacter) {
            const newVal = this.val.split('');
            newVal.splice(inserIndex, 1, newCharacter);
            this.val = newVal.join('').toUpperCase();
        },
        handleBackspace ($event) {
            const { target } = $event;
            const cursorIndex = target.selectionEnd - 1;
            if (cursorIndex > -1) {
                $event.preventDefault();
                this.insertChar(cursorIndex, ' ');
                setCurrentTile(cursorIndex, this.y);
                this.setCursor(target, cursorIndex);
            }
        },
        onKeydown ($event) {
            const { target, keyCode, metaKey } = $event;
            const { selectionEnd } = target;

            console.log(keyCode, selectionEnd, this.wordLength);
            const isBackspace = keyCode === 8;
            if (isBackspace) return this.handleBackspace($event);

            const isLeftArrow = keyCode === 37;
            if (isLeftArrow) {
                let x = selectionEnd - 1;
                x = (x > -1) ? x : 0;
                return setCurrentTile(x, this.y);
            }

            const isRightArrow = keyCode === 39;
            if (isRightArrow) {
                let x = selectionEnd + 1;
                x = (x < this.wordLength) ? x : this.wordLength;
                return setCurrentTile(x, this.y);
            }

            const mightBeValidCharacter = selectionEnd > -1 && metaKey === false;
            if (mightBeValidCharacter) return this.handleCharacter($event);

        }
    };

    function setCurrentTile(x, y) {
        const tiles = $scope.crossword.collection;
        tiles.forEach(tile => tile.isCurrent = false);
        const tile = $scope.crossword.get(x, y);
        tile.isCurrent = true;
    }

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
        // 9,  // tab
        16, // shift
        17, // ctrl
        18  // alt
    ];

    const focusTileByCoords = (x, y) => {
        focus(`tile-${x}${y}`);
    };


    function foo ($event, tile) {
        $event.preventDefault();
        tile.input = tile.input.toUpperCase();
        const { input, x, y } = tile;

        const keyIsBlackedListed = inputKeyBlacklist.indexOf($event.keyCode) > -1;
        const inputIsEmpty = input.length === 0;
        if (keyIsBlackedListed || inputIsEmpty) return;

        const shouldCutInput = input.length > 1;
        if (shouldCutInput) tile.input = String.fromCharCode($event.keyCode).toUpperCase();

        let nextTile;

        if (tile.isLastInWord.indexOf($scope.ui.currentWord.id) > -1) {
            let nextWord = $scope.crossword.words.get($scope.ui.currentWord.id + 1);
            if (!nextWord) nextWord = $scope.crossword.words.get(1);
            nextTile = nextWord.collection[0];
            $scope.ui.currentWord.set(nextWord.id);
        } else {
            nextTile = $scope.crossword.words.get($scope.ui.currentWord.id).getNextTile(x, y);
        }

        focusTileByCoords(nextTile.x, nextTile.y);
    }

    $scope.queue = [];

    $scope.isOccurring = false;


    $scope.processQueue = () => {
        $scope.isOccurring = true;
        const items = $scope.queue.slice();
        $scope.queue = [];
        items.forEach((item) => {
            foo(item.$event, item.tile);
        });
        if ($scope.queue.length > 0) {
            console.log('HOLY SHIT')
            $scope.processQueue();
        }
        $scope.isOccurring = false;
    };

    $scope.onKeypress = ($event, tile) => {
        $scope.queue.push({ $event, tile });
        console.log($scope.queue.length)
        if ($scope.queue.length >= 1) {
            $scope.processQueue();
        }
    };

    $scope.ui = {
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
        },
        handleTileFocus (words) {
            const wordIndex = words.indexOf($scope.ui.currentWord.id);
            if (wordIndex === -1) {
                $scope.ui.currentWord.set(words[0]);
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
    focusTileByCoords(firstTile.x, firstTile.y);

});

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, ['Crossword']);
});