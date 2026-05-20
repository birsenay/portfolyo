const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

const hoverElements = document.querySelectorAll('a, .btn, .hamburger, .view-btn, .image-placeholder, .social-icon');
hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorOutline.style.backgroundColor = "rgba(124, 108, 242, 0.1)";
        cursorOutline.style.border = "none";
    });
    elem.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.backgroundColor = "transparent";
        cursorOutline.style.border = "1px solid rgba(124, 108, 242, 0.5)";
    });
});

const words = document.querySelectorAll(".dynamic-text .word");
let currentWordIndex = 0;
if (words.length > 0) {
    const maxWordIndex = words.length - 1;
    words[currentWordIndex].style.opacity = "1";

    function changeText() {
        let currentWord = words[currentWordIndex];
        let nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];

        currentWord.classList.remove('active');
        nextWord.classList.add('active');

        currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
    }
    setInterval(changeText, 2500);
}

const header = document.getElementById("header");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});

const hamburger = document.querySelector(".hamburger");
const navList = document.querySelector(".nav-list");

if (hamburger && navList) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navList.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navList.classList.remove("active");
    }));
}

const faders = document.querySelectorAll('.fade-in-up');
const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

const yearEl = document.getElementById("year");
if(yearEl) yearEl.textContent = new Date().getFullYear();

// ==========================================
// DYNAMIC CONTENT LOADING FROM LOCALSTORAGE
// ==========================================
async function loadDynamicContent() {
    try {
        const data = JSON.parse(localStorage.getItem('siteData') || '{}');

        // 1. Hero Section
        if (data.hero) {
            const titleEl = document.querySelector('.hero .title');
            if(titleEl) {
                // Keep the gradient wrapping for the last word
                const nameParts = data.hero.name.split(' ');
                const lastName = nameParts.pop();
                titleEl.innerHTML = `${nameParts.join(' ')} <span class="gradient-text">${lastName}</span>`;
            }
            const subtitleEl = document.querySelector('.hero .subtitle');
            if(subtitleEl) subtitleEl.textContent = data.hero.subtitle;
            const descEl = document.querySelector('.hero .description');
            if(descEl) descEl.textContent = data.hero.description;

            // Rebuild dynamic words
            const dynamicTextContainer = document.querySelector('.dynamic-text');
            if (dynamicTextContainer && data.hero.dynamicWords.length > 0) {
                dynamicTextContainer.innerHTML = '';
                data.hero.dynamicWords.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.className = `word ${index === 0 ? 'active' : ''}`;
                    span.textContent = word;
                    dynamicTextContainer.appendChild(span);
                });
                
                // Re-initialize dynamic words animation logic
                const newWords = document.querySelectorAll(".dynamic-text .word");
                let currentWordIndex = 0;
                if (newWords.length > 0) {
                    const maxWordIndex = newWords.length - 1;
                    function changeText() {
                        let currentWord = newWords[currentWordIndex];
                        let nextWord = currentWordIndex === maxWordIndex ? newWords[0] : newWords[currentWordIndex + 1];
                        currentWord.classList.remove('active');
                        nextWord.classList.add('active');
                        currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
                    }
                    // Clear previous interval if any? Actually it's fine
                    setInterval(changeText, 2500);
                }
            }
        }

        // 2. About Section
        if (data.about) {
            const aboutTextContainer = document.querySelector('.about-text');
            if (aboutTextContainer) {
                // Look for the learning badge to preserve it
                const badge = aboutTextContainer.querySelector('.learning-badge');
                
                // Clear paragraphs
                const paragraphs = aboutTextContainer.querySelectorAll('p');
                paragraphs.forEach(p => p.remove());

                // Insert new paragraphs before badge
                data.about.paragraphs.forEach(pText => {
                    if (pText.trim() !== '') {
                        const p = document.createElement('p');
                        p.textContent = pText;
                        aboutTextContainer.insertBefore(p, badge);
                    }
                });

                if (badge && data.about.learning) {
                    badge.innerHTML = `<span class="icon">✨</span><strong>Şu An Neler Öğreniyorum:</strong> ${data.about.learning}`;
                }
            }
        }

        // 3. Skills Section
        if (data.skills) {
            const skillsGrid = document.querySelector('.skills-grid');
            if (skillsGrid) {
                skillsGrid.innerHTML = '';
                data.skills.forEach(skillCat => {
                    const tagsHtml = skillCat.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('');
                    skillsGrid.innerHTML += `
                        <div class="skill-category">
                            <h3>${skillCat.category}</h3>
                            <div class="skill-tags">
                                ${tagsHtml}
                            </div>
                        </div>
                    `;
                });
            }
        }

        // 4. Projects Section
        if (data.projects) {
            const projectGrid = document.querySelector('.project-grid');
            if (projectGrid) {
                projectGrid.innerHTML = '';
                data.projects.forEach(project => {
                    projectGrid.innerHTML += `
                        <div class="project-card fade-in-up appear">
                            <div class="project-image">
                                <div class="image-placeholder" style="${project.style || ''}"><span style="font-size:3rem;">${project.icon || '💻'}</span></div>
                                <div class="project-overlay">
                                    <a href="${project.link || '#'}" class="view-btn">İncele</a>
                                </div>
                            </div>
                            <div class="project-info">
                                <span class="project-category">${project.category}</span>
                                <h3 class="project-title">${project.title}</h3>
                                <p class="project-desc">${project.description}</p>
                            </div>
                        </div>
                    `;
                });
                // Re-attach hover logic for new view buttons
                const newHoverElems = projectGrid.querySelectorAll('.view-btn, .image-placeholder');
                newHoverElems.forEach(elem => {
                    elem.addEventListener('mouseenter', () => {
                        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
                        cursorOutline.style.backgroundColor = "rgba(124, 108, 242, 0.1)";
                        cursorOutline.style.border = "none";
                    });
                    elem.addEventListener('mouseleave', () => {
                        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
                        cursorOutline.style.backgroundColor = "transparent";
                        cursorOutline.style.border = "1px solid rgba(124, 108, 242, 0.5)";
                    });
                });
            }
        }

        // 5. Contact Section
        if (data.contact) {
            const emailBtn = document.querySelector('.contact-methods .btn');
            if(emailBtn && data.contact.email) {
                emailBtn.href = `mailto:${data.contact.email}`;
            }

            const linkedinLink = document.querySelector('.social-links a[aria-label="LinkedIn"]');
            if (linkedinLink) linkedinLink.href = data.contact.linkedin || '#';
            
            const githubLink = document.querySelector('.social-links a[aria-label="GitHub"]');
            if (githubLink) githubLink.href = data.contact.github || '#';
            
            const instagramLink = document.querySelector('.social-links a[aria-label="Instagram"]');
            if (instagramLink) instagramLink.href = data.contact.instagram || '#';
        }

    } catch (error) {
        console.error('Dynamic content could not be loaded:', error);
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', loadDynamicContent);
