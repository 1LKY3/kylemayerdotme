const tabCount = 20;
const tabNames = [
  'kylemayer.me',
  'Minecraft',
  ...Array.from({ length: tabCount - 2 }, (_, i) => `Project ${i + 3}`)
];
const tabIcons = [
  '', // No icon for first tab
  'mserver.png', // PNG icon for Minecraft tab
  ...Array(tabCount - 2).fill('')
];
const tabColors = [
  '#b8bec5', // Slightly darker, less blue for kylemayer.me tab main page
  '#b3e5fc',
  '#dee2e6', '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529', '#fff3cd',
  '#ffeeba', '#ffdf7e', '#ffd966', '#ffc107', '#ffb300', '#ff9800', '#ff7043', '#ff5722', '#e57373', '#f06292'
];

// Helper to blend two hex colors
function blendColors(c1, c2, percent) {
  const hex = x => parseInt(x, 16);
  c1 = c1.replace('#', '');
  c2 = c2.replace('#', '');
  const r = Math.round(hex(c1.substring(0,2)) * (1-percent) + hex(c2.substring(0,2)) * percent);
  const g = Math.round(hex(c1.substring(2,4)) * (1-percent) + hex(c2.substring(2,4)) * percent);
  const b = Math.round(hex(c1.substring(4,6)) * (1-percent) + hex(c2.substring(4,6)) * percent);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

const tabsInner = document.getElementById('tabs-inner');
const tabContent = document.getElementById('tab-content');

function renderTabs() {
  tabsInner.innerHTML = '';
  const tabWidth = 110; // Decreased from 160 for a more compact tab look
  const logoHeight = 150; // logo is 150px tall
  const rows = 3;
  const tabsPerRow = Math.ceil(tabNames.length / rows);
  // Responsive overlap: less overlap if more space is available
  const containerWidth = tabsInner.parentElement.offsetWidth || window.innerWidth;
  const minOverlap = 4; // px, minimum overlap (just a slight overlap)
  const maxOverlap = 40; // px, maximum overlap
  let overlap = maxOverlap;
  const totalMinOverlapWidth = tabWidth * tabsPerRow - minOverlap * (tabsPerRow - 1);
  if (containerWidth >= totalMinOverlapWidth) {
    overlap = minOverlap;
  } else {
    // Calculate the overlap needed to fit all tabs
    overlap = Math.min(
      maxOverlap,
      tabWidth - Math.floor((containerWidth - tabWidth) / (tabsPerRow - 1))
    );
  }
  // Calculate vertical gap between rows so tabs fill logo height
  const tabHeight = Math.floor((logoHeight - 2 * 8) / rows); // 8px vertical gap between rows
  const rowGap = Math.floor((logoHeight - tabHeight * rows) / (rows - 1));
  for (let i = 0; i < tabNames.length; i++) {
    const row = Math.floor(i / tabsPerRow);
    const col = i % tabsPerRow;
    const tab = document.createElement('div');
    tab.className = 'tab' + (i === 0 ? ' active' : '');
    if (tabIcons && tabIcons[i]) {
      const icon = document.createElement('img');
      icon.src = tabIcons[i];
      icon.alt = 'Tab Icon';
      icon.className = 'tab-icon';
      tab.appendChild(icon);
    }
    const text = document.createElement('span');
    text.textContent = tabNames[i];
    tab.appendChild(text);
    let activeBg;
    if (i === 1) {
      activeBg = '#b3e5fc';
    } else {
      activeBg = tabColors[i % tabColors.length];
    }
    tab.style.setProperty('--tab-active-bg', activeBg);
    tab.onclick = () => selectTab(i);
    // Positioning
    tab.style.left = (col * (tabWidth - overlap)) + 'px';
    tab.style.top = (row * (tabHeight + rowGap)) + 'px';
    tab.style.width = tabWidth + 'px';
    tab.style.height = tabHeight + 'px';
    // If selected, bring to front and remove overlap
    if (i === document.querySelector('.tab.active') ? Array.from(tabsInner.children).indexOf(document.querySelector('.tab.active')) : 0) {
      tab.style.zIndex = 10;
      tab.style.left = (col * (tabWidth - overlap) + overlap/2) + 'px';
      tab.style.width = (tabWidth + overlap) + 'px';
    }
    tabsInner.appendChild(tab);
  }
  // Set container width and height to fit tabs
  tabsInner.style.minWidth = ((tabsPerRow-1)*(tabWidth-overlap) + tabWidth) + 'px';
  tabsInner.style.height = logoHeight + 'px';
}

function selectTab(idx) {
  document.querySelectorAll('.tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === idx);
  });
  let imageHtml = '';
  if (idx === 1) {
    imageHtml = `<img src="mserver.png" alt="Minecraft Icon" class="main-tab-image" />`;
  }
  let bgColor;
  if (idx === 1) {
    bgColor = '#b3e5fc';
  } else {
    bgColor = tabColors[idx % tabColors.length];
  }
  tabContent.innerHTML = `
    <div class="tab-content-inner">
      <div class="tab-content-text">
        <h2>${tabNames[idx]}</h2>
        <p>This is a placeholder for ${tabNames[idx]}.<br>Each project tab can have its own unique style and content.</p>
        </p>This is more "placeholder" text for ${tabNames[idx]}.<br>It can be replaced with actual content later.</p>
        <p>Click the logo to return to the main page.</p>
      </div>
      <div class="tab-content-image">
        ${imageHtml}
      </div>
    </div>
  `;
  tabContent.style.background = bgColor;
  // Remove the special class for the kylemayer.me tab
  tabContent.classList.remove('kylemayerme-bg');
}

renderTabs();
selectTab(0);

// Make logo link select the 'kylemayer.me' tab
const logoLink = document.getElementById('logo-link');
if (logoLink) {
  logoLink.addEventListener('click', function(e) {
    e.preventDefault();
    selectTab(0);
  });
}
