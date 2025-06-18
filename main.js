// Constants
const TAB_COUNT = 20;
const TAB_WIDTH = 110;
const LOGO_HEIGHT = 150;
const ROWS = 3;
const TAB_NAMES = [
  'kylemayer.me',
  'Minecraft',
  ...Array.from({ length: TAB_COUNT - 2 }, (_, i) => `Project ${i + 3}`)
];
const TAB_ICONS = [
  '', // No icon for first tab
  'mserver.png', // PNG icon for Minecraft tab
  ...Array(TAB_COUNT - 2).fill('')
];

// Cache DOM elements
const TABS_INNER = document.getElementById('tabs-inner');
const TAB_CONTENT = document.getElementById('tab-content');
const TAB_DROPDOWN = document.getElementById('tab-dropdown');

// Cache tab metrics for performance
const calculateTabMetrics = (() => {
  let cache = null;
  return (containerWidth) => {
    if (cache && cache.width === containerWidth) return cache;
    
    const tabsPerRow = Math.ceil(TAB_NAMES.length / ROWS);
    const minOverlap = 4;
    const maxOverlap = 80;
    
    let overlap = maxOverlap;
    const totalMinOverlapWidth = TAB_WIDTH * tabsPerRow - minOverlap * (tabsPerRow - 1);
    
    if (containerWidth >= totalMinOverlapWidth) {
      overlap = minOverlap;
    } else {
      overlap = Math.min(
        maxOverlap,
        TAB_WIDTH - Math.floor((containerWidth - TAB_WIDTH) / (tabsPerRow - 1))
      );
    }
    
    const tabHeight = Math.floor((LOGO_HEIGHT - 2 * 8) / ROWS);
    const rowGap = Math.floor((LOGO_HEIGHT - tabHeight * ROWS) / (ROWS - 1));
    
    cache = { width: containerWidth, overlap, tabHeight, rowGap, tabsPerRow };
    return cache;
  };
})();

// Handle image loading errors
function handleImageError(e) {
  console.warn(`Failed to load image: ${e.target.src}`);
  e.target.style.display = 'none';
}

function renderTabs() {
  TABS_INNER.innerHTML = '';
  const containerWidth = TABS_INNER.parentElement.offsetWidth || window.innerWidth;
  const { overlap, tabHeight, rowGap, tabsPerRow } = calculateTabMetrics(containerWidth);
  
  const fragment = document.createDocumentFragment();
  
  TAB_NAMES.forEach((name, i) => {
    const row = Math.floor(i / tabsPerRow);
    const col = i % tabsPerRow;
    const tab = document.createElement('div');
    
    tab.className = 'tab' + (i === 0 ? ' active' : '');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', `tab-panel-${i}`);
    tab.setAttribute('tabindex', '0'); // Make tab focusable
    
    if (TAB_ICONS[i]) {
      const icon = document.createElement('img');
      icon.src = TAB_ICONS[i];
      icon.alt = 'Tab Icon';
      icon.className = 'tab-icon';
      icon.onerror = handleImageError;
      tab.appendChild(icon);
    }
    
    const text = document.createElement('span');
    text.textContent = name;
    tab.appendChild(text);
    
    const activeBg = i === 1 ? 'var(--minecraft-tab-color)' : `var(--project-tab-color-${i % 18})`;
    tab.style.setProperty('--tab-active-bg', activeBg);
    
    // Positioning
    tab.style.left = (col * (TAB_WIDTH - overlap)) + 'px';
    tab.style.top = (row * (tabHeight + rowGap)) + 'px';
    tab.style.width = TAB_WIDTH + 'px';
    tab.style.height = tabHeight + 'px';
    
    // Event listeners
    tab.onclick = () => selectTab(i);
    tab.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTab(i);
      }
    };
    
    fragment.appendChild(tab);
  });
  
  TABS_INNER.appendChild(fragment);
  
  // Set container dimensions
  TABS_INNER.style.minWidth = ((tabsPerRow-1)*(TAB_WIDTH-overlap) + TAB_WIDTH) + 'px';
  TABS_INNER.style.height = LOGO_HEIGHT + 'px';
}

