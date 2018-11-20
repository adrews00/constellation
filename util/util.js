// @ts-check
export function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function distance(position1, position2) {
    const xDist = position2.x - position1.x;
    const yDist = position2.y - position1.y;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

export function calcWaypoints(vertices){
    var waypoints=[];
    for(var i=1;i<vertices.length;i++){
        var pt0=vertices[i-1];
        var pt1=vertices[i];
        var dx=pt1.x-pt0.x;
        var dy=pt1.y-pt0.y;
        for(var j=0;j<100;j++){
            var x=pt0.x+dx*j/100;
            var y=pt0.y+dy*j/100;
            waypoints.push({x:x,y:y});
        }
    }
    return(waypoints);
}