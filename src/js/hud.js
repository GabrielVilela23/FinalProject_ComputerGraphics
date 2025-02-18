import heartURL from '../img/heart.png';
import lavaLampEmptyURL from '../img/lampada-de-lava-vazio.png'
import lavaLampFullURL from '../img/lampada-de-lava-full.png'

export function healthHud(player) {
    const healthBar = document.getElementById('health-hud');
    healthBar.innerHTML = '';

    for (let index = 0; index < player.health; index++) {
        let imgElement = document.createElement('img');
        imgElement.src = heartURL;

        healthBar.appendChild(imgElement);
    }
}

export function removeHealthHud() {
    const healthBar = document.getElementById('health-hud');
    healthBar.innerHTML = '';
}

export function removeLavaLampsHud() {
    const lavaLampHud= document.getElementById('lava-lamp-hud');
    lavaLampHud.innerHTML = '';
}

export function removeControlsHud() {
    const controls = document.getElementById('controls-hud');
    controls.style.display = 'none';
}

export function lavaLampsHud(player) {
    const lavaLamp = document.getElementById('lava-lamp-hud');
    lavaLamp.innerHTML = '';
    let index;
    for (index = 0; index < player.lavaLamps; index++) {
        let imgElement = document.createElement('img');
        imgElement.src = lavaLampFullURL;

        lavaLamp.appendChild(imgElement);
    }

    for(index; index < 5; index++) {
        let imgElement = document.createElement('img');
        imgElement.src = lavaLampEmptyURL;

        lavaLamp.appendChild(imgElement);
    }
}

export function controlsHud() {
    const controlsElement = document.createElement('div');
    controlsElement.innerHTML = `
        <p>Esquerda - A</p>
        <p>Direita - D</p>
        <p>Camera - R</p>
        <p>Luz 1 - 1</p>
        <p>Luz 2 - 2</p>
    `;

    const controlsHud = document.getElementById('controls-hud');
    controlsHud.style.display = 'flex';
    controlsHud.innerHTML = '';
    controlsHud.appendChild(controlsElement);
}

export function createHud(player) {
    healthHud(player);
    lavaLampsHud(player);
    controlsHud();
}

export function removeHud() {
    removeHealthHud();
    removeLavaLampsHud();
    removeControlsHud();
}
