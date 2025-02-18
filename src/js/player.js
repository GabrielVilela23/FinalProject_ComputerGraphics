import { healthHud as updateHealthHud, sphereHud as updateSphereHud } from './hud.js';

export class objPlayer {
    constructor() {
        this.health = 5;
        this.spheres = 0;
    }

    takeDamage(damage = 1) {
        this.health -= damage;
        updateHealthHud(this);

        if (this.health <= 0) {
            console.log('Morto');
        }
    }

    collectSpheres(point = 1) {
        this.spheres += point;
        updateSphereHud(this);
    }
}
