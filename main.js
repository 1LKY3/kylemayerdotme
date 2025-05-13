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

// Initialize
renderTabs();
selectTab(0);

// Event Listeners
const logoLink = document.getElementById('logo-link');
if (logoLink) {
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    selectTab(0);
  });
}

if (TAB_DROPDOWN) {
  TAB_DROPDOWN.addEventListener('change', (e) => {
    selectTab(parseInt(e.target.value));
  });
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(renderTabs, 150); // Debounce resize events
});
