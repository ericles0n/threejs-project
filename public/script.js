// Configuração básica do Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas") });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita (movimentação com o mouse)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

// Criando um cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Luz ambiente para iluminação uniforme
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Luz direcional para simular uma fonte de luz natural
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Criando plano cartesiano (não afetado pela luz)
const gridHelper = new THREE.GridHelper(10, 10, 0xffffff, 0x444444);
scene.add(gridHelper);

// Criando eixos X, Y, Z
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Definição de limites para movimentação
const limits = {
    x: { min: -5, max: 5 },
    y: { min: 0, max: 5 },
    z: { min: -5, max: 5 }
};

// Elementos do menu
const colorPicker = document.getElementById("color-picker");
const lightIntensity = document.getElementById("light-intensity");
const bgColor = document.getElementById("bg-color");
const posX = document.getElementById("pos-x");
const posY = document.getElementById("pos-y");
const posZ = document.getElementById("pos-z");

// Configuração inicial
let config = {
    color: "#44aa88",
    lightIntensity: 1,
    backgroundColor: "#121212",
    position: { x: 0, y: 0, z: 0 }
};

// Carregar configurações salvas
function loadConfig() {
    const savedConfig = localStorage.getItem("cubeConfig");
    if (savedConfig) {
        config = JSON.parse(savedConfig);
        cube.material.color.set(config.color);
        directionalLight.intensity = config.lightIntensity;
        scene.background = new THREE.Color(config.backgroundColor);
        cube.position.set(config.position.x, config.position.y, config.position.z);

        colorPicker.value = config.color;
        lightIntensity.value = config.lightIntensity;
        posX.value = config.position.x;
        posY.value = config.position.y;
        posZ.value = config.position.z;
    }
}

// Salvar configurações automaticamente
function saveConfig() {
    localStorage.setItem("cubeConfig", JSON.stringify(config));
}

// Eventos para modificar configurações
colorPicker.addEventListener("input", (event) => {
    config.color = event.target.value;
    cube.material.color.set(config.color);
    saveConfig();
});

lightIntensity.addEventListener("input", (event) => {
    config.lightIntensity = parseFloat(event.target.value);
    directionalLight.intensity = config.lightIntensity;
    saveConfig();
});

bgColor.addEventListener("input", (event) => {
    const gray = parseInt(event.target.value);
    config.backgroundColor = `rgb(${gray}, ${gray}, ${gray})`;
    scene.background = new THREE.Color(config.backgroundColor);
    saveConfig();
});

// Atualizando posição com limites
[posX, posY, posZ].forEach((input, index) => {
    input.addEventListener("input", () => {
        let value = parseFloat(input.value);
        let axis = index === 0 ? "x" : index === 1 ? "y" : "z";
        value = Math.max(limits[axis].min, Math.min(limits[axis].max, value));

        config.position[axis] = value;
        cube.position[axis] = value;
        saveConfig();
    });
});

// Controle de movimentação com o teclado
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            cube.position.z -= 0.2;
            break;
        case "ArrowDown":
            cube.position.z += 0.2;
            break;
        case "ArrowLeft":
            cube.position.x -= 0.2;
            break;
        case "ArrowRight":
            cube.position.x += 0.2;
            break;
        case "+": // Zoom in
            camera.position.z -= 0.5;
            break;
        case "-": // Zoom out
            camera.position.z += 0.5;
            break;
    }

    // Aplicar limites para o cubo
    cube.position.x = Math.max(limits.x.min, Math.min(limits.x.max, cube.position.x));
    cube.position.y = Math.max(limits.y.min, Math.min(limits.y.max, cube.position.y));
    cube.position.z = Math.max(limits.z.min, Math.min(limits.z.max, cube.position.z));
});

