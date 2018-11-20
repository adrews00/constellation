// @ts-check
import { randomIntFromRange } from "../util/util.js";
import { ELLIPSE_PADDING } from "../config.js";

export class Star {
    constructor(constellation) {
        this.constellation = constellation;
        this.space = constellation.space;
        this.c = constellation.space.c;
        this.color = '#fff';
        this.radius = randomIntFromRange(1, 2);
        this.ellipseComplete = 0; 
        this.children = [];
        this.t = 1;
        this.connectionWaypoints = [];
        this.number = null;
        this.parent = null;
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
            this.drawPositions();
        }
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
            this.children.forEach(child => {
                child.connectToNext();
            })
        }

        
    }

    setPosition(spawnArea) {
        this.position = {
            x: randomIntFromRange(spawnArea.x1, spawnArea.x2),
            y: randomIntFromRange(spawnArea.y1, spawnArea.y2)
        }
    }

    setChildSpawnArea() {
        let spawnArea = {};

        switch (this.constellation.initialBorder) {
            case 1: 
                spawnArea = {
                    x1: this.position.x,
                    x2: this.position.x + ((this.constellation.position.x + this.constellation.radius - this.position.x) / (this.constellation.numberOfStars - this.number )),
                    y1: this.position.y,
                    y2: this.position.y + ((this.constellation.position.y + this.constellation.radius - this.position.y) / (this.constellation.numberOfStars - this.number ))
                };
                break;
            case 2: 
                spawnArea = {
                    x1: this.position.x - ((this.position.x - (this.constellation.position.x - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )), 
                    x2: this.position.x,
                    y1: this.position.y,
                    y2: this.position.y + ((this.constellation.position.y + this.constellation.radius - this.position.y) / (this.constellation.numberOfStars - this.number ))
                };
                break;
            case 3: 
                spawnArea = {
                    x1: this.position.x - ((this.position.x - (this.constellation.position.x - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )), 
                    x2: this.position.x,
                    y1: this.position.y,
                    y2: this.position.y + ((this.constellation.position.y + this.constellation.radius - this.position.y) / (this.constellation.numberOfStars - this.number ))
                };
                break;
            case 4: 
                spawnArea = {
                    x1: this.position.x - ((this.position.x - (this.constellation.position.x - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )), 
                    x2: this.position.x,
                    y1: this.position.y - ((this.position.y - (this.constellation.position.y - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )),
                    y2: this.position.y
                };
                break;
            case 5: 
                spawnArea = {
                    x1: this.position.x - ((this.position.x - (this.constellation.position.x - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )), 
                    x2: this.position.x,
                    y1: this.position.y - ((this.position.y - (this.constellation.position.y - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )),
                    y2: this.position.y
                };
                break;
            case 6: 
                spawnArea = {
                    x1: this.position.x,
                    x2: this.position.x + ((this.constellation.position.x + this.constellation.radius - this.position.x) / (this.constellation.numberOfStars - this.number )),
                    y1: this.position.y - ((this.position.y - (this.constellation.position.y - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )),
                    y2: this.position.y
                };
                break;
            case 7: 
                spawnArea = {
                    x1: this.position.x,
                    x2: this.position.x + ((this.constellation.position.x + this.constellation.radius - this.position.x) / (this.constellation.numberOfStars - this.number )),
                    y1: this.position.y - ((this.position.y - (this.constellation.position.y - this.constellation.radius)) / (this.constellation.numberOfStars - this.number )),
                    y2: this.position.y
                };
                break;
            case 8: 
                spawnArea = {
                    x1: this.position.x,
                    x2: this.position.x + ((this.constellation.position.x + this.constellation.radius - this.position.x) / (this.constellation.numberOfStars - this.number )),
                    y1: this.position.y,
                    y2: this.position.y + ((this.constellation.position.y + this.constellation.radius - this.position.y) / (this.constellation.numberOfStars - this.number ))
                };
                break;
        }
        this.spawnArea = spawnArea;
        return spawnArea;
    }

    connectToNext() {
        if (!this.connectionWaypoints) {
            return;
        }
        
        if (this.t < this.connectionWaypoints.length-1) {
            this.t++;
            this.t++;
        } else {
            this.drawEllipse();
        }

        this.c.beginPath();
        this.c.moveTo(this.parent.position.x, this.parent.position.y);
        this.c.lineTo(this.connectionWaypoints[this.t].x,this.connectionWaypoints[this.t].y);
        this.c.stroke();
    }

    drawSpawnArea() {
        if (this.spawnArea) {
            this.c.strokeStyle = '#ffffff10';
            this.c.rect(this.spawnArea.x1, this.spawnArea.y1, (this.spawnArea.x2 - this.spawnArea.x1), (this.spawnArea.y2 - this.spawnArea.y1));
            this.c.stroke();


            this.c.beginPath();
            this.c.arc(
                this.spawnArea.x1 + ((this.spawnArea.x2 - this.spawnArea.x1) / 2) , 
                this.spawnArea.y1 + ((this.spawnArea.y2 - this.spawnArea.y1) / 2) ,
                2,
                0,
                2*Math.PI
            );
            this.c.stroke();
        }
    }

    drawPositions() {
        this.c.fillStyle = '#ffffff77';
        this.c.font = '10px Arial';
        this.c.fillText('n: ' + this.number, this.position.x + 10, this.position.y - 10);
        this.c.fillText('x: ' + (this.position.x).toFixed(2), this.position.x + 10, this.position.y);
        this.c.fillText('y: ' + (this.position.y).toFixed(2), this.position.x + 10, this.position.y + 10);

        if (this.spawnArea) {
            this.c.fillText('x1: ' + (this.spawnArea.x1).toFixed(2), this.spawnArea.x2 + 5, this.spawnArea.y1  + 10);
            this.c.fillText('x2: ' + (this.spawnArea.x2).toFixed(2), this.spawnArea.x2 + 5, this.spawnArea.y1  + 20);
            this.c.fillText('y1: ' + (this.spawnArea.y1).toFixed(2), this.spawnArea.x2 + 5, this.spawnArea.y1  + 30);
            this.c.fillText('y2: ' + (this.spawnArea.y2).toFixed(2), this.spawnArea.x2 + 5, this.spawnArea.y1  + 40);
        }
    }

    
}