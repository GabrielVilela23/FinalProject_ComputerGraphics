
export class Dragon{
    constructor(){
        this.json;
        this.buffers;
    }
    static async CreateDragon(url){
        const dragon = new Dragon();
        const glb = await loadGLB(url);
        //const gltf = parseGLB(glb);
        //dragon.json = gltf.json;
        //dragon.buffers = gltf.buffers;
        return dragon;
            }
    

}
async function loadGLB(url){
        const response = await fetch(url);
        console.log("Carregado arquivo glb do dragao", response);
        const glb = await response.arrayBuffer();
        console.log("Configurado buffer do arquivo glb para permitir acessar os bytes diretamente", glb);
        return glb;
    }
async function parseGLB(glb){
    //try{
        //const gltf = await processGltf(glb, { separate: true }); 
        //console.log("gltf json:", gltf.json);
        //console.log("gltf buffer:", gltf.buffers);
        //return gltf;
    //}catch(error){console.error("Esse erro aqui:", error)};
}
   
