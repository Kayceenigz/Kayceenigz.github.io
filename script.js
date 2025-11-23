// Particle System for Interactive Background
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = 720;
    this.colors = ['#7dd3fc', '#a78bfa', '#f472b6'];
    
    this.init();
    this.animate();
    this.setupEventListeners();
  }
  
  init() {
    this.resizeCanvas();
    this.createParticles();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = particle.color;
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
  
  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.particles[i].color;
          this.ctx.globalAlpha = (1 - distance / 120) * 0.2;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      }
    }
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.vx -= Math.cos(angle) * force * 0.2;
          particle.vy -= Math.sin(angle) * force * 0.2;
        }
      }
      
      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      }
      
      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Keep minimum velocity
      if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.1;
      if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.1;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.connectParticles();
    
    this.particles.forEach(particle => this.drawParticle(particle));
    
    requestAnimationFrame(() => this.animate());
  }
}

// Projects Data
const projects = [
  {
    id: '1',
    title: 'Into the Dead - Remake',
    description: 'Highly inspired by the game, Into the Dead, this is my take on trying to remake it for practice.',
    videoUrl: 'Gameplay/Into the Dead - Remake Gameplay.mp4',
    platform: 'PC',
    genre: 'Action, Survival',
    releaseDate: '2021',
    features: ['Single Player', 'Procedural Generation', 'Endless Mode'],
    imageUrl: 'Gameplay/Into the Dead.jpg'
  },
  {
    id: '2',
    title: 'Do You Suck?',
    description: 'A 2D parkour platformer to challenge you to reaching an end goal, similar to Happy Wheels.',
    videoUrl: 'Gameplay/Do You Suck Gameplay.mp4',
    platform: 'PC',
    genre: 'Platformer, 2D',
    releaseDate: '2021',
    features: ['Platformer', '2D Game', 'Level Based', 'Rage Game'],
    imageUrl: 'Gameplay/Do You Suck Gameplay.jpg'
  },
  {
    id: '3',
    title: 'Maze Runner',
    description: 'This game was made with one thing in mind, how do we keep the player involved. To increase playtime, I made complicated mazes that vary in size. The player can begin with the easy maze and then work their way through the harder mazes. The player has to finish the maze as fast as they can and compete with friends.',
    videoUrl: 'Gameplay/Maze Runner Gameplay.mp4',
    platform: 'PC',
    genre: '3D Game, Puzzle',
    releaseDate: '2024',
    features: ['Time Trial', 'Social Game', 'Competitive', '3D Maze'],
    imageUrl: 'Gameplay/Maze Runner Gameplay.jpg'
  },
  {
    id: '4',
    title: 'Marathon Runner',
    description: 'This was a project that I wanted to make to try and remake the feel of Subway Surfers. But instead of just making a simple remake, I added an adition mechanic of needing to refuel, or in this case, rehydrate. Using the script I had earlier written for Into the Dead - Remake, with some changes, this game adds a new depth by having the player keep an eye out on the hydration level and keep an eye out for bottles to rehydrate.',
    videoUrl: 'Gameplay/Marathon Runner.jpg',
    platform: 'PC',
    genre: 'Endless Runner, 3D',
    releaseDate: '2022',
    features: ['Endless Runner', 'Competitive', 'Procedural Generation'],
    imageUrl: 'Gameplay/Marathon Runner.jpg'
  },
  {
    id: '5',
    title: 'HIDE',
    description: 'A Project heavily insipired by Sqube Darkness to make a game where the player has to use a core hiding ability. ',
    videoUrl: 'Gameplay/HIDE Gameplay.mp4',
    platform: 'PC',
    genre: 'Story Based, 2D Platformer',
    releaseDate: '2023',
    features: ['Narrative', 'Emotional', 'Stealth Mechanics'],
    imageUrl: 'Gameplay/HIDE_Gameplay.jpg'
  },
  {
    id: '6',
    title: 'Bubble UP',
    description: 'This level-based hypercasual game was centered around simple, intuitive gameplay—guiding a bubble upward while swiping to dodge fish and obstacles. The core challenge was making the controls feel smooth and responsive, especially as the bubble moved continuously toward the surface. Balancing level difficulty and obstacle placement was key to keeping players engaged without overwhelming them. The goal was to create a relaxing yet satisfying experience that encouraged quick retries and steady progress.',
    videoUrl: 'Gameplay/Bubble UP Gameplay.mp4',
    platform: 'PC',
    genre: 'Level Based, Hypercasual',
    releaseDate: '2024',
    features: ['2D Game', 'Built in 48 Hours', 'Level Based', 'Hypercasual'],
    imageUrl: 'Gameplay/Bubble UP.jpg'
  },
  {
    id: '7',
    title: 'Fire Propagation (Mechanic Demo)',
    description: 'This fire propagation mechanic was developed as part of a research project focused on simulating realistic fire behavior in games. The system allowed players to set fires, with wind speed and direction, terrain moisture, and flammability all influencing how the fire spread. The goal was to explore how environmental variables could dynamically affect gameplay and visual outcomes. One of the main challenges was balancing realism with performance, especially when simulating fire across large or varied terrains. It required careful tuning of parameters and optimization to ensure consistent and believable fire behavior without sacrificing game fluidity.',
    videoUrl: 'Gameplay/Fire Propagation Gameplay.mp4',
    platform: 'PC',
    genre: 'Research, Mechanic',
    releaseDate: '2022',
    features: ['Cell Based Fire Propagation', 'Thesis', 'Environmental Interactions'],
    imageUrl: 'Gameplay/Fire Propagation Gameplay.jpg'
  },
  {
    id: '8',
    title: 'VR Golf',
    description: 'This VR Golf game was designed with three unique courses where players aim to complete each with as few ball hits as possible. The core gameplay focused on providing an immersive and skill-based experience in virtual reality. One of the key challenges was achieving accurate and responsive ball physics. Getting the ball to behave realistically based on swing strength and angle took extensive tweaking and testing to ensure a satisfying and believable golfing experience.',
    videoUrl: 'Gameplay/VR Golf Gameplay.mp4',
    platform: 'PC',
    genre: 'VR Game, Sports',
    releaseDate: '2023',
    features: ['Immersive VR', 'Skill-Based', 'Realistic Physics'],
    imageUrl: 'Gameplay/VR Golf Gameplay.jpg'
  },
  {
    id: '9',
    title: 'Orbit Defenders',
    description: 'A submission for the BYOG Game Jam 2025. Staying true to the theme, I decided to Rethink, Remix and Remake Space Invaders X Asteroid Destroyer, but with a roguelite twist. The player has to shoot at and prevent falling asteroids from hitting the earth by orbiting around it. The player, manning a spaceship then collects material that is dropped from these asteroids to fill a progress bar after which they need to choose from a variety of perks.',
    videoUrl: 'Gameplay/Orbit Defenders Gameplay.mp4',
    platform: 'PC',
    genre: 'Roguelite, Procedural Generation',
    releaseDate: '2025',
    features: ['Endless Game', 'Skill-Based', 'Roguelite Elements', 'Game Jam Project'],
    imageUrl: 'Gameplay/Orbit Defenders.jpg'
  },
];