// Controle de rotação do cubo com o teclado numérico (8, 4, 5, 6)
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "8": // Rotacionar para frente (eixo X)
            cube.rotation.x -= 0.1;
            break;
        case "5": // Rotacionar para trás (eixo X)
            cube.rotation.x += 0.1;
            break;
        case "4": // Rotacionar para esquerda (eixo Y)
            cube.rotation.y -= 0.1;
            break;
        case "6": // Rotacionar para direita (eixo Y)
            cube.rotation.y += 0.1;
            break;
    }
});

// Elementos do menu para rotação
const rotateCubeX = document.getElementById("rotate-cube-x");
const rotateCubeY = document.getElementById("rotate-cube-y");
const rotateCameraTheta = document.getElementById("rotate-camera-theta");
const rotateCameraPhi = document.getElementById("rotate-camera-phi");

// Atualiza a rotação do cubo pelo menu
rotateCubeX.addEventListener("input", () => {
    cube.rotation.x = THREE.MathUtils.degToRad(parseFloat(rotateCubeX.value));
});
rotateCubeY.addEventListener("input", () => {
    cube.rotation.y = THREE.MathUtils.degToRad(parseFloat(rotateCubeY.value));
});

// Atualiza a rotação da câmera pelo menu
rotateCameraTheta.addEventListener("input", () => {
    cameraAngle.theta = parseFloat(rotateCameraTheta.value);
    updateCameraPosition();
});
rotateCameraPhi.addEventListener("input", () => {
    cameraAngle.phi = parseFloat(rotateCameraPhi.value);
    updateCameraPosition();
});

// Atualiza a posição da câmera ao redor do cubo
function updateCameraPosition() {
    const radius = 5; // Distância da câmera até o cubo
    const thetaRad = THREE.MathUtils.degToRad(cameraAngle.theta);
    const phiRad = THREE.MathUtils.degToRad(cameraAngle.phi);

    camera.position.x = radius * Math.sin(phiRad) * Math.cos(thetaRad);
    camera.position.y = radius * Math.cos(phiRad);
    camera.position.z = radius * Math.sin(phiRad) * Math.sin(thetaRad);

    camera.lookAt(cube.position); // Mantém a câmera sempre olhando para o cubo
    controls.update();
}

// Variáveis de rotação da câmera
let cameraAngle = { theta: 0, phi: 75 }; // Ângulos esféricos (graus)
const rotationSpeed = 3; // Velocidade de rotação

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "a": // Rotacionar para esquerda
        case "A":
            cameraAngle.theta -= rotationSpeed;
            break;
        case "d": // Rotacionar para direita
        case "D":
            cameraAngle.theta += rotationSpeed;
            break;
        case "w": // Subir a câmera
        case "W":
            cameraAngle.phi = Math.max(20, cameraAngle.phi - rotationSpeed);
            break;
        case "s": // Descer a câmera
        case "S":
            cameraAngle.phi = Math.min(160, cameraAngle.phi + rotationSpeed);
            break;
    }

    updateCameraPosition();
});

// Atualiza a posição da câmera ao redor do cubo
function updateCameraPosition() {
    const radius = 5; // Distância da câmera até o cubo
    const thetaRad = THREE.MathUtils.degToRad(cameraAngle.theta);
    const phiRad = THREE.MathUtils.degToRad(cameraAngle.phi);

    camera.position.x = radius * Math.sin(phiRad) * Math.cos(thetaRad);
    camera.position.y = radius * Math.cos(phiRad);
    camera.position.z = radius * Math.sin(phiRad) * Math.sin(thetaRad);

    camera.lookAt(cube.position); // Mantém a câmera sempre olhando para o cubo
    controls.update();
}

// Posição inicial da câmera
camera.position.set(0, 2, 5);
controls.update();

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Carregar configurações e iniciar animação
loadConfig();
animate();

// Comunicação com JSON Server (ajuste conforme necessário)
fetch("http://localhost:3000/configuracoes", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config)
});

fetch("http://localhost:3000/configuracoes")
    .then(res => res.json())
    .then(data => console.log(data));
