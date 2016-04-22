import { range } from 'lodash';

export default function (content) {
    const size = { x: 0, y: 0 };

    const horizontal = content.horizontal.map((item) => {
        const { word, location, clue } = item;
        const startX = location[0];
        const endX = word.length + startX;
        const y = location[1];
        const coords = range(startX, endX).map((xx) => [xx, y]);
        if (endX > size.x) size.x = endX;
        return { word, clue, coords, direction: 'horizontal' };
    });

    const vertical = content.vertical.map((item) => {
        const { word, location, clue } = item;
        const startY = location[1];
        const endY = word.length + startY;
        const x = location[0];
        const coords = range(startY, endY).map((yy) => [x, yy]);
        if (endY > size.y) size.y = endY;
        return { word, clue, coords, direction: 'vertical' };
    });

    const words = horizontal.concat(vertical).sort((itemA, itemB) => {
        const x = { a: itemA.coords[0], b: itemB.coords[0] };
        const y = { a: itemA.coords[1], b: itemB.coords[1] };

        if (y.a < y.b) return -1;
        if (x.a < x.b) return -1;
        return 1;
    });

    return { size, words };
}