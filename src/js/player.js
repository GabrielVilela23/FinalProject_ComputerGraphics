import { healthHud as updateHealthHud, lavaLampsHud as updateLavaLampHud } from './hud.js';

export class objPlayer {
    constructor() {
        this.health = 5;
        this.lavaLamps = 0;
    }

    takeDamage(damage = 1) {
        this.health -= damage;
        updateHealthHud(this);

        if (this.health <= 0) {
            console.log('Morto');
        }
    }

    collectLavaLamps(point = 1) {
        this.lavaLamps += point;
        updateLavaLampHud(this);
    }
}
