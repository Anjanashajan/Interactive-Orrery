// Setup canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

// Spaceship object
const spaceship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 200,
    speed: 5,
    dx: 0,
    dy: 0,
    img: new Image(),
};

spaceship.img.src = 'images/spaceship.png';  // Replace with your spaceship image

// Planet objects
const planets = [
    { x: 200, y: 150, size: 100, imgSrc: 'images/mercury.png', name: 'Mercury', info: 'Closest planet to the Sun.' },
    { x: 400, y: 200, size: 90, imgSrc: 'images/venus.png', name: 'Venus', info: 'Known for its thick, toxic atmosphere.' },
    { x: 600, y: 150, size: 90, imgSrc: 'images/earth.png', name: 'Earth', info: 'Our home planet.' },
    { x: 800, y: 300, size: 80, imgSrc: 'images/mars.png', name: 'Mars', info: 'The red planet.' },
    { x: 1000, y: 250, size: 120, imgSrc: 'images/jupiter.png', name: 'Jupiter', info: 'The largest planet in the solar system.' },
    { x: 1200, y: 350, size: 100, imgSrc: 'images/saturn.png', name: 'Saturn', info: 'Known for its stunning rings.' },
    { x: 300, y: 300, size: 90, imgSrc: 'images/uranus.png', name: 'Uranus', info: 'An ice giant with a unique tilt.' },
    { x: 100, y: 250, size: 90, imgSrc: 'images/neptune.png', name: 'Neptune', info: 'The farthest planet from the Sun.' }
];

let planetImages = [];
planets.forEach(planet => {
    const img = new Image();
    img.src = planet.imgSrc;
    planetImages.push(img);
});

// Game state
let score = 0;
let planetInfo = 'Explore planets to learn more!';

// Event listeners for keyboard input
document.addEventListener('keydown', moveShip);
document.addEventListener('keyup', stopShip);

// Move the spaceship
function moveShip(e) {
    if (e.key === 'ArrowUp' || e.key === 'w') {
        spaceship.dy = -spaceship.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        spaceship.dy = spaceship.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        spaceship.dx = -spaceship.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        spaceship.dx = spaceship.speed;
    }
}

// Stop the spaceship
function stopShip(e) {
    if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) {
        spaceship.dy = 0;
    } else if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
        spaceship.dx = 0;
    }
}

// Draw the spaceship
function drawSpaceship() {
    ctx.drawImage(spaceship.img, spaceship.x, spaceship.y, spaceship.size, spaceship.size);
}

// Draw the planets
function drawPlanets() {
    planets.forEach((planet, index) => {
        ctx.drawImage(planetImages[index], planet.x, planet.y, planet.size, planet.size);
    });
}

// Update spaceship position
function updatePosition() {
    spaceship.x += spaceship.dx;
    spaceship.y += spaceship.dy;

    // Prevent going out of bounds
    if (spaceship.x < 0) spaceship.x = 0;
    if (spaceship.y < 0) spaceship.y = 0;
    if (spaceship.x + spaceship.size > canvas.width) spaceship.x = canvas.width - spaceship.size;
    if (spaceship.y + spaceship.size > canvas.height) spaceship.y = canvas.height - spaceship.size;
}

// Check for collisions with planets
function checkCollisions() {
    planets.forEach(planet => {
        const dist = Math.hypot(spaceship.x - planet.x, spaceship.y - planet.y);
        if (dist - planet.size - spaceship.size < 1) {
            score++;
            planetInfo = `${planet.name}: ${planet.info}`;
            document.getElementById('score').textContent = score;
        }
    });
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw planets and spaceship
    drawPlanets();
    drawSpaceship();

    // Check for collisions
    checkCollisions();

    // Update planet info
   
    document.getElementById('planetInfo').textContent = planetInfo;
    // Update spaceship position
    updatePosition();

    requestAnimationFrame(draw);
}

// Start the game
draw();
