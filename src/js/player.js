import { createHud, healthHud as updateHealthHud } from './hud.js';

class objPlayer {
    constructor() {
        this.health = 5;
        this.spheres = 0;
    }

    takeDamage(damage) {
        this.health -= damage;
        updateHealthHud(this);

        if (this.health <= 0) {
            this.die();
        }
    }

    collectSpheres() {
        this.spheres++;
    }
}

window.player = new objPlayer();
createHud(window.player);
