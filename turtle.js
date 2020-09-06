// https://en.wikipedia.org/wiki/L-system
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
const width = window.innerWidth
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Defines a modulo operation that can handle negative numbers.
// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers.
function modulo(a, n) {
    return ((a % n) + n) % n;
}

const turtle = function(x, y, angle) {
    let state = {
        x: x,
        y: y,
        angle: angle
    };
    return Object.assign(state, canMove(state), canRotate(state));
};

const canMove = (state) => ({
        getAxisDistance: (distance, angle) => {
            // Determines the quadrant that the angle is located in.
            let quadrant = 1;
            while (angle >= Math.PI / 2) {
                quadrant++;
                angle -= Math.PI / 2;
            }
            let x = (quadrant === 1 || quadrant === 2) ? 1 : -1;
            let y = (quadrant === 2 || quadrant === 3) ? 1 : -1;
            let opposite = distance * Math.sin(angle);
            let adjacent = distance * Math.cos(angle);
            x *= (quadrant === 1 || quadrant === 3) ? opposite : adjacent;
            y *= (quadrant === 2 || quadrant === 4) ? opposite : adjacent;
            return [x, y];
        },
        moveForward: (distance) => {
            context.moveTo(state.x, state.y);
            [xDist, yDist] = state.getAxisDistance(distance, state.angle);
            state.x = state.x + xDist;
            state.y = state.y + yDist;
            context.lineTo(state.x, state.y);
            context.stroke();
        },
});

const canRotate = (state) => ({
    rotateRight: (angle) => state.angle = modulo(state.angle + angle, 2 * Math.PI),
    rotateLeft: (angle) => state.angle = modulo(state.angle - angle, 2 * Math.PI)
});

let turtleA = turtle(width / 2, height / 2, degreesToRadians(0));

let iterations = 3;
let pattern = ['F'];
let rule = ['F', '+', 'F', '-', 'F', '-', 'F', '+', 'F'];
for (let i = 0; i < iterations; i++) {
    let j = 0;
    while (j < pattern.length) {
        if (pattern[j] === 'F') {
            pattern.splice(j, 1, ...rule);
            j += rule.length;
        } else {
            j++;
        }
    }
}

pattern.forEach(symbol => {
    // Draw.
    if (symbol === 'F') {
        turtleA.moveForward(10);
    } else if (symbol === '+') {
        turtleA.rotateLeft(degreesToRadians(90));
    } else if (symbol === '-') {
        turtleA.rotateRight(degreesToRadians(90));
    }
});
