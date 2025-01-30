// script.js

const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Utility function to get a random number within a range
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Flower Types
// Flower Types
const flowerTypes = [
    {
      name: 'RedFlower',
      petalColor: 'red',
      centerColor: 'yellow',
      petalCount: 6,
      maxPetals: 6,
      size: 20,
      maxStemHeight: 150,
      bloomRate: 0.003,
      swayAmplitude: 3, // degrees
      layer: 'foreground', // Determines drawing order
    },
    {
      name: 'BlueFlower',
      petalColor: 'blue',
      centerColor: 'white',
      petalCount: 5,
      maxPetals: 5,
      size: 18,
      maxStemHeight: 130,
      bloomRate: 0.0025,
      swayAmplitude: 2.5,
      layer: 'foreground',
    },
    {
      name: 'PinkFlower',
      petalColor: 'pink',
      centerColor: 'orange',
      petalCount: 7,
      maxPetals: 7,
      size: 22,
      maxStemHeight: 160,
      bloomRate: 0.0028,
      swayAmplitude: 3.2,
      layer: 'foreground',
    },
    {
      name: 'Sunflower',
      petalColor: 'goldenrod',
      centerColor: 'brown',
      petalCount: 20,
      maxPetals: 20,
      size: 35,
      maxStemHeight: 200,
      bloomRate: 0.002,
      swayAmplitude: 4, // More sway for larger flowers
      layer: 'background', // Placed behind foreground flowers
    },
    {
      name: 'Lily',
      petalColor: 'white',
      centerColor: 'yellow',
      petalCount: 6,
      maxPetals: 6,
      size: 25,
      maxStemHeight: 170,
      bloomRate: 0.0023,
      swayAmplitude: 2.8,
      layer: 'foreground',
    },
    {
      name: 'Daisy',
      petalColor: 'white',
      centerColor: 'yellow',
      petalCount: 8,
      maxPetals: 8,
      size: 19,
      maxStemHeight: 140,
      bloomRate: 0.0021,
      swayAmplitude: 2.6,
      layer: 'foreground',
    },
    // Add more flower types as desired
  ];
  
  // Add more flower types as desired


// Flower Class
class Flower {
  constructor(x, groundY) {
    this.groundY = groundY; // Y position of the ground
    this.x = x;
    this.y = this.groundY;
    this.stemHeight = 0;
    this.maxStemHeight = getRandom(50, 150);
    this.stemGrowthRate = getRandom(0.5, 1.5);
    this.bloomed = false;
    this.bloomProgress = 0; // 0 to 1
    this.bloomRate = getRandom(0.001, 0.003);

    // Sway parameters
    this.swayAngle = 0;
    this.swaySpeed = getRandom(0.002, 0.005);
    this.swayAmplitude = getRandom(2, 5); // degrees

    // Select a random flower type for variation
    const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
    this.petalColor = type.petalColor;
    this.centerColor = type.centerColor;
    this.petalCount = type.petalCount;
    this.maxPetals = type.maxPetals;
    this.size = type.size;
  }

  growStem() {
    if (this.stemHeight < this.maxStemHeight) {
      this.stemHeight += this.stemGrowthRate;
    } else {
      this.bloomed = true;
    }
  }

  bloom() {
    if (this.bloomProgress < 1) {
      this.bloomProgress += this.bloomRate;
    }
  }

  sway() {
    this.swayAngle = this.swayAmplitude * Math.sin(Date.now() * this.swaySpeed);
  }

  drawStem() {
    ctx.save();
    ctx.translate(this.x, this.groundY);
    ctx.rotate((this.swayAngle * Math.PI) / 180);
    ctx.strokeStyle = '#228B22'; // Forest green
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.stemHeight);
    ctx.stroke();
    ctx.restore();
  }

  drawFlower() {
    ctx.save();
    ctx.translate(this.x, this.groundY - this.stemHeight);
    ctx.rotate((this.swayAngle * Math.PI) / 180);

    // Draw petals
    ctx.fillStyle = this.petalColor;
    for (let i = 0; i < this.petalCount * this.bloomProgress; i++) {
      const angle = (i / this.maxPetals) * Math.PI * 2;
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, this.size, this.size / 2, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate(-angle);
    }

    // Draw center
    ctx.fillStyle = this.centerColor;
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2 * this.bloomProgress, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  update() {
    this.growStem();
    if (this.bloomed) {
      this.bloom();
    }
    this.sway();
  }

  draw() {
    this.drawStem();
    if (this.bloomed) {
      this.drawFlower();
    }
  }
}

// Generate random flowers
const flowers = [];
const numberOfFlowers = 50;

// Define ground level
const groundY = canvas.height * 0.75;

// Generate flowers positioned on the ground
for (let i = 0; i < numberOfFlowers; i++) {
  const x = getRandom(50, canvas.width - 50);
  flowers.push(new Flower(x, groundY));
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw sky
  ctx.fillStyle = '#87ceeb'; // Sky blue
  ctx.fillRect(0, 0, canvas.width, groundY);

  // Draw ground
  ctx.fillStyle = '#228B22'; // Forest green
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  // Update and draw flowers
  flowers.forEach(flower => {
    flower.update();
    flower.draw();
  });

  requestAnimationFrame(animate);
}

animate();
