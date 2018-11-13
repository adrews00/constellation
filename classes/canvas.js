import { Constellation } from "./constellation.js";
import { SHOW_AREA, SHOW_POSITIONS } from "../config.js";

export class SpaceCanvas {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.resizeCanvas();
        this.constellations = [];
        this.showPosition = SHOW_POSITIONS;
        this.showArea = SHOW_AREA;
    }

    getContext() {
        this.c = this.canvas.getContext('2d');
        return this.c;
    }

    resizeCanvas() {
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.height =  window.innerHeight
        this.width = window.innerWidth;

        
    }

    generateConstellations(numberOfConstellations) {
        for (let index = 0; index < numberOfConstellations; index++) {
            this.constellations.push(new Constellation(this));
        }
    }

    animate() {
        this.constellations.forEach(constellation => {
            constellation.animate();
        })
    }

}