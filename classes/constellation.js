import { randomIntFromRange, distance, calcWaypoints } from "../util/util.js";
import { Star } from './star.js';

export class Constellation {
    constructor(space) {
        this.space = space;
        this.c = space.c;
        // this.numberOfStars = 5;
        // this.initialBorder = 2;
        this.initialBorder = randomIntFromRange(1,4);
        this.numberOfStars = randomIntFromRange(3, 8);
        this.generate();
    }

    generate() {
        this.setSize();
        this.setPosition();
        this.setDirection();
        
        this.primaryStar = this.generateStar();
        this.primaryStar.setChildSpawnArea(this);
        // let previousStar;
        // for (let index = 0; index < this.numberOfStars; index++) {

        //     let star = new Star(this.space);
        //     star.number = index+1;
        //     star.setPosition(this, previousStar);
        //     if ( index === 0 ) {
        //         this.primaryStar = previousStar = star;
        //     } else {
        //         previousStar.connectionWaypoints = calcWaypoints([previousStar.position, star.position]);
        //         previousStar.children.push(star);
        //         previousStar = star;
        //     }
        //     star.setChildSpawnArea(this);
        // }
    }

    generateStar() {
        let star = new Star(this.space, this);
        star.number = 1;
        star.setPosition(this);
        
        return star;
    }

    setDirection() {
        this.direction = randomIntFromRange(1,8);
    }

    setPosition() {
        this.position = {
            x: this.space.width / 2,
            y: this.space.height / 2
        }
        // this.position = {
        //     x: randomIntFromRange( this.radius, this.space.width - this.radius),
        //     y: randomIntFromRange( this.radius, this.space.height - this.radius)
        // };
        // for (let i = 0; i < this.space.constellations.length; i++) {
        //     const otherConstellation = this.space.constellations[i];
        //     if (distance(otherConstellation.position, this.position) < this.radius + otherConstellation.radius) {
        //         this.position = {
        //             x: randomIntFromRange( this.radius, this.space.width - this.radius),
        //             y: randomIntFromRange( this.radius, this.space.height - this.radius)
        //         };
        //         i = -1;
        //     }
        // }
    }

    setSize() {
        this.radius = 300;

        // this.radius = Math.round((this.space.height <= this.space.width) 
        // ? this.space.height * randomIntFromRange(10, 20) * 0.01
        // : this.space.width * randomIntFromRange(10, 20) * 0.01);
    }

    animate() {
        if (this.primaryStar) {
            this.primaryStar.draw();
            this.primaryStar.drawEllipse();
        }
        if (this.space.showArea) {
            this.drawArea();
        } 
        if (this.space.showPosition) {
            this.displayPosition();
        }
    }

    drawArea() {
        this.c.strokeStyle = '#00ffff10';
        this.c.rect(this.position.x - this.radius, this.position.y - this.radius, this.radius*2, this.radius*2)
        this.c.stroke();

        this.c.beginPath();
        this.c.moveTo(this.position.x - this.radius, this.position.y);
        this.c.lineTo(this.position.x + this.radius, this.position.y);
        this.c.moveTo(this.position.x, this.position.y - this.radius);
        this.c.lineTo(this.position.x, this.position.y + this.radius);
        this.c.stroke();

        this.c.beginPath();
        this.c.arc(
            this.position.x, 
            this.position.y,
            this.radius,
            0,
            2*Math.PI
        );
        this.c.stroke();

        this.c.beginPath();
        this.c.arc(
            this.position.x, 
            this.position.y,
            2,
            0,
            2*Math.PI
        );
        this.c.stroke();
    }

    displayPosition() {
        this.c.fillStyle = '#00ffff77';
        this.c.font = '10px Arial';
        this.c.fillText('no. stars: ' + this.numberOfStars, this.position.x + this.radius + 5 , this.position.y - this.radius + 12 );
        this.c.fillText('start from: ' + this.initialBorder, this.position.x + this.radius + 5 , this.position.y - this.radius + 24 );
        this.c.fillText('radius: ' + this.radius, this.position.x + this.radius + 5 , this.position.y - this.radius + 36 );
        this.c.fillText('pos x: ' + this.position.x, this.position.x + this.radius + 5 , this.position.y - this.radius + 48);
        this.c.fillText('pos y: ' + this.position.y, this.position.x + this.radius + 5 , this.position.y - this.radius + 60);
    }
}