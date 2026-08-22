/* ==========================================================================
   BISWA ANANTA JALI - APPLICATION & INTERACTIVE ENGINE
   Pure Vanilla JavaScript for seamless animations, recruiter fast-track,
   project architecture modals, interactive terminal, and skill matrix.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------- TYPEWRITER EFFECT -----------------
  const typedTarget = document.getElementById('typed-text');
  if (typedTarget) {
    const roles = [
      'Full-Stack MERN Development',
      'Scalable Web Systems Architecture',
      'Data Structures & Algorithms',
      'Responsive UI/UX Front-End Design',
      'Database & Backend Optimization',
      'REST API Development & Integration',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typedTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typedTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();
  }

  // ----------------- NAVBAR SCROLL SPY & MOBILE MENU -----------------
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll Spy Active Link
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
    const isOpen = navMenu?.classList.contains('open');
    mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on clicking any link or mobile CTA
  document.querySelectorAll('.nav-link, .nav-mobile-cta').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      document.body.style.overflow = '';
      if (mobileToggle) mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // ----------------- THEME TOGGLE -----------------
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('baj_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle?.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const newTheme = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('baj_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  // ----------------- STAT COUNTERS ANIMATION -----------------
  // ----------------- STATS COUNTER ANIMATION (MOBILE & DESKTOP) -----------------
  const counterElements = document.querySelectorAll('.stat-counter');
  let animated = false;

  function runCounterAnimation() {
    if (animated) return;
    animated = true;

    counterElements.forEach((counter) => {
      const target = +counter.getAttribute('data-target') || 0;
      const duration = 1200;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOutProgress * target);

        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Low threshold (0.1) for mobile compatibility and observing stats grid directly
  const statsContainer = document.querySelector('.recruiter-stats-grid') || document.getElementById('recruiter-deck');

  if (statsContainer && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounterAnimation();
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    counterObserver.observe(statsContainer);
  } else {
    runCounterAnimation();
  }

  // Passive scroll fallback for mobile screens
  window.addEventListener('scroll', () => {
    if (!animated && statsContainer) {
      const rect = statsContainer.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        runCounterAnimation();
      }
    }
  }, { passive: true });

  // ----------------- PROJECT FILTERING -----------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ----------------- SKILLS LIVE SEARCH & HIGHLIGHT -----------------
  const skillSearch = document.getElementById('skill-search-input');
  const skillCardItems = document.querySelectorAll('.skill-card-item');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  skillSearch?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();

    skillCardItems.forEach((item) => {
      const skillName = item.querySelector('.skill-name')?.textContent.toLowerCase();
      if (!term || skillName.includes(term)) {
        item.style.display = 'flex';
        item.style.opacity = '1';
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });

    // Check category cards visibility
    skillCategoryCards.forEach((card) => {
      const visibleItems = card.querySelectorAll('.skill-card-item:not([style*="display: none"])');
      card.style.opacity = visibleItems.length > 0 ? '1' : '0.25';
    });
  });

  // ----------------- PROJECT ARCHITECTURE MODALS -----------------
  const modalBackdrop = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalBody = document.getElementById('modal-project-body');
  const modalClose = document.getElementById('modal-close-btn');

  const projectDetails = {
    renthere: {
      title: 'Rent Here – Full-Stack PG & Real Estate Rental Architecture',
      body: `
        <div class="modal-deepdive">
          <div class="modal-arch-badge"><i class="fas fa-layer-group"></i> Architecture Breakdown & System Design</div>
          <p class="modal-lead">A production-ready full-stack MERN property rental platform designed to resolve unverified listings, slow query bottlenecks, and disjointed buyer-seller communications.</p>
          
          <div class="modal-grid-2">
            <div class="modal-spec-card">
              <h4><i class="fas fa-shield-alt"></i> 3-Tier Role-Based Access Control</h4>
              <ul>
                <li><strong>Admin:</strong> Listing verification pipeline, marketplace moderation, user audit logs.</li>
                <li><strong>Seller/Landlord:</strong> Property submission, inquiry tracker, boosting campaigns.</li>
                <li><strong>Buyer/Tenant:</strong> Search filters, verified badges, direct inquiry dispatcher.</li>
              </ul>
            </div>
            <div class="modal-spec-card">
              <h4><i class="fas fa-bolt"></i> High-Speed MongoDB Search Engine</h4>
              <ul>
                <li><strong>Composite Indexing:</strong> <code>{ isBoosted: -1, createdAt: -1 }</code> for sponsored + chronological prioritization.</li>
                <li><strong>Sub-100ms Query Latency:</strong> Dynamic filtering by City, Price Bounds, Category, and Amenities.</li>
                <li><strong>Multer Pipeline:</strong> Multi-image streaming with MIME verification.</li>
              </ul>
            </div>
          </div>

          <div class="modal-code-snippet">
            <div class="snippet-header">
              <span>MongoDB Search Aggregation Pipeline (Optimized)</span>
              <span class="badge-js">Express.js / Node.js</span>
            </div>
            <pre><code>// Dynamic Aggregation Filter with Boost Prioritization
const filter = { isVerified: true };
if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
if (req.query.maxPrice) filter.price = { $lte: Number(req.query.maxPrice) };

const properties = await Property.find(filter)
  .sort({ isBoosted: -1, createdAt: -1 })
  .limit(20)
  .populate('landlordId', 'name email phone');</code></pre>
          </div>

          <div class="modal-key-metrics">
            <div class="m-metric">
              <span class="m-val">&lt; 100ms</span>
              <span class="m-lbl">Query Response Time</span>
            </div>
            <div class="m-metric">
              <span class="m-val">100%</span>
              <span class="m-lbl">Listing Verification Pipeline</span>
            </div>
            <div class="m-metric">
              <span class="m-val">Vanilla CSS</span>
              <span class="m-lbl">Glassmorphism UI System</span>
            </div>
          </div>
        </div>
      `
    },
    smartmess: {
      title: 'Smart Mess Management System – Full-Stack MERN Campus Dining Portal',
      body: `
        <div class="modal-deepdive">
          <div class="modal-arch-badge"><i class="fas fa-utensils"></i> Full-Stack MERN & Campus Analytics</div>
          <p class="modal-lead">Architected a full-stack MERN portal supporting Student, Mess Admin, and College Authority roles to eliminate dining hall wastage, automate meal headcount forecasting, and manage QR-based billing.</p>
          
          <div class="modal-grid-2">
            <div class="modal-spec-card">
              <h4><i class="fas fa-user-shield"></i> Multi-Role RBAC & JWT Authorization</h4>
              <ul>
                <li><strong>3-Role Architecture:</strong> Dedicated portals for Student, Mess Admin, and College Authority.</li>
                <li><strong>Secure Access:</strong> JWT-based authorization supporting Email and Student Roll ID login.</li>
                <li><strong>Dynamic QR Passes:</strong> Prevent double serving and streamline entry verification.</li>
              </ul>
            </div>
            <div class="modal-spec-card">
              <h4><i class="fas fa-chart-line"></i> Demand Forecasting & Automated Reset</h4>
              <ul>
                <li><strong>30% Waste Reduction:</strong> Real-time headcount analytics forecasting meal demand.</li>
                <li><strong>Preference Locking:</strong> Student meal selection locking with automated midnight reset.</li>
                <li><strong>Monthly Billing:</strong> Calculated based on consumed meals with integrated feedback analytics.</li>
              </ul>
            </div>
          </div>

          <div class="modal-key-metrics">
            <div class="m-metric">
              <span class="m-val">~30%</span>
              <span class="m-lbl">Food Waste Reduction</span>
            </div>
            <div class="m-metric">
              <span class="m-val">3 Roles</span>
              <span class="m-lbl">Student, Admin & Authority</span>
            </div>
            <div class="m-metric">
              <span class="m-val">MERN + Vite</span>
              <span class="m-lbl">JWT & QR Billing Engine</span>
            </div>
          </div>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-project-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (data && modalBackdrop && modalTitle && modalBody) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.body;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  function closeModal() {
    modalBackdrop?.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // ----------------- RESUME VIEWER MODAL -----------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-modal');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  openResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeResumeBtn?.addEventListener('click', () => {
    resumeModal?.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  printResumeBtn?.addEventListener('click', () => {
    window.print();
  });

  // ----------------- INTERACTIVE DEVELOPER TERMINAL -----------------
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  const terminalCommands = {
    help: `Available Commands:
  • <strong style="color:#00f2fe">about</strong>       : Quick executive summary of Biswa Ananta Jali
  • <strong style="color:#00f2fe">skills</strong>      : List core technical competencies & stack
  • <strong style="color:#00f2fe">projects</strong>    : Display featured flagship projects
  • <strong style="color:#00f2fe">experience</strong>  : Show internship experience at MindBrain & NALCO
  • <strong style="color:#00f2fe">education</strong>   : IIIT Bhubaneswar & Ravenshaw details
  • <strong style="color:#00f2fe">hire</strong>        : Why recruit Biswa? Placement highlights
  • <strong style="color:#00f2fe">contact</strong>     : Phone, email, GitHub, LinkedIn details
  • <strong style="color:#00f2fe">clear</strong>       : Clear terminal screen`,

    about: `Biswa Ananta Jali | Computer Engineering undergraduate @ IIIT Bhubaneswar (2023 - 2027)
Specialization: Full-Stack MERN Development, Scalable Web Systems & Algorithms.
Proven track record: 2 high-impact internships (MindBrain Innovations, NALCO) & Secretary at Mess Society.`,

    skills: `Technical Matrix:
  [Languages]       : C, C++, JavaScript (ES6+), SQL
  [Frameworks/Libs] : React.js, Node.js, Express.js, HTML5, CSS3, Bootstrap, REST APIs
  [Databases]       : MongoDB, Mongoose, Microsoft SQL Server, MySQL
  [Tools/Platforms] : Git, GitHub, VS Code, Visual Studio, Postman, Vite
  [CS Fundamentals] : Data Structures & Algorithms, OOP, DBMS, OS, Computer Networks`,

    projects: `Flagship Projects:
  1. [Rent Here]                   - Full-Stack MERN Rental Platform (3-Tier RBAC, Sub-100ms MongoDB search)
  2. [Smart Mess Management]       - Full-Stack MERN Dining Portal (Student/Admin/Authority Roles, 30% Food Waste Cut, QR Billing)`,

    experience: `Internships & Industry Experience:
  1. MindBrain Innovations (Full Stack MERN Developer Intern | May 2026 - Jul 2026)
     - Developed full-stack e-commerce app with React.js, Node.js, Express.js, MongoDB & JWT auth.
  2. NALCO (Project Intern - Web | Jun 2025 - Jul 2025)
     - Developed coal import logistics platform between NALCO & MCL using JS, HTML, CSS, Bootstrap, C#, MS SQL Server.`,

    education: `Academic Background:
  • IIIT Bhubaneswar - Bachelor of Computer Engineering (Aug 2023 - May 2027)
  • Ravenshaw Higher Secondary School - Class-XII (Sep 2021 - May 2023)`,

    hire: `Why Hire Biswa for Campus Placement?
  ✓ Full-stack execution speed with clean MERN stack architecture
  ✓ Strong foundation in Data Structures, Algorithms & OOP in C++
  ✓ Production experience in both Startups (MindBrain) and Enterprise PSUs (NALCO)
  ✓ Proven leadership & crisis management as Mess Society Secretary`,

    contact: `Direct Contact:
  • Email    : biswaananta005@gmail.com
  • Phone    : +91 9556500113
  • Location : Bhubaneswar, Odisha, India
  • LinkedIn : linkedin.com/in/biswa-ananta-jali
  • GitHub   : github.com/biswaananta005`
  };

  terminalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim().toLowerCase();
      if (!input) return;

      // Append user command line
      const userLine = document.createElement('div');
      userLine.className = 't-line';
      userLine.innerHTML = `<span class="t-prompt">biswa@iiitbbsr:~$</span> <span class="t-cmd">${escapeHtml(input)}</span>`;
      terminalBody?.appendChild(userLine);

      if (input === 'clear') {
        if (terminalBody) terminalBody.innerHTML = '';
      } else if (terminalCommands[input]) {
        const outLine = document.createElement('div');
        outLine.className = 't-line t-output';
        outLine.innerHTML = terminalCommands[input].replace(/\n/g, '<br>');
        terminalBody?.appendChild(outLine);
      } else {
        const errLine = document.createElement('div');
        errLine.className = 't-line t-output';
        errLine.innerHTML = `<span style="color:#ef4444">Command not found: "${escapeHtml(input)}". Type <strong style="color:#00f2fe">help</strong> for available commands.</span>`;
        terminalBody?.appendChild(errLine);
      }

      terminalInput.value = '';
      if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ----------------- COPY TO CLIPBOARD BUTTONS -----------------
  document.querySelectorAll('.copy-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Text';

      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${label}: ${textToCopy}`, 'success');
          btn.classList.add('copied');
          setTimeout(() => btn.classList.remove('copied'), 2000);
        });
      }
    });
  });

  // ----------------- CONTACT FORM SIMULATION -----------------
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name')?.value;
    const email = document.getElementById('c-email')?.value;
    const subject = document.getElementById('c-subject')?.value || 'Placement Inquiry for Biswa Ananta Jali';
    const message = document.getElementById('c-message')?.value;

    if (!name || !email || !message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    // Direct Mailto Fallback
    const mailtoUrl = `mailto:biswaananta005@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
    window.open(mailtoUrl, '_blank');

    showToast(`Thank you, ${name}! Your email client has been opened.`, 'success');
    contactForm.reset();
  });

  // ----------------- TOAST NOTIFICATIONS HELPER -----------------
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-triangle';

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Smooth Reveal on Scroll using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
});
