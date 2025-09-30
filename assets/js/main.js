(() => {
  const STORAGE_KEYS = {
    largeText: 'cvassist:textSize:large',
    highContrast: 'cvassist:contrast:high',
  };

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Citation metadata for tooltips and links
  const CITES = {
    1: { title: 'A Review of Vision-Based Assistive Systems for Visually Impaired People', url: 'sections/annotated-bibliography.html#ref-1' },
    2: { title: 'ObjectFinder: Open-Vocabulary Assistive Object Search', url: 'sections/annotated-bibliography.html#ref-2' },
    3: { title: 'OpenGuide: Assistive Object Retrieval in Indoor Spaces', url: 'sections/annotated-bibliography.html#ref-3' },
    4: { title: 'Mobile Vision as Assistive Technology for the Blind', url: 'sections/annotated-bibliography.html#ref-4' },
    5: { title: 'Efficient On-Device Object Detection for Mobile AR', url: 'sections/annotated-bibliography.html#ref-5' }
  };

  function applyPreferencesFromStorage() {
    try {
      const largeText = localStorage.getItem(STORAGE_KEYS.largeText) === 'true';
      const highContrast = localStorage.getItem(STORAGE_KEYS.highContrast) === 'true';
      document.documentElement.classList.toggle('large-text', largeText);
      document.body && document.body.classList.toggle('large-text', largeText);
      document.documentElement.classList.toggle('high-contrast', highContrast);
      const textToggle = document.getElementById('text-size-toggle');
      if (textToggle) {
        textToggle.setAttribute('aria-pressed', String(largeText));
        textToggle.textContent = largeText ? 'Text Size: Large' : 'Text Size: Normal';
      }
      const contrastToggle = document.getElementById('contrast-toggle');
      if (contrastToggle) {
        contrastToggle.setAttribute('aria-pressed', String(highContrast));
        contrastToggle.textContent = highContrast ? 'High Contrast: On' : 'High Contrast: Off';
      }
    } catch { /* ignore */ }
  }

  function wireToggles() {
    const textToggle = document.getElementById('text-size-toggle');
    const contrastToggle = document.getElementById('contrast-toggle');
    if (textToggle) {
      textToggle.addEventListener('click', () => {
        const isLarge = document.documentElement.classList.toggle('large-text');
        if (document.body) document.body.classList.toggle('large-text', isLarge);
        textToggle.setAttribute('aria-pressed', String(isLarge));
        textToggle.textContent = isLarge ? 'Text Size: Large' : 'Text Size: Normal';
        try { localStorage.setItem(STORAGE_KEYS.largeText, String(isLarge)); } catch {}
      });
    }
    if (contrastToggle) {
      contrastToggle.addEventListener('click', () => {
        const isHigh = document.documentElement.classList.toggle('high-contrast');
        contrastToggle.setAttribute('aria-pressed', String(isHigh));
        contrastToggle.textContent = isHigh ? 'High Contrast: On' : 'High Contrast: Off';
        try { localStorage.setItem(STORAGE_KEYS.highContrast, String(isHigh)); } catch {}
      });
    }
  }

  function markActiveNavLink() {
    const links = document.querySelectorAll('.pill-nav a, .site-nav a');
    const here = location.pathname.split('/').pop() || 'index.html';
    let activeLink = null;

    links.forEach(link => {
      const target = link.getAttribute('href');
      if (!target) return;
      const targetFile = target.split('/').pop();
      if (targetFile === here) {
        link.setAttribute('aria-current', 'page');
        activeLink = link;
      }
    });

    // Scroll active link into view in the navigation bar
    if (activeLink) {
      setTimeout(() => {
        scrollActiveNavIntoView(activeLink);
      }, 150);
    }
  }

  function scrollActiveNavIntoView(activeLink) {
    // For pill-nav style
    const navWrapper = document.querySelector('.nav-wrapper');
    if (navWrapper && activeLink) {
      const offset = activeLink.offsetLeft - navWrapper.offsetWidth / 2 + activeLink.offsetWidth / 2;
      navWrapper.scrollTo({
        left: Math.max(0, offset),
        behavior: 'smooth'
      });
    } else if (activeLink) {
      // Fallback for old navigation style
      activeLink.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  function updateLastUpdated() {
    const el = document.getElementById('last-updated');
    if (!el) return;
    const date = new Date(document.lastModified);
    const formatted = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    el.textContent = formatted;
    el.setAttribute('datetime', date.toISOString());
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function wireMenuToggle() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('primary-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
    });
    // Initialize hidden on small screens
    menu.hidden = true;
  }

  function enableSmoothScrollForAnchors() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  }

  function initAudioPlayers() {
    const players = document.querySelectorAll('audio');
    players.forEach((audio) => {
      audio.setAttribute('preload', audio.getAttribute('preload') || 'none');
      // Future: attach track list or captions when provided
    });
  }

  function renderCites() {
    const nodes = document.querySelectorAll('sup[data-cite]');
    nodes.forEach((node) => {
      const numStr = node.getAttribute('data-cite');
      if (!numStr) return;
      const num = parseInt(numStr, 10);
      const meta = CITES[num];
      if (!meta) return;
      const a = document.createElement('a');
      a.href = meta.url;
      a.textContent = `[${num}]`;
      a.setAttribute('aria-label', `Reference ${num}: ${meta.title}`);
      a.title = meta.title;
      node.replaceWith(a);
    });
  }

  function initQuiz() {
    const form = document.getElementById('quiz-form');
    if (!form) return;
    const checkBtn = document.getElementById('quiz-check');
    const resetBtn = document.getElementById('quiz-reset');
    const scoreEl = document.getElementById('quiz-score');
    const answers = { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a', q6: 'a', q7: 'a', q8: 'a' };
    const HIGH_KEY = 'cvassist:quiz:highscore';

    function showExplanation(id, correct) {
      const explain = document.getElementById(`${id}-explain`);
      if (explain) {
        explain.hidden = false;
        explain.style.color = correct ? 'inherit' : 'crimson';
      }
    }

    function grade() {
      let correctCount = 0;
      Object.keys(answers).forEach((qid) => {
        const selected = form.querySelector(`input[name="${qid}"]:checked`);
        const isCorrect = selected && selected.value === answers[qid];
        if (isCorrect) correctCount += 1;
        showExplanation(qid, !!isCorrect);
      });
      const total = Object.keys(answers).length;
      scoreEl.textContent = `Score: ${correctCount}/${total}`;
      try {
        const prev = parseInt(localStorage.getItem(HIGH_KEY) || '0', 10);
        if (correctCount > prev) localStorage.setItem(HIGH_KEY, String(correctCount));
        const high = parseInt(localStorage.getItem(HIGH_KEY) || '0', 10);
        scoreEl.textContent += ` · Highest: ${high}/${total}`;
      } catch {}
    }

    function reset() {
      form.reset();
      scoreEl.textContent = '';
      Object.keys(answers).forEach((qid) => {
        const explain = document.getElementById(`${qid}-explain`);
        if (explain) explain.hidden = true;
      });
    }

    if (checkBtn) checkBtn.addEventListener('click', grade);
    if (resetBtn) resetBtn.addEventListener('click', reset);
  }

  // Progress tracking
  function initProgressTracking() {
    const sections = [
      'introduction.html',
      'related-work.html', 
      'classical-methods.html',
      'modern-on-device.html',
      'datasets-evaluation.html',
      'accessibility-privacy.html',
      'challenges-gaps.html',
      'future-conclusion.html',
      'quiz.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    const currentIndex = sections.indexOf(currentPage);
    
    if (currentIndex >= 0) {
      const progress = ((currentIndex + 1) / sections.length) * 100;
      updateProgressBar(progress);
    }
  }

  function updateProgressBar(percentage) {
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
      const container = document.createElement('div');
      container.className = 'progress-container';
      container.innerHTML = '<div class="progress-bar"></div>';
      document.body.insertBefore(container, document.body.firstChild);
      progressBar = container.querySelector('.progress-bar');
    }
    progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  }

  // Search functionality
  function initSearch() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;

    const searchInput = searchContainer.querySelector('.search-input');
    const searchResults = searchContainer.querySelector('.search-results');
    
    if (!searchInput || !searchResults) return;

    const searchData = [
      { title: 'Introduction', url: 'sections/introduction.html', content: 'Overview of assistive object-finding systems' },
      { title: 'Related Work', url: 'sections/related-work.html', content: 'Previous research and surveys' },
      { title: 'Classical Methods', url: 'sections/classical-methods.html', content: 'Traditional computer vision approaches' },
      { title: 'Modern On-Device', url: 'sections/modern-on-device.html', content: 'Lightweight models and mobile deployment' },
      { title: 'Datasets & Evaluation', url: 'sections/datasets-evaluation.html', content: 'Benchmarks and performance metrics' },
      { title: 'Accessibility & Privacy', url: 'sections/accessibility-privacy.html', content: 'User interface design and data protection' },
      { title: 'Challenges & Gaps', url: 'sections/challenges-gaps.html', content: 'Current limitations and research opportunities' },
      { title: 'Future & Conclusion', url: 'sections/future-conclusion.html', content: 'Future directions and summary' },
      { title: 'Quiz', url: 'sections/quiz.html', content: 'Test your knowledge' },
      { title: 'Annotated Bibliography', url: 'sections/annotated-bibliography.html', content: 'References and citations' }
    ];

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length < 2) {
        searchResults.classList.remove('show');
        return;
      }

      const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
      );

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result">No results found</div>';
      } else {
        searchResults.innerHTML = results.map(item => 
          `<a href="${item.url}" class="search-result">
            <strong>${item.title}</strong><br>
            <small>${item.content}</small>
          </a>`
        ).join('');
      }
      
      searchResults.classList.add('show');
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target)) {
        searchResults.classList.remove('show');
      }
    });
  }

  // Quick navigation
  function initQuickNav() {
    const quickNav = document.createElement('div');
    quickNav.className = 'quick-nav';
    quickNav.innerHTML = `
      <a href="sections/introduction.html" class="quick-nav-btn" title="Introduction">1</a>
      <a href="sections/classical-methods.html" class="quick-nav-btn" title="Classical Methods">2</a>
      <a href="sections/modern-on-device.html" class="quick-nav-btn" title="Modern On-Device">3</a>
      <a href="sections/accessibility-privacy.html" class="quick-nav-btn" title="Accessibility & Privacy">4</a>
      <a href="sections/quiz.html" class="quick-nav-btn" title="Quiz">Q</a>
    `;
    document.body.appendChild(quickNav);
  }

  // Keyboard shortcuts
  function initKeyboardShortcuts() {
    const shortcuts = document.createElement('div');
    shortcuts.className = 'keyboard-shortcuts';
    shortcuts.innerHTML = `
      <h4>Keyboard Shortcuts</h4>
      <div class="keyboard-shortcut">
        <span>Toggle search</span>
        <kbd>Ctrl</kbd> + <kbd>K</kbd>
      </div>
      <div class="keyboard-shortcut">
        <span>Toggle text size</span>
        <kbd>Ctrl</kbd> + <kbd>T</kbd>
      </div>
      <div class="keyboard-shortcut">
        <span>Toggle contrast</span>
        <kbd>Ctrl</kbd> + <kbd>C</kbd>
      </div>
      <div class="keyboard-shortcut">
        <span>Show/hide shortcuts</span>
        <kbd>?</kbd>
      </div>
    `;
    document.body.appendChild(shortcuts);

    let shortcutsVisible = false;
    
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'k':
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) searchInput.focus();
            break;
          case 't':
            e.preventDefault();
            const textToggle = document.getElementById('text-size-toggle');
            if (textToggle) textToggle.click();
            break;
          case 'c':
            e.preventDefault();
            const contrastToggle = document.getElementById('contrast-toggle');
            if (contrastToggle) contrastToggle.click();
            break;
        }
      } else if (e.key === '?') {
        e.preventDefault();
        shortcutsVisible = !shortcutsVisible;
        shortcuts.classList.toggle('show', shortcutsVisible);
      } else if (e.key === 'Escape') {
        shortcutsVisible = false;
        shortcuts.classList.remove('show');
        const searchResults = document.querySelector('.search-results');
        if (searchResults) searchResults.classList.remove('show');
      }
    });
  }

  // Status indicators for sections
  function addStatusIndicators() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.menu a[href$=".html"]');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const pageName = href.split('/').pop();
      
      if (pageName === currentPage) {
        link.classList.add('status-current');
      } else {
        // Check if this page has been visited (stored in localStorage)
        const visited = localStorage.getItem(`visited:${pageName}`);
        if (visited) {
          link.classList.add('status-completed');
        } else {
          link.classList.add('status-pending');
        }
      }
    });

    // Mark current page as visited
    if (currentPage) {
      localStorage.setItem(`visited:${currentPage}`, 'true');
    }
  }

  // Back to top functionality
  function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Reading progress indicator
  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    function updateReadingProgress() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    window.addEventListener('scroll', updateReadingProgress);
    window.addEventListener('resize', updateReadingProgress);
  }

  // Enhanced accessibility features
  function initAccessibilityEnhancements() {
    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    // Announce when toggles are activated
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const action = toggle.textContent;
        announcer.textContent = `${action} activated`;
        setTimeout(() => announcer.textContent = '', 1000);
      });
    });

    // Enhanced focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  function init() {
    applyPreferencesFromStorage();
    wireToggles();
    markActiveNavLink();
    updateLastUpdated();
    wireMenuToggle();
    enableSmoothScrollForAnchors();
    initAudioPlayers();
    initQuiz();
    renderCites();
    initProgressTracking();
    initSearch();
    // initQuickNav(); // Removed - quick navigation menu disabled
    // initKeyboardShortcuts(); // Removed - keyboard shortcuts disabled
    addStatusIndicators();
    initBackToTop();
    initReadingProgress();
    initAccessibilityEnhancements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


