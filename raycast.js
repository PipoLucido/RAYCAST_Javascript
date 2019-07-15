const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLUMNS = 15;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;
const WINDOW_WIDTH = MAP_NUM_COLUMNS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180);

const WALL_STRIP_WIDTH = 100;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;


class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
    }
    hasWallAt(x, y) {

        if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT) {
            return true;
        }

        let mapGridIndexX = Math.floor(x / TILE_SIZE);
        let mapGridIndexY = Math.floor(y / TILE_SIZE);

        return this.grid[mapGridIndexY][mapGridIndexX] != 0;
    }

    render() {

        for (let i = 0; i < MAP_NUM_ROWS; i++) {
            for (let j = 0; j < MAP_NUM_COLUMNS; j++) {
                let tileX = j * TILE_SIZE;
                let tileY = i * TILE_SIZE;
                let tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
                stroke("#222");
                fill(tileColor);
                rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }
        }

    }
}



class Player {
    constructor() {
        this.x = WINDOW_WIDTH / 2;
        this.y = WINDOW_HEIGHT / 2;
        this.radius = 3;
        this.turnDirection = 0; //-1 if left , +1 if right
        this.walkDirection = 0; // -1 if back, +1 if front
        this.rotationAngle = Math.PI / 2;
        this.moveSpeed = 2.0;
        this.rotationSpeed = 2 * (Math.PI / 180);
    }
    update() {


        this.rotationAngle += this.turnDirection * this.rotationSpeed;
        let moveStep = this.walkDirection * this.moveSpeed;


        let newPlayerX = this.x + Math.cos(this.rotationAngle) * moveStep;
        let newPlayerY = this.y + Math.sin(this.rotationAngle) * moveStep;

        if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
            this.x = newPlayerX;
            this.y = newPlayerY;
        }

    }
    render() {
        noStroke();
        fill("green");
        circle(this.x, this.y, this.radius);
        /*stroke("green");
        line(this.x,
            this.y,
            this.x + Math.cos(this.rotationAngle) * 20 ,
            this.y + Math.sin(this.rotationAngle) * 20
            );*/
    }
}

class Ray {

