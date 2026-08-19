/* ================================================================
   PORTFOLIO — Main Script
   ================================================================ */

// We now fetch data from the local data.json file
const DATA_URL = 'data.json';

/* ----------------------------------------------------------------
   CURSOR GLOW
   ---------------------------------------------------------------- */
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

/* ----------------------------------------------------------------
   SCROLL PROGRESS BAR
   ---------------------------------------------------------------- */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / docHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
}, { passive: true });

/* ----------------------------------------------------------------
   TYPEWRITER EFFECT
   ---------------------------------------------------------------- */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'Turning data into intelligence.',
    'Deep Learning & Computer Vision.',
    'Vision Transformers. RNNs. CNNs.',
    'Seeking junior ML & AI roles.',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    if (!typewriterEl) return;
    const current = phrases[phraseIndex];
    if (isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }
    let delay = isDeleting ? 40 : 65;
    if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
    }
    setTimeout(typeWriter, delay);
}
    setTimeout(() => typeWriter(), 900);

/* ----------------------------------------------------------------
   NAVBAR — scroll shrink + active section highlight
   ---------------------------------------------------------------- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    },
    { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ----------------------------------------------------------------
   MOBILE MENU
   ---------------------------------------------------------------- */
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

/* ----------------------------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
   ---------------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ----------------------------------------------------------------
   ANIMATED STAT COUNTERS
   ---------------------------------------------------------------- */
function animateCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach((counter) => {
        const target = +counter.dataset.target;
        const duration = 1200;
        const start = performance.now();
        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3; // ease-out cubic
            counter.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}

const aboutSection = document.getElementById('about');
if (aboutSection) {
    const counterObs = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                counterObs.unobserve(aboutSection);
            }
        },
        { threshold: 0.3 }
    );
    counterObs.observe(aboutSection);
}

/* ----------------------------------------------------------------
   DATA LOADING ENGINE
   ---------------------------------------------------------------- */
let portfolioData = null;

async function fetchPortfolioData() {
    if (!portfolioData) {
        try {
            const res = await fetch(DATA_URL);
            portfolioData = await res.json();
        } catch (err) {
            console.error('Failed to load portfolio data:', err);
            portfolioData = { techMarquee: [], projects: [], skills: {} };
        }
    }
    return portfolioData;
}

async function initPortfolio() {
    const data = await fetchPortfolioData();

    // 1. Load Marquee
    const track = document.getElementById('marquee-track');
    if (track && data.techMarquee) {
        const items = data.techMarquee.length > 0 ? data.techMarquee : ['Python', 'C++', 'JavaScript'];
        const buildItems = () =>
            items.map((t) => `<div class="marquee-item"><span class="marquee-dot"></span>${t}</div>`).join('');
        track.innerHTML = buildItems() + buildItems();
    }

    // 2. Load Projects
    const grid = document.getElementById('projects-grid');
    if (grid && data.projects) {
        const featured = data.projects.filter(p => p.featured);
        grid.innerHTML = '';
        
        if (featured.length === 0) {
            grid.innerHTML = '<p style="color:var(--fg-muted);">No featured projects found.</p>';
        } else {
            featured.forEach((p, i) => {
                const card = document.createElement('article');
                card.className = 'project-card reveal';
                card.style.transitionDelay = `${i * 0.1}s`;

                const [c1, c2] = p.gradient || ['#8b5cf6', '#6366f1'];
                const tags = (p.tech || []).map((t) => `<span class="project-tag">${t}</span>`).join('');

                card.innerHTML = `
                    <div class="project-inner">
                        <div class="project-gradient" style="background: linear-gradient(135deg, ${c1}, ${c2})"></div>
                        <div class="project-content">
                            <span class="project-number">0${i + 1}</span>
                            <span class="project-category">${p.category || ''}</span>
                            <h3>${p.title}</h3>
                            <p class="project-desc">${p.desc}</p>
                            <div class="project-footer">
                                <div class="project-tags">${tags}</div>
                                ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-github">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                                    GitHub
                                </a>` : ''}
                            </div>
                        </div>
                    </div>
                `;



                grid.appendChild(card);
            });
            grid.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
        }
    }

    // 3. Load Skills
    const skillContainer = document.getElementById('skills-container');
    if (skillContainer && data.skills) {
        skillContainer.innerHTML = '';
        const categoryNames = { languages: 'Languages', frameworks: 'Frameworks', tools: 'Tools & Platforms' };

        Object.entries(data.skills).forEach(([key, items]) => {
            const cat = document.createElement('div');
            cat.className = 'skill-category';
            const rows = items.map((s) => `
                <div class="skill-row">
                    <span class="skill-name">${s.name}</span>
                    <div class="skill-bar-wrap">
                        <div class="skill-bar" data-width="${s.level}"></div>
                    </div>
                </div>`).join('');
            cat.innerHTML = `<h3 class="skill-category-title">${categoryNames[key] || key}</h3>${rows}`;
            skillContainer.appendChild(cat);
        });

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const barObs = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    document.querySelectorAll('.skill-bar').forEach((bar) => {
                        bar.style.width = bar.dataset.width + '%';
                    });
                    barObs.unobserve(skillsSection);
                }
            }, { threshold: 0.2 });
            barObs.observe(skillsSection);
        }
    }

    // 4. Initialize premium card effects (Spotlight + 3D Tilt)
    initCardEffects();

    // 5. Bento grid staggered reveal
    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
        const bentoObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                bentoGrid.classList.add('visible');
                bentoObs.unobserve(bentoGrid);
            }
        }, { threshold: 0.1 });
        bentoObs.observe(bentoGrid);
    }
}

function initCardEffects() {
    const cards = document.querySelectorAll('.bento-card, .project-card, .skill-category, .exp-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS variables for spotlight effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Subtle 3D tilt effect
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit rotation to a small degree to feel premium and heavy
            const rotateX = ((y - centerY) / centerY) * -3; 
            const rotateY = ((x - centerX) / centerX) * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}



// Start
initPortfolio();
