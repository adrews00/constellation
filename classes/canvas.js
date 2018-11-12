import { Constellation } from "./constellation.js";

export class SpaceCanvas {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.resizeCanvas();
        this.constellations = [];
        this.showPosition = true;
        this.showArea = true;
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

    generateConstellations() {
        this.constellations.push(new Constellation(this));
        // this.constellations.push(new Constellation(this));
        // this.constellations.push(new Constellation(this));
        // this.constellations.push(new Constellation(this));
        // this.constellations.push(new Constellation(this));
    }

    animate() {
        this.constellations.forEach(constellation => {
            constellation.animate();
        })
    }

}