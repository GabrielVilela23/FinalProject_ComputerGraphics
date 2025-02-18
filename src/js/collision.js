export function checkCollision(box1, box2) {
    return box1.intersectsBox(box2);
}

export function checkCollisions(scene) {
    const models = scene.children.filter(
        (child) => child.isObject3D && child.userData.boundingBox && child.name !== 'dragon'
    );
    const dragon = scene.children.filter((child) => child.name === 'dragon');
    if(!dragon[0]) return;
    const boxDragon = dragon[0].userData.boundingBox;
    
    for (let i = 0; i < models.length; i++) {
        const box = models[i].userData.boundingBox;

        if (boxDragon.intersectsBox(box)) {
            if (models[i].name !== 'scenario') {
                if (models[i].name === 'collectible') {
                    window.player.collectSpheres();
                } else {
                    window.player.takeDamage(1);
                }

                scene.remove(models[i]);
                if (models[i].userData.boxHelper) {
                    scene.remove(models[i].userData.boxHelper);
                    delete models[i].userData.boxHelper;
                }
                models.splice(i, 1);
                i--;
            }
        }
    }
}
