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

export function createHud(player) {
   healthHud(player);
}

if (prod) {
    document.addEventListener('keydown', function (event) {
        if (event.key === ' ' || event.code === 'Space') {
            window.player.takeDamage(1);
        }
    });
}
