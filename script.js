// API Key and NASA NEO API URL
const API_KEY = 'cD7Bw4bHSjy5mpua7ClZXUuUdSnbCS8PDdymhf2a';  // Replace with your NASA API key
const NEO_API_URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-10-01&end_date=2024-10-02&api_key=${API_KEY}`;

// Scene, camera, renderer
let scene, camera, renderer, labelRenderer;
let planets = [], orbits = [], labels = [], neoMarkers = [];
let showLabels = true, showOrbits = true, speedMultiplier = 1;

// Initialize the scene
function init() {
    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;

    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Create the CSS2DRenderer for labels
    labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    document.getElementById('scene-container').appendChild(labelRenderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Planets and orbits (with elliptical orbits)
    createPlanet(5, 'images/sun.png', 0, 0, 'Sun'); // Sun doesn't move
    addOrbit(30, 15, 0xffe0bd); createPlanet(2, 'images/mercury.png', 20, 15, 'Mercury');
    addOrbit(40, 25, 0xffdb58); createPlanet(3, 'images/venus.png', 30, 25, 'Venus');
    addOrbit(50, 30, 0x1e90ff); createPlanet(4, 'images/earth.png', 40, 30, 'Earth');
    addOrbit(60, 35, 0xff4500); createPlanet(3.5, 'images/mars.png', 50, 35, 'Mars');
    addOrbit(80, 50, 0xffd700); createPlanet(6, 'images/jupiter.png', 70, 50, 'Jupiter');
    addOrbit(110, 60, 0xffffe0); createPlanet(5.5, 'images/saturn.png', 90, 60, 'Saturn');
    addOrbit(130, 80, 0x87cefa); createPlanet(4.5, 'images/uranus.png', 110, 80, 'Uranus');
    addOrbit(150, 90, 0x4682b4); createPlanet(4, 'images/neptune.png', 130, 90, 'Neptune');

    // Fetch NEO Data
    fetchNEOData();

    // Event Listeners for Controls
    document.getElementById('toggleLabels').addEventListener('click', toggleLabels);
    document.getElementById('toggleOrbits').addEventListener('click', toggleOrbits);
    document.getElementById('zoomIn').addEventListener('click', () => zoom(1.2));
    document.getElementById('zoomOut').addEventListener('click', () => zoom(0.8));
    document.getElementById('speedControl').addEventListener('input', (e) => setSpeed(e.target.value));

    // Start the animation loop
    animate();
}

// Function to create a planet with label
function createPlanet(size, textureUrl, orbitRadiusX, orbitRadiusZ, name) {
    const texture = new THREE.TextureLoader().load(textureUrl);
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    planet.orbitRadiusX = orbitRadiusX; // Semi-major axis
    planet.orbitRadiusZ = orbitRadiusZ; // Semi-minor axis
    planet.angle = Math.random() * Math.PI * 2;  // Random start angle

    // Label for the planet
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = name;
    labelDiv.style.color = 'white';
    const label = new THREE.CSS2DObject(labelDiv);
    label.position.set(0, size + 1, 0);  // Above the planet
    planet.add(label);

    planets.push(planet);
    labels.push(label);
    scene.add(planet);
}

// Add an elliptical orbit for planets
function addOrbit(radiusX, radiusZ, color) {
    const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, 0, 2 * Math.PI);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });
    const orbit = new THREE.LineLoop(geometry, material);

    orbits.push(orbit);
    scene.add(orbit);
}

// Fetch NEO data from NASA API
async function fetchNEOData() {
    try {
        const response = await fetch(NEO_API_URL);
        const data = await response.json();
        displayNEOs(data);
    } catch (error) {
        console.error("Error fetching NEO data:", error);
    }
}

// Display NEO data
function displayNEOs(data) {
    const neos = data.near_earth_objects["2024-10-01"];
    neos.forEach(neo => {
        const neoGeometry = new THREE.SphereGeometry(1, 32, 32);
        const neoMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const neoMarker = new THREE.Mesh(neoGeometry, neoMaterial);

        neoMarker.position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
        neoMarkers.push(neoMarker);
        scene.add(neoMarker);
    });
}

// Toggle planet labels
function toggleLabels() {
    showLabels = !showLabels;
    labels.forEach(label => label.element.style.display = showLabels ? 'block' : 'none');
}

// Toggle orbits visibility
function toggleOrbits() {
    showOrbits = !showOrbits;
    orbits.forEach(orbit => orbit.visible = showOrbits);
}

// Zoom the camera in or out
function zoom(factor) {
    camera.position.z *= factor;
}

// Set the animation speed multiplier
function setSpeed(speed) {
    speedMultiplier = speed;
}

// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Update planet positions
    planets.forEach(planet => {
        planet.angle += 0.01 * speedMultiplier;
        planet.position.set(
            planet.orbitRadiusX * Math.cos(planet.angle),
            0,
            planet.orbitRadiusZ * Math.sin(planet.angle)
        );
    });

    // Render the scene and labels
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// Start the app
init();
