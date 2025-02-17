export function checkCollision(box1, box2) {
    return box1.intersectsBox(box2);
}

export function checkCollisions(scene) {
    const models = scene.children.filter(child => child.isObject3D && child.userData.boundingBox);
    
    for (let i = 0; i < models.length; i++) {
        for (let j = i + 1; j < models.length; j++) {
            const box1 = models[i].userData.boundingBox;
            const box2 = models[j].userData.boundingBox;

            if (box1 && box2 && box1.intersectsBox(box2)) {
                if (models[i].name === 'collectible' || models[j].name === 'collectible'){
                    window.player.collectSpheres();
                }
                else if (models[i].name === 'oreo' || models[j].name === 'oreo') {
                    window.player.takeDamage(1);
                }

                if (models[i].name !== 'dragon' && models[i].name !== 'scenario') {
                    scene.remove(models[i]);
                    if (models[i].userData.boxHelper) {
                        scene.remove(models[i].userData.boxHelper);
                        delete models[i].userData.boxHelper;
                    }
                    models.splice(i, 1);
                    i--;
                    break;
                } 
                else if (models[j].name !== 'dragon') {
                    scene.remove(models[j]);
                    if (models[j].userData.boxHelper) {
                        scene.remove(models[j].userData.boxHelper);
                        delete models[j].userData.boxHelper;
                    }
                    models.splice(j, 1);
                    j--;
                }
            }
        }
    }
}
