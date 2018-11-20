// @ts-check
import { trackMouse, trackWindow, trackKey } from './handlers/events.js';
import { SpaceCanvas } from './classes/canvas.js';
import { NUMBER_OF_CONSTELATIONS } from './config.js';


var space = new SpaceCanvas();
var c = space.getContext();

var mouse = {
    x: undefined, 
    y: undefined
}

function init() {
    trackMouse(mouse);
    trackWindow(space.canvas);
    trackKey(space);
    space.generateConstellations(NUMBER_OF_CONSTELATIONS);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, space.width, space.height);
    space.animate();
}

init();