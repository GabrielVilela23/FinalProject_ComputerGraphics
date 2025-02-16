import { healthHud as updateHealthHud, sphereHud as updateSphereHud } from './hud.js';

export class objPlayer {
    constructor() {
        this.health = 5;
        this.spheres = 0;
    }

    takeDamage(damage) {
        this.health -= damage;
        updateHealthHud(this);

        if (this.health <= 0) {
            console.log('Morto');
        }
    }

    collectSpheres() {
        this.spheres++;
        updateSphereHud(this);
    }
}
