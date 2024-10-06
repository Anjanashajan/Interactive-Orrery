// Setup Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#orrery'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Adding the Sun
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets and Orbits
const planets = [];
const planetData = [
    { name: 'Mercury', color: 0xbebebe, distance: 5 },
    { name: 'Venus', color: 0xf5c542, distance: 7 },
    { name: 'Earth', color: 0x4287f5, distance: 10 },
    { name: 'Mars', color: 0xff0000, distance: 12 },
    // Add more planets if needed
];

// Creating planets and their orbits
planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.distance;
    planet.name = data.name;
    scene.add(planet);
    planets.push(planet);
});

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate planets around the sun
    planets.forEach((planet, index) => {
        planet.position.x = planetData[index].distance * Math.cos(Date.now() * 0.0005);
        planet.position.z = planetData[index].distance * Math.sin(Date.now() * 0.0005);
    });

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Chat interaction
const chatMessages = {
    hello: "Hello! Ask me about space or click on a planet!",
    planets: "We have 8 planets. Try clicking on one to explore!",
    earth: "Earth is the third planet from the Sun, and it's the only known planet to support life!"
};

function handleUserInput(event) {
    if (event.key === 'Enter') {
        const userInput = event.target.value.toLowerCase();
        event.target.value = ''; // Clear input field

        if (chatMessages[userInput]) {
            displayMessage(chatMessages[userInput]);
        } else {
            displayMessage("I don't have that info yet. Try clicking on a planet!");
        }
    }
}

function displayMessage(message) {
    document.querySelector('#message').textContent = message;
}

// Control Panel Functions
function toggleOrbits() {
    // Logic to show/hide orbits
}

function toggleLabels() {
    // Logic to show/hide planet labels
}

function adjustSpeed(speed) {
    // Logic to adjust the orbital speed of planets
}

function switchView() {
    // Logic to switch to fly-through mode
}