function selectTab(idx) {
  // Update tab states
  document.querySelectorAll('.tab').forEach((tab, i) => {
    const isActive = i === idx;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive.toString());
  });
  
  // Prepare content
  const imageHtml = idx === 1 
    ? `<img src="mserver.png" alt="Minecraft Icon" class="main-tab-image" onerror="this.style.display='none'" loading="lazy" />`
    : '';
    
  const bgColor = idx === 1 
    ? 'var(--minecraft-tab-color)' 
    : `var(--project-tab-color-${idx % 18})`;
  
  // Update content
  if (idx === 0) {
    // Sales Portal Content for kylemayer.me tab with very light gray background
    TAB_CONTENT.classList.add('kylemayerme-bg');
    TAB_CONTENT.style.marginTop = '';
    TAB_CONTENT.style.margin = '0 2rem 2rem 2rem';
    TAB_CONTENT.style.borderRadius = '0 0 16px 16px';
    TAB_CONTENT.style.background = '#f5f6fa'; // very light gray
    TAB_CONTENT.innerHTML = `
      <div class="tab-content-inner sales-portal-content" style="flex-direction: column; align-items: center; gap: 2rem; padding: 2rem; border-radius: 0 0 16px 16px; box-sizing: border-box; width: 100%; background: none; text-align: center;">
        <div style="font-size:1.1rem; margin-bottom:24px; color:var(--accent); font-weight:500; font-style:italic; text-align:center; width:100%; max-width: 800px;">Can your customers find you online—and are you the one controlling what they see?</div>
        <nav class="sales-nav sales-nav-top" style="align-self: center;">
          <button class="sales-nav-link" data-target="#demo-section">Get My Free Demo</button>
          <button class="sales-nav-link" data-target="#packages-section">See Plans</button>
        </nav>
        <div class="hero" style="max-width: 800px;">
          <h1>Your Business Deserves to Be Seen.<br>I'll Make Sure It Is.</h1>
          <div class="sub-headline" style="margin: 1.5rem auto;">Get your business online fast. Zero tech headaches.</div>
        </div>
        <section id="packages-preview" style="max-width: 1000px; margin: 2rem auto;">
          <div class="package-card" style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 1.5rem; width: 280px; height: 180px; display: flex; flex-direction: column; align-items: center; margin: 0.3rem; text-align: center;">
            <div class="tier" style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">Profile</div>
            <div class="price" style="color: var(--accent); font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem;">$100/mo</div>
            <div class="desc" style="font-size: 0.95rem; color: #444; line-height: 1.4; margin-bottom: 0.5rem;">A clean, professional digital business card—efficient and elegant.</div>
          </div>
          <div class="package-card" style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 1.5rem; width: 280px; height: 180px; display: flex; flex-direction: column; align-items: center; margin: 0.3rem; text-align: center;">
            <div class="tier" style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;"><del>Studio</del></div>
            <p style="font-size: 0.8rem; color: #888; margin-top: 0.2rem; margin-bottom: 0.5rem;">The next 20 customers upgraded to Studio for free.</p>
            <div class="price" style="color: var(--accent); font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem;">$250/mo</div>
            <div class="desc" style="font-size: 0.95rem; color: #444; line-height: 1.4; margin-bottom: 0.5rem;">Multi-page site, custom design, and priority support.</div>
          </div>
          <div class="package-card" style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 1.5rem; width: 280px; height: 180px; display: flex; flex-direction: column; align-items: center; margin: 0.3rem; text-align: center;">
            <div class="tier" style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;"><del>Elite</del></div>
            <p style="font-size: 0.8rem; color: #888; margin-top: 0.2rem; margin-bottom: 0.5rem;">Not currently available</p>
            <div class="price" style="color: var(--accent); font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem;">$500/mo</div>
            <div class="desc" style="font-size: 0.95rem; color: #444; line-height: 1.4; margin-bottom: 0.5rem;">Full-featured, e-commerce, integrations, and white-glove service.</div>
          </div>
        </section>
        <div id="demo-section" class="sales-section" style="width: 100%;">
          <div class="contact-form" style="margin: 3rem auto; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center;">
            <h2 style="margin-bottom: 1.5rem;">Request Your Free Demo</h2>
            <form style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem 2.5rem; align-items: center; width: 100%; max-width: 500px;">
              <input type="text" placeholder="Your Name" required style="width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid #bbb;">
              <input type="text" placeholder="Business Name" required style="width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid #bbb;">
              <input type="email" placeholder="Email Address" required style="width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid #bbb;">
              <input type="tel" placeholder="Phone Number" style="width: 100%; padding: 0.8rem; border-radius: 6px; border: 1px solid #bbb;">
              <div style="grid-column: 1 / span 2; text-align: center;">
                <small style="color: #666; display: block; margin: 0.5rem 0 1.5rem;">We'll never share your info.</small>
                <button type="submit" style="width: 100%; background: var(--accent); color: #fff; font-size: 1.1rem; font-weight: 600; border: none; border-radius: 6px; padding: 1rem 0; cursor: pointer;">Request Demo</button>
              </div>
            </form>
          </div>
        </div>
        <div class="testimonials" style="display: flex; gap: 1.2rem; flex-wrap: wrap; margin: 2.5rem 0 1.5rem 0;">
          <div class="testimonial" style="background: #fff; border-radius: 8px; padding: 1rem; flex: 1 1 220px; display: flex; align-items: flex-start; gap: 0.8rem; min-width: 220px; max-width: 320px;">
            <img src="https://placehold.co/48x48" alt="Client 1" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
            <div>
              <blockquote style="margin: 0; font-size: 1rem; color: #333;">“Kyle made getting online easy and affordable. Highly recommend!”</blockquote>
              <cite style="display: block; font-size: 0.92rem; color: #888; margin-top: 0.3rem;">– Local Business Owner</cite>
            </div>
          </div>
          <div class="testimonial" style="background: #fff; border-radius: 8px; padding: 1rem; flex: 1 1 220px; display: flex; align-items: flex-start; gap: 0.8rem; min-width: 220px; max-width: 320px;">
            <img src="https://placehold.co/48x48" alt="Client 2" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
            <div>
              <blockquote style="margin: 0; font-size: 1rem; color: #333;">“Fast, friendly, and my site looks amazing. The process was stress-free.”</blockquote>
              <cite style="display: block; font-size: 0.92rem; color: #888; margin-top: 0.3rem;">– Restaurant Owner</cite>
            </div>
          </div>
          <div class="testimonial" style="background: #fff; border-radius: 8px; padding: 1rem; flex: 1 1 220px; display: flex; align-items: flex-start; gap: 0.8rem; min-width: 220px; max-width: 320px;">
            <img src="https://placehold.co/48x48" alt="Client 3" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
            <div>
              <blockquote style="margin: 0; font-size: 1rem; color: #333;">“I love that I can call and get help right away. Real support!”</blockquote>
              <cite style="display: block; font-size: 0.92rem; color: #888; margin-top: 0.3rem;">– Salon Owner</cite>
            </div>
          </div>
        </div>
        <footer style="background: #111; color: #fff; text-align: center; padding: 2rem 2.5rem 1.2rem 2.5rem; margin-top: 2.5rem;">
          <div class="qr-logo-box" style="max-width: 120px; margin: 0 auto 1.2rem auto;">
            <img src="kylemayerdotme.png" alt="Logo" style="width:100%; max-width:120px;">
          </div>
          <div class="guarantee-badge" style="display: inline-block; background: var(--accent); color: #fff; border-radius: 20px; padding: 0.4rem 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">30-Day Satisfaction Guarantee</div>
          <div>Contact: <a href="mailto:kyle@kylemayer.me" style="color:#fff; text-decoration:underline;">kyle@kylemayer.me</a></div>
        </footer>
      </div>
      <style>
        :root {
          --accent: #4682B4;
        }
        .kylemayerme-bg {
          background: #d7dbe3 !important;
          border-radius: 0 0 16px 16px;
          margin: 0 2rem 2rem 2rem;
          padding: 0;
        }
        .sales-portal-content {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        nav.sales-nav {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 24px;
        }
        .sales-nav-link {
          background-color: #fff;
          color: #4682B4;
          border: 2px solid #4682B4;
          padding: 0.75rem 2.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.15s ease-in-out;
          cursor: pointer;
        }
        .sales-nav-link:hover,
        .sales-nav-link:focus,
        .sales-nav-link:active,
        .sales-nav-link.selected {
          background-color: #4682B4;
          color: #fff;
        }
        .hero {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .hero h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.7rem;
        }
        .hero p {
          font-size: 1.15rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .hero .sub-headline {
          font-size: 1.1rem;
          color: #444;
          margin-bottom: 2.2rem;
        }
        @media (max-width: 600px) {
          .hero h1 { font-size: 2.2rem; }
          .contact-form form { grid-template-columns: 1fr !important; }
          .contact-form form input, .contact-form form button { width: 90% !important; }
        }
        .contact-form { margin-top:1.5rem; width: 100%; display: flex; flex-direction: column; align-items: flex-start; }
        .contact-form form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem 1.5rem;
          align-items: center;
          max-width: 500px;
          width: 100%;
        }
        .contact-form form input {
          width: 100%;
          padding: 0.7rem;
          border-radius: 6px;
          border: 1px solid #bbb;
          font-size: 1rem;
        }
        .contact-form form small {
          grid-column: 1 / span 2;
          color: #888;
          margin-bottom: 0.5rem;
        }
        .contact-form form button {
          grid-column: 1 / span 2;
          width: 100%;
          background: var(--accent);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          padding: 0.9rem 0;
          margin-top: 0.2rem;
        }
        #packages-preview {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 2.5rem 0 2rem 0;
          flex-wrap: wrap;
          align-items: center;
        }
        .package-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          padding: 1.5rem;
          width: 280px;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0.3rem;
          text-align: center;
        }
        .package-card .tier {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .package-card .price {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--accent);
        }
        .package-card .desc {
          font-size: 0.95rem;
          color: #444;
          line-height: 1.4;
        }
        @media (max-width: 700px) {
          #packages-preview {
            flex-direction: column;
            align-items: center;
            gap: 0.7rem;
          }
          .package-card {
            width: 90%;
            max-width: 280px;
            height: auto;
            min-height: 180px;
            margin: 0.3rem 0;
          }
        }
        .testimonials {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          margin: 2.5rem 0 1.5rem 0;
        }
        .testimonial {
          background: #fff;
          border-radius: 8px;
          padding: 1rem;
          flex: 1 1 220px;
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          min-width: 220px;
          max-width: 320px;
        }
        .testimonial img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }
        .testimonial blockquote {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }
        .testimonial cite {
          display: block;
          font-size: 0.92rem;
          color: #888;
          margin-top: 0.3rem;
        }
        footer {
          background: #111;
          color: #fff;
          text-align: center;
          padding: 2rem 0 1.2rem 0;
          margin-top: 2.5rem;
        }
        .guarantee-badge {
          display: inline-block;
          background: var(--accent);
          color: #fff;
          border-radius: 20px;
          padding: 0.4rem 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .qr-logo-box {
          max-width: 120px;
          margin: 0 auto 1.2rem auto;
        }
      </style>
    `;
    return;
  }
  
  TAB_CONTENT.innerHTML = `
    <div class="tab-content-inner">
      <div class="tab-content-text">
        <h2>${TAB_NAMES[idx]}</h2>
        <p>This is a placeholder for ${TAB_NAMES[idx]}.<br>Each project tab can have its own unique style and content.</p>
        <p>This is more "placeholder" text for ${TAB_NAMES[idx]}.<br>It can be replaced with actual content later.</p>
        <p>Click the logo to return to the main page.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>
      </div>
      <div class="tab-content-image">
        ${imageHtml}
      </div>
    </div>
  `;
  
  // Update attributes and styles
  TAB_CONTENT.setAttribute('role', 'tabpanel');
  TAB_CONTENT.setAttribute('aria-labelledby', `tab-${idx}`);
  TAB_CONTENT.setAttribute('id', `tab-panel-${idx}`);
  TAB_CONTENT.style.background = bgColor;
  TAB_CONTENT.classList.remove('kylemayerme-bg');
}

