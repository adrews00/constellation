import { randomIntFromRange } from "../util/util.js";

const ELLIPSE_PADDING = 4;

export class Star {
    constructor(space, constellation) {
        this.space = space;
        this.constellation = constellation;
        this.c = space.c;
        this.color = '#fff';
        this.radius = randomIntFromRange(1, 2);
        this.ellipseComplete = 0; 
        this.children = [];
        this.t = 1;
    }

    draw() {
        
        this.c.beginPath();
        this.c.fillStyle = this.color;
        this.c.arc(
            this.position.x, 
            this.position.y,
            this.radius,
            0,
            2 * Math.PI
        );
        this.c.fill();
        this.children.forEach(star => {
            star.draw();
        });
        if (this.space.showArea) {
            this.drawSpawnArea();
        }
        if (this.space.showPosition) {
            this.displayPosition();
        }
    }


    displayPosition() {
        this.c.fillStyle = '#ffffff77';
        this.c.font = '10px Arial';
        this.c.fillText('n: ' + this.number, this.position.x + 10, this.position.y - 10);
        this.c.fillText('x: ' + this.position.x, this.position.x + 10, this.position.y);
        this.c.fillText('y: ' + this.position.y, this.position.x + 10, this.position.y + 10);

        this.c.fillText('rx: ' + this.spawnPoint.rx, this.spawnPoint.x + this.spawnPoint.rx + 5, this.spawnPoint.y - this.spawnPoint.ry + 10);
        this.c.fillText('ry: ' + this.spawnPoint.ry, this.spawnPoint.x + this.spawnPoint.rx + 5, this.spawnPoint.y - this.spawnPoint.ry + 20);
        this.c.fillText('x: ' + this.spawnPoint.y, this.spawnPoint.x + this.spawnPoint.rx + 5, this.spawnPoint.y - this.spawnPoint.ry + 30);
        this.c.fillText('y: ' + this.spawnPoint.x, this.spawnPoint.x + this.spawnPoint.rx + 5, this.spawnPoint.y - this.spawnPoint.ry + 40);
    }

    drawEllipse() {
        this.c.beginPath();
        this.c.strokeStyle = '#00ffff40';
        this.c.arc(
            this.position.x, 
            this.position.y,
            this.radius + ELLIPSE_PADDING,
            0,
            this.ellipseComplete / 100 * 2 * Math.PI
        );
        this.c.stroke();
        if (this.ellipseComplete < 100) {
            this.ellipseComplete++;
            this.ellipseComplete++;
            this.ellipseComplete++;
            this.ellipseComplete++;
        } else {
            this.connectToNext();
        }

        
    }

    setChildSpawnArea(constellation) {
        this.spawnPoint = {};
        if (constellation.primaryStar.position.x < constellation.position.x) {
            this.spawnPoint.rx = (constellation.position.x + constellation.radius - this.position.x) / constellation.numberOfStars + this.number;
            this.spawnPoint.x = this.position.x + this.spawnPoint.rx;
        } else {
            this.spawnPoint.rx = (this.position.x - constellation.position.x + constellation.radius ) / constellation.numberOfStars + this.number;
            this.spawnPoint.x = this.position.x - this.spawnPoint.rx;
        }
        if (constellation.primaryStar.position.y < constellation.position.y) {
            this.spawnPoint.ry = (constellation.position.y + constellation.radius - this.position.y) / constellation.numberOfStars + this.number;
            this.spawnPoint.y = this.position.y + this.spawnPoint.ry;
        } else {
            this.spawnPoint.ry = (this.position.y - constellation.position.y + constellation.radius ) / constellation.numberOfStars + this.number;
            this.spawnPoint.y = this.position.y - this.spawnPoint.ry;
        }
    }

    drawSpawnArea() {
        if (this.spawnPoint) {
            this.c.strokeStyle = '#ffffff10';
            this.c.rect(this.spawnPoint.x - this.spawnPoint.rx, this.spawnPoint.y - this.spawnPoint.ry , this.spawnPoint.rx *2, this.spawnPoint.ry *2);
            this.c.stroke();
            for (let index = 0; index < this.constellation.numberOfStars - this.number; index++) {
                this.c.moveTo(this.spawnPoint.x + index * this.spawnPoint.rx, this.spawnPoint.y - this.spawnPoint.ry);
                this.c.lineTo(this.spawnPoint.x + index * this.spawnPoint.rx, this.spawnPoint.y + this.spawnPoint.ry);
                this.c.stroke()
            }

            this.c.beginPath();
            this.c.arc(
                this.spawnPoint.x, 
                this.spawnPoint.y,
                2,
                0,
                2*Math.PI
            );
            this.c.stroke();
        }
    }

    setPosition(constellation, parentStar) {
        if (this.number == 1) {
            this.position = {};
            const margin = constellation.radius * 0.1;
            
            switch (constellation.initialBorder) {
                case 1:
                    this.position = {
                        x: randomIntFromRange(constellation.position.x - constellation.radius, constellation.position.x - constellation.radius + margin),
                        y: randomIntFromRange(constellation.position.y - constellation.radius, constellation.position.y + constellation.radius)
                    };
                    break;
                case 2:
                    this.position = {
                        x: randomIntFromRange(constellation.position.x + constellation.radius, constellation.position.x - constellation.radius),
                        y: randomIntFromRange(constellation.position.y - constellation.radius, constellation.position.y - constellation.radius + margin)
                    };
                    break;
                case 3:
                    this.position = {
                        x: randomIntFromRange(constellation.position.x + constellation.radius, constellation.position.x + constellation.radius - margin),
                        y: randomIntFromRange(constellation.position.y - constellation.radius, constellation.position.y + constellation.radius)
                    };
                    break;
                case 4:
                    this.position = {
                        x: randomIntFromRange(constellation.position.x + constellation.radius, constellation.position.x - constellation.radius),
                        y: randomIntFromRange(constellation.position.y + constellation.radius, constellation.position.y + constellation.radius - margin)
                    };
                    break;
            
                default:
                    break;
            }

        } else {
            this.position = {
                x: randomIntFromRange(parentStar.spawnPoint.x - parentStar.spawnPoint.rx, parentStar.spawnPoint.x + parentStar.spawnPoint.rx),
                y: randomIntFromRange(parentStar.spawnPoint.y - parentStar.spawnPoint.ry, parentStar.spawnPoint.y + parentStar.spawnPoint.ry)
            }
        }

        
    }

    connectToNext() {
        if (!this.connectionWaypoints) {
            return;
        }
        
        if (this.t < this.connectionWaypoints.length-1) {
            this.t++;
            this.t++;
        } else {
            this.children.forEach(star => {
                star.drawEllipse();
            });
        }

        this.c.beginPath();
        this.c.moveTo(this.position.x, this.position.y);
        this.c.lineTo(this.connectionWaypoints[this.t].x,this.connectionWaypoints[this.t].y);
        this.c.stroke();
    }
}