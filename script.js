    /* ==================================================
   UTILITIES
================================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* ==================================================
   THEME TOGGLE (Dark / Light)
================================================== */

const themeToggle = $("#themeToggle");

function setTheme(mode) {
    if (mode === "light") {
        // document.body.classList.add("light-mode");
        // localStorage.setItem("theme", "light");
        // // themeToggle.textContent = "☀️";
    }
    else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
        // themeToggle.textContent = "🌙";
    }
}

// load saved theme
const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-mode");
    setTheme(isLight ? "dark" : "light");
});

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");

    // جلوگیری از scroll وقتی منو باز است
    document.body.classList.toggle("menu-open");
});

// close menu on click
document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
    });
});



/* ==================================================
   SCROLL PROGRESS BAR
================================================== */

const progressBar = $(".progress-bar");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
        document.body.scrollHeight - window.innerHeight;

    const progress = (scrollTop / docHeight) * 100;

    progressBar.style.width = progress + "%";
});

/* ==================================================
   HEADER ON SCROLL
================================================== */

const header = $(".header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ==================================================
   COUNTERS (STATS)
================================================== */

const counters = $$(".counter");

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            const counter = entry.target;
            const target = +counter.dataset.target;

            let count = 0;

            const update = () => {
                const increment = target / 80;

                if (count < target) {
                    count += increment;
                    counter.textContent = Math.ceil(count);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + "+";
                }
            };

            update();
            counterObserver.unobserve(counter);
        }
    });
}, {
    threshold: 0.6
});

counters.forEach(c => counterObserver.observe(c));


/*=================================================
          contact Form
==================================================*/

const form = document.getElementById("contactForm");
const popup = document.getElementById("successPopup");
const closeBtn = document.getElementById("closePopup");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json"
            }
        });

        if (response.ok) {
            popup.classList.add("show");
            form.reset();
        } else {
            alert("Failed to send message.");
        }
    } catch (error) {
        alert("Something went wrong.");
    }
});

closeBtn.addEventListener("click", () => {
    popup.classList.remove("show");
});

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.remove("show");
    }
});



/* ==================================================
   SKILL BARS ANIMATION
================================================== */

const skillBars = $$(".skill-fill");

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            const bar = entry.target;
            const width = bar.dataset.width;

            bar.style.width = width;

            skillObserver.unobserve(bar);
        }
    });
}, {
    threshold: 0.5
});

skillBars.forEach(bar => skillObserver.observe(bar));

/* ==================================================
   SCROLL REVEAL ANIMATION
================================================== */

const reveals = $$(".service-card, .project-card, .stat-card, .about-content, .skills-grid");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal", "active");
        }
    });
}, {
    threshold: 0.15
});

reveals.forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
});

/* ==================================================
   CUSTOM CURSOR
================================================== */

const cursorDot = $(".cursor-dot");
const cursorRing = $(".cursor-ring");

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
});

// smooth ring follow
function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";

    requestAnimationFrame(animateCursor);
}
animateCursor();

// hover effect
$$("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-active");
    });

    el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-active");
    });
});

/* ==================================================
   PARTICLE BACKGROUND (LIGHTWEIGHT CANVAS)
================================================== */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 350; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ==================================================
   SMOOTH SCROLL (optional enhancement)
================================================== */

$$("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = $(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});