// Load Projects
function loadProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  
  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.dataset.testid = `project-card-${project.id}`;
    projectCard.onclick = () => openModal(project);
    
    projectCard.innerHTML = `
      <div class="project-image-container">
        <img 
          src="${project.imageUrl}" 
          alt="${project.title}"
          class="project-image"
          data-testid="project-image-${project.id}"
        />
        <div class="project-overlay">
          <i class="fas fa-play-circle play-icon"></i>
        </div>
      </div>
      <div class="project-header">
        <div class="project-title-row">
          <h3 class="project-title" data-testid="project-title-${project.id}">${project.title}</h3>
          <span class="badge" data-testid="project-genre-${project.id}">${project.genre}</span>
        </div>
        <p class="project-description" data-testid="project-description-${project.id}">${project.description}</p>
      </div>
      <div class="project-content">
        <div class="project-meta">
          <div class="meta-item" data-testid="project-platform-${project.id}">
            <span class="meta-label">Platform:</span>
            <span class="meta-value">${project.platform}</span>
          </div>
          <div class="meta-item" data-testid="project-release-${project.id}">
            <span class="meta-label">Release:</span>
            <span class="meta-value">${project.releaseDate}</span>
          </div>
        </div>
        <div class="project-features" data-testid="project-features-${project.id}">
          ${project.features.map(feature => `<span class="badge">${feature}</span>`).join('')}
        </div>
      </div>
    `;
    
    projectsGrid.appendChild(projectCard);
  });
}

// Modal Functions
function openModal(project) {
  const modal = document.getElementById('video-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalGenre = document.getElementById('modal-genre');
  const modalVideo = document.getElementById('modal-video');
  const modalDescription = document.getElementById('modal-description');
  const modalPlatform = document.getElementById('modal-platform');
  const modalGenreFull = document.getElementById('modal-genre-full');
  const modalRelease = document.getElementById('modal-release');
  const modalFeatures = document.getElementById('modal-features');
  
  modalTitle.textContent = project.title;
  modalGenre.textContent = project.genre;
  modalVideo.src = project.videoUrl;
  modalDescription.textContent = project.description;
  modalPlatform.textContent = project.platform;
  modalGenreFull.textContent = project.genre;
  modalRelease.textContent = project.releaseDate;
  
  modalFeatures.innerHTML = project.features
    .map(feature => `<span class="badge">${feature}</span>`)
    .join('');
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('video-modal');
  const modalVideo = document.getElementById('modal-video');
  
  modal.classList.remove('active');
  modalVideo.src = '';
  document.body.style.overflow = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle system
  new ParticleSystem();
  
  // Load projects
  loadProjects();
  
  // Modal close handlers
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('video-modal').addEventListener('click', (e) => {
    if (e.target.id === 'video-modal') {
      closeModal();
    }
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Add active state to nav links on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
});