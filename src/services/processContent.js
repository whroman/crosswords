import { range } from 'lodash';

export default function (content) {
    const size = {
        x: 0,
        y: 0
    };

    const words = [];

    content.horizontal.forEach((item) => {
        const { word, location, clue } = item;
        const startX = location[0];
        const endX = word.length + startX;
        const y = location[1];
        const coords = range(startX, endX).map((xx) => [xx, y]);
        if (endX > size.x) size.x = endX;
        words.push({ word, clue, coords });
    });

    content.vertical.forEach((item) => {
        const { word, location, clue } = item;
        const startY = location[1];
        const endY = word.length + startY;
        const x = location[0];
        const coords = range(startY, endY).map((yy) => [x, yy]);
        if (endY > size.y) size.y = endY;
        words.push({ word, clue, coords });
    });

    return { size, words };
}