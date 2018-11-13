import { randomIntFromRange, distance, calcWaypoints } from "../util/util.js";
import { Star } from './star.js';
import { FIXED_INITIAL_BORDER, FIXED_NUMBER_OF_STARS, FIXED_SIZE, FIXED_POSITION, PRIMARY_START_MAX_DISTANCE, FIXED_NUMBER_OF_CHILDREN } from "../config.js";



export class Constellation {
    constructor(space) {
        this.starCount = 0;
        this.space = space;
        this.c = space.c;

        this.generate();
    }

    generate() {
        this.setInitialBorder(FIXED_INITIAL_BORDER);
        this.setNumberOfStars(FIXED_NUMBER_OF_STARS);
        this.setSize(FIXED_SIZE);
        this.setPosition(FIXED_POSITION);


        this.primaryStar = this.generateStar(this.getSpawnArea());
    }

    generateStar(spawnArea, parent) {
        this.starCount++;

        let star = new Star(this);
        star.number = this.starCount;
        star.setPosition(spawnArea);
        star.setChildSpawnArea();
        if (parent) {
            star.parent = parent;
            star.connectionWaypoints = calcWaypoints([parent.position, star.position]);
        }

        if (this.starCount < this.numberOfStars) {
            const numberOfChildren = this.setNumberOfChildren(FIXED_NUMBER_OF_CHILDREN);
            for (let index = 0; index < numberOfChildren; index++) {
                star.children.push(this.generateStar(star.spawnArea, star));
            }
        }
        return star;
    }

    setPosition(fixed) {
        if (fixed) {
            this.position = {
                x: this.space.width / 2,
                y: this.space.height / 2
            }
            return;
        } 
        this.position = {
            x: randomIntFromRange( this.radius, this.space.width - this.radius),
            y: randomIntFromRange( this.radius, this.space.height - this.radius)
        };
        for (let i = 0; i < this.space.constellations.length; i++) {
            const otherConstellation = this.space.constellations[i];
            if (distance(otherConstellation.position, this.position) < this.radius + otherConstellation.radius) {
                this.position = {
                    x: randomIntFromRange( this.radius, this.space.width - this.radius),
                    y: randomIntFromRange( this.radius, this.space.height - this.radius)
                };
                i = -1;
            }
        }
    }

    setSize(fixed) {
        if (fixed) {
            this.radius = 300;
            return;
        }
        this.radius = Math.round((this.space.height <= this.space.width) 
        ? this.space.height * randomIntFromRange(10, 20) * 0.01
        : this.space.width * randomIntFromRange(10, 20) * 0.01);
    }

    setNumberOfStars(numberOfStars) {
        if (numberOfStars) {
            this.numberOfStars = numberOfStars;
            return;
        }
        this.numberOfStars = randomIntFromRange(3, 8);
    }

    setInitialBorder(initialBorder) {
        if (initialBorder) {
            this.initialBorder = initialBorder;
            return;
        }
        this.initialBorder = randomIntFromRange(1,8);
    }

    setNumberOfChildren(numberOfChildren) {
        if (numberOfChildren) {
            return numberOfChildren;
        }
        const chance = randomIntFromRange(0, 100);
        if (chance < 70) {
            return 1;
        } else if (chance < 85) {
            return 2;
        } else if (chance < 98){
            return 3;
        }
    }

    getSpawnArea() {
        const margin = this.radius * PRIMARY_START_MAX_DISTANCE;
        let spawnArea = {};
        switch (this.initialBorder) {
            case 1:
                spawnArea = {
                    x1: this.position.x - this.radius,
                    x2: this.position.x,
                    y1: this.position.y - this.radius,
                    y2: this.position.y - this.radius + margin
                };
                break;
            case 2:
                spawnArea = {
                    x1: this.position.x,
                    x2: this.position.x + this.radius,
                    y1: this.position.y - this.radius,
                    y2: this.position.y - this.radius + margin
                };
                break;
            case 3:
                spawnArea = {
                    x1: this.position.x + this.radius,
                    x2: this.position.x + this.radius - margin,
                    y1: this.position.y - this.radius,
                    y2: this.position.y
                };
                break;
            case 4:
                spawnArea = {
                    x1: this.position.x + this.radius,
                    x2: this.position.x + this.radius - margin,
                    y1: this.position.y,
                    y2: this.position.y + this.radius
                };
                break;
            case 5:
                spawnArea = {
                    x1: this.position.x,
                    x2: this.position.x + this.radius,
                    y1: this.position.y + this.radius,
                    y2: this.position.y + this.radius - margin
                };
                break;
            case 6:
                spawnArea = {
                    x1: this.position.x - this.radius,
                    x2: this.position.x,
                    y1: this.position.y + this.radius,
                    y2: this.position.y + this.radius - margin
                };
                break;
            case 7:
                spawnArea = {
                    x1: this.position.x - this.radius,
                    x2: this.position.x - this.radius + margin,
                    y1: this.position.y,
                    y2: this.position.y + this.radius
                };
                break;
            case 8:
                spawnArea = {
                    x1: this.position.x - this.radius,
                    x2: this.position.x - this.radius + margin,
                    y1: this.position.y - this.radius,
                    y2: this.position.y
                };
                break;
        
            default:
                console.error('Invalid initial border.');
                break;
        }

        return spawnArea;
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
        this.c.rect(this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2)

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
            this.radius-5,
            0,
            2*Math.PI
        );
        this.c.stroke();

        this.c.beginPath();
        this.c.arc(
            this.position.x, 
            this.position.y,
            5,
            0,
            2*Math.PI
        );
        this.c.stroke();
    }

    displayPosition() {
        this.c.fillStyle = '#00ffff77';
        this.c.font = '10px Arial';
        this.c.fillText('no. stars: ' + this.numberOfStars, this.position.x + this.radius + 5 , this.position.y - this.radius + 12 );
        this.c.fillText('border: ' + this.initialBorder, this.position.x + this.radius + 5 , this.position.y - this.radius + 24 );
        this.c.fillText('radius: ' + (this.radius).toFixed(2), this.position.x + this.radius + 5 , this.position.y - this.radius + 36 );
        this.c.fillText('pos x: ' + (this.position.x).toFixed(2), this.position.x + this.radius + 5 , this.position.y - this.radius + 48);
        this.c.fillText('pos y: ' + (this.position.y).toFixed(2), this.position.x + this.radius + 5 , this.position.y - this.radius + 60);
        
        this.c.fillText('1', this.position.x - this.radius / 2, this.position.y - this.radius - 10);
        this.c.fillText('2', this.position.x + this.radius / 2, this.position.y - this.radius - 10);
        this.c.fillText('3', this.position.x + this.radius + 10, this.position.y - this.radius / 2);
        this.c.fillText('4', this.position.x + this.radius + 10, this.position.y + this.radius / 2);
        this.c.fillText('5', this.position.x - this.radius / 2, this.position.y + this.radius + 18);
        this.c.fillText('6', this.position.x + this.radius / 2, this.position.y + this.radius + 18);
        this.c.fillText('7', this.position.x - this.radius - 18, this.position.y - this.radius / 2);
        this.c.fillText('8', this.position.x - this.radius - 18, this.position.y + this.radius / 2);
    }
}