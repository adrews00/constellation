// @ts-check
export function trackMouse(mouse) {

    window.addEventListener('mousemove', event => {
        mouse.x = event.x;
        mouse.y = event.y;
    })

    window.addEventListener('mouseout', event => {
        mouse.x = undefined;
        mouse.y = undefined;
    })
}

export function trackWindow(canvas) {
    window.addEventListener('resize', event => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    })

    
} 

export function trackKey(space) {
    document.addEventListener('keydown', event => {
        if (event.keyCode === 16) {
            space.showArea = !space.showArea;
        }
        if (event.keyCode === 17) {
            space.showPosition = !space.showPosition;
        }
    })
}