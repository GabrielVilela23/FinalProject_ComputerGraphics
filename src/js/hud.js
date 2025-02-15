import heartURL from '../img/heart.png';
const prod = true;

export function healthHud(player) {
    const healthBar = document.getElementById('health-hud');
    healthBar.innerHTML = '';

    for (let index = 0; index < player.health; index++) {
        let imgElement = document.createElement('img');
        imgElement.src = heartURL;

        healthBar.appendChild(imgElement);
    }
}

export function sphereHud(player) {
    const pElement = document.createElement('p');
    pElement.innerHTML = 'Esferas: ' + (player.spheres).toString().padStart(2, '0');
    
    const spheresCounter = document.getElementById('spheres-hud');
    spheresCounter.innerHTML = '';
    spheresCounter.appendChild(pElement);
}

export function createHud(player) {
   healthHud(player);
   sphereHud(player);
}

if (prod) {
    document.addEventListener('keydown', function (event) {
        if (event.key === ' ' || event.code === 'Space') {
            // window.player.takeDamage(1);
            window.player.collectSpheres();
        }
    });
}