// Keyboard navigation for tabs
document.addEventListener('keydown', (e) => {
  if (e.target.classList.contains('tab')) {
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const currentIndex = tabs.indexOf(e.target);
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        if (currentIndex < tabs.length - 1) tabs[currentIndex + 1].focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        if (currentIndex > 0) tabs[currentIndex - 1].focus();
        break;
    }
  }
});

// Add click event listeners for sales-nav-link buttons
document.addEventListener('DOMContentLoaded', () => {
  const salesNavLinks = document.querySelectorAll('.sales-nav-link');
  const demoSection = document.querySelector('#demo-section');
  const packagesSection = document.querySelector('#packages-section');

  if (!demoSection || !packagesSection) return;

  salesNavLinks.forEach(button => {
    button.addEventListener('click', () => {
      // Remove 'selected' class from all buttons
      salesNavLinks.forEach(btn => btn.classList.remove('selected'));
      // Add 'selected' class to clicked button
      button.classList.add('selected');

      // Show/hide sections based on data-target
      const target = button.getAttribute('data-target');
      if (target === '#demo-section') {
        demoSection.style.display = 'block';
        packagesSection.style.display = 'none';
      } else if (target === '#packages-section') {
        demoSection.style.display = 'none';
        packagesSection.style.display = 'block';
      }
    });
  });

  // Initialize visibility
  demoSection.style.display = 'block';
  packagesSection.style.display = 'none';

  // Set 'Get My Free Demo' as selected by default
  const getDemoButton = document.querySelector('.sales-nav-link[data-target="#demo-section"]');
  if (getDemoButton) {
    getDemoButton.classList.add('selected');
  }
});

// Populate dropdown menu
function populateDropdown() {
  if (!TAB_DROPDOWN) return;
  
  TAB_DROPDOWN.innerHTML = TAB_NAMES.map((name, index) => 
    `<option value="${index}"${index === 0 ? ' selected' : ''}>${name}</option>`
  ).join('');
}

// Initialize
renderTabs();
populateDropdown();
selectTab(0);

// Event Listeners
const logoLink = document.getElementById('logo-link');
if (logoLink) {
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    selectTab(0);
    TAB_DROPDOWN.value = '0';
  });
}

if (TAB_DROPDOWN) {
  TAB_DROPDOWN.addEventListener('change', (e) => {
    const selectedIndex = parseInt(e.target.value);
    selectTab(selectedIndex);
  });
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(renderTabs, 150); // Debounce resize events
});