    constructor(rayAngle) {
        this.rayAngle = normalizeAngle(rayAngle);
        this.wallHitX = 0;
        this.wallHitY = 0;
        this.distance = 0;
        this.wasHitVertical = false;

        this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
        this.isRayFacingUp = !this.isRayFacingDown;

        this.isRayFacingRight = this.rayAngle < 0.5 * Math.PI || this.rayAngle > 1.5 * Math.PI;
        this.isRayFacingLeft = !this.isRayFacingRight;
    }
    cast(columnId) {
        let xintercep, yintercep;
        let xstep, ystep;
        /////////////////////////////////////////////
        //     INTERSECCION HORIZONTAL RAY GRID    //
        /////////////////////////////////////////////

        let findHorizontalWallHit = false;
        let HorizontalwallHitxx = 0;
        let HorizontalwallHityy = 0;


        //        console.log("is ray facing right ? : " +this.isRayFacingRight)

        //      console.log("is ray facing left ? : " +this.isRayFacingLeft)

        //encuentra la cordenada Y de la intersecion gorizontal mas cercana 
        yintercep = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
        yintercep += this.isRayFacingDown ? TILE_SIZE : 0; //SI ESTA APUNTANDO ABAJO SE SUMA 32 PORQUE NO ESTA APUNTANDO PARA ARRIBA QUE ARRIBA Y VALE CERO, ENTONCES ABAJO Y VALE 32



        //encuentra la cordenada Y de la intersecion horizontal mas cercana
        xintercep = player.x + (yintercep - player.y) / Math.tan(this.rayAngle);

        //calcular incremento para xstep y ystep

        ystep = TILE_SIZE;

        ystep *= this.isRayFacingUp ? -1 : 1;


        xstep = TILE_SIZE / Math.tan(this.rayAngle)

        xstep *= (this.isRayFacingLeft && xstep > 0) ? -1 : 1;
        xstep *= (this.isRayFacingRight && xstep < 0) ? -1 : 1;

        let nextHorizontalTouchX = xintercep;
        let nextHorizontalTouchY = yintercep;

        if (this.isRayFacingUp) {
            nextHorizontalTouchY--;
        }

        while (nextHorizontalTouchX >= 0 && nextHorizontalTouchX <= WINDOW_WIDTH && nextHorizontalTouchY >= 0 && nextHorizontalTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextHorizontalTouchX, nextHorizontalTouchY)) {

                //encontramos una coliccion con el ray
                findHorizontalWallHit = true;
                HorizontalwallHitxx = nextHorizontalTouchX;
                HorizontalwallHityy = nextHorizontalTouchY;


                break;
            } else {
                //seguimos el incremento
                nextHorizontalTouchX += xstep;
                nextHorizontalTouchY += ystep;

            }

        }



        ///////////////////////////////////////////
        //   INTERSECCION VERTICAL RAY GRID      //
        ///////////////////////////////////////////

        let findVerticalWallHit = false;
        let VerticalwallHitxx = 0;
        let VerticalwallHityy = 0;


        //        console.log("is ray facing right ? : " +this.isRayFacingRight)

        //      console.log("is ray facing left ? : " +this.isRayFacingLeft)

        //encuentra la cordenada X de la intersecion vertical mas cercana 
        xintercep = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
        xintercep += this.isRayFacingRight ? TILE_SIZE : 0; //SI ESTA APUNTANDO A LA DERECHA SE SUMA 32 PORQUE NO ESTA APUNTANDO PARA ARRIBA QUE ARRIBA Y VALE CERO, ENTONCES ABAJO Y VALE 32



        //encuentra la cordenada Y de la intersecion vertical mas cercana
        yintercep = player.y + (xintercep - player.x) * Math.tan(this.rayAngle);

        //calcular incremento para xstep y ystep

        xstep = TILE_SIZE;

        xstep *= this.isRayFacingLeft ? -1 : 1;


        ystep = TILE_SIZE * Math.tan(this.rayAngle)

        ystep *= (this.isRayFacingUp && ystep > 0) ? -1 : 1;
        ystep *= (this.isRayFacingDown && ystep < 0) ? -1 : 1;

        let nextVerticalTouchX = xintercep;
        let nextVerticalTouchY = yintercep;

        if (this.isRayFacingLeft) {
            nextVerticalTouchX--;
        }

        while (nextVerticalTouchX >= 0 && nextVerticalTouchX <= WINDOW_WIDTH && nextVerticalTouchY >= 0 && nextVerticalTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextVerticalTouchX, nextVerticalTouchY)) {

                //encontramos una coliccion con el ray
                findVerticalWallHit = true;
                VerticalwallHitxx = nextVerticalTouchX;
                VerticalwallHityy = nextVerticalTouchY;

                break;
            } else {
                //seguimos el incremento
                nextVerticalTouchX += xstep;
                nextVerticalTouchY += ystep;

            }

        }

        // CALCULAR LAS DISTANCIAS DE HORIZONTAL Y VERTICAL Y ELEGIR LA MAS CORTA
        let horzHitDistance = (findHorizontalWallHit) ?
            distanceBetweenPoints(player.x, player.y, HorizontalwallHitxx, HorizontalwallHityy) :
            Number.MAX_VALUE;


        let verticalHitDistance = (findVerticalWallHit) ?
            distanceBetweenPoints(player.x, player.y, VerticalwallHitxx, VerticalwallHityy) :
            Number.MAX_VALUE;

        //SOLO GUARDA LA DISTANCIA MAS CORTA
        this.wallHitX = (horzHitDistance < verticalHitDistance) ? HorizontalwallHitxx : VerticalwallHitxx;
        this.wallHitY = (horzHitDistance < verticalHitDistance) ? HorizontalwallHityy : VerticalwallHityy;
        this.distance = (horzHitDistance < verticalHitDistance) ? horzHitDistance : verticalHitDistance;
        this.wasHitVertical = (verticalHitDistance < horzHitDistance);
    }

    render() {
        stroke("green");
        line(
            player.x,
            player.y,
            this.wallHitX,
            this.wallHitY
        );

    }

}



var grid = new Map();

let player = new Player();

let rays = [];

function keyPressed() {
    if (keyCode == UP_ARROW) {
        player.walkDirection = +1;
    } else if (keyCode == DOWN_ARROW) {
        player.walkDirection = -1;
    } else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = +1;
    } else if (keyCode == LEFT_ARROW) {
        player.turnDirection = -1;
    }
}

function keyReleased() {
    if (keyCode == UP_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == DOWN_ARROW) {
        player.walkDirection = 0;
    } else if (keyCode == RIGHT_ARROW) {
        player.turnDirection = 0;
    } else if (keyCode == LEFT_ARROW) {
        player.turnDirection = 0;
    }
}


function castAllRays() {

    let columnId = 0;

    //EMPIEZA EN EL MEDIO DEL ANGULO

    let rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

    rays = [];

    for (let i = 0; i < NUM_RAYS; i++) {

        let ray = new Ray(rayAngle);

        ray.cast(columnId);

        rays.push(ray);

        rayAngle += FOV_ANGLE / NUM_RAYS;

        columnId++;

    }


}

function normalizeAngle(angle) {

    angle = angle % (2 * Math.PI);

    if (angle < 0) {
        angle = (2 * Math.PI) + angle;
    }

    return angle;

}

function distanceBetweenPoints(x1, y1, x2, y2) {

    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

}


function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
    player.update();
    castAllRays();

}

function draw() {
    update();
    grid.render();
    for (ray of rays) {
        ray.render();
    }

    player.render();

}