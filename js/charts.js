/* ==========================================================================
   Society Staff Management System - Custom SVG Chart Engine (Enhanced)
   ========================================================================== */

const ChartEngine = {
  renderAttendanceTrend(containerId, isCompact = false) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const data = [78, 82, 88, 85, 92, 89, 94];
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const width = 320;
    const height = isCompact ? 110 : 140;
    const padding = 20;

    const min = 60;
    const max = 100;

    const points = data.map((val, idx) => {
      const x = padding + (idx * (width - 2 * padding) / (data.length - 1));
      const y = height - padding - ((val - min) / (max - min) * (height - 2 * padding));
      return { x, y, val, label: labels[idx] };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    const svgHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="overflow: visible;">
        <defs>
          <linearGradient id="trendGrad_${Math.random().toString(36).substr(2, 4)}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0F766E" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#0F766E" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border)"/>

        <!-- Area Fill -->
        <path d="${areaD}" fill="url(#trendGrad_${Math.random().toString(36).substr(2, 4)})" />

        <!-- Line Path -->
        <path d="${pathD}" fill="none" stroke="#0F766E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Data Dots -->
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#14B8A6" stroke="#FFFFFF" stroke-width="1.5"/>
          <text x="${p.x}" y="${height - 4}" font-size="9" fill="var(--text-secondary)" text-anchor="middle" font-weight="700">${p.label}</text>
        `).join('')}
      </svg>
    `;

    container.innerHTML = svgHTML;
  },

  renderPayrollBarChart(containerId, isCompact = false) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const items = [
      { dept: 'Sec', val: 3.4, color: '#0F766E' },
      { dept: 'HK', val: 2.8, color: '#14B8A6' },
      { dept: 'Maint', val: 2.5, color: '#F97316' },
      { dept: 'Gdn', val: 1.6, color: '#3B82F6' },
      { dept: 'Adm', val: 2.15, color: '#8B5CF6' }
    ];

    const width = 320;
    const height = isCompact ? 110 : 140;
    const padding = 20;
    const barWidth = 26;

    const maxVal = 4.0;

    const svgHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border)"/>
        ${items.map((item, idx) => {
          const x = padding + 10 + (idx * (width - 2 * padding) / items.length);
          const barHeight = (item.val / maxVal) * (height - 2 * padding);
          const y = height - padding - barHeight;
          return `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="${item.color}" />
            <text x="${x + barWidth/2}" y="${y - 4}" font-size="9" font-weight="700" fill="var(--text-primary)" text-anchor="middle">₹${item.val}L</text>
            <text x="${x + barWidth/2}" y="${height - 4}" font-size="8.5" font-weight="600" fill="var(--text-secondary)" text-anchor="middle">${item.dept}</text>
          `;
        }).join('')}
      </svg>
    `;

    container.innerHTML = svgHTML;
  },

  renderInventoryPie(containerId) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const categories = [
      { name: 'Electrical', pct: 30, color: '#F97316' },
      { name: 'Cleaning', pct: 25, color: '#0F766E' },
      { name: 'Plumbing', pct: 20, color: '#3B82F6' },
      { name: 'Gardening', pct: 15, color: '#22C55E' },
      { name: 'Stationery', pct: 10, color: '#8B5CF6' }
    ];

    const html = `
      <div style="display: flex; align-items: center; justify-content: space-between; height: 100%; padding:4px 0;">
        <div style="position: relative; width: 95px; height: 95px; flex-shrink:0;">
          <svg width="95" height="95" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--surface-subtle)" stroke-width="4"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0F766E" stroke-width="4" stroke-dasharray="30 70" stroke-dashoffset="25"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F97316" stroke-width="4" stroke-dasharray="25 75" stroke-dashoffset="95"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3B82F6" stroke-width="4" stroke-dasharray="20 80" stroke-dashoffset="70"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#22C55E" stroke-width="4" stroke-dasharray="15 85" stroke-dashoffset="50"></circle>
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8B5CF6" stroke-width="4" stroke-dasharray="10 90" stroke-dashoffset="35"></circle>
          </svg>
          <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span style="font-size: 0.9rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-heading);">58</span>
            <span style="font-size: 0.6rem; color: var(--text-secondary); font-weight: 600;">Items</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 3px; font-size: 0.72rem;">
          ${categories.map(c => `
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${c.color};"></span>
              <span style="color: var(--text-secondary); font-weight: 600; width: 68px;">${c.name}</span>
              <span style="font-weight: 700; color: var(--text-primary);">${c.pct}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  renderHourlyAttendanceBar(containerId) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const hours = [
      { time: '07 AM', count: 12 },
      { time: '08 AM', count: 28 },
      { time: '09 AM', count: 41 },
      { time: '10 AM', count: 45 },
      { time: '11 AM', count: 46 }
    ];

    const width = 320;
    const height = 110;
    const padding = 20;

    const svgHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border)"/>
        ${hours.map((h, i) => {
          const x = padding + 12 + (i * (width - 2 * padding) / hours.length);
          const barHeight = (h.count / 50) * (height - 2 * padding);
          const y = height - padding - barHeight;
          return `
            <rect x="${x}" y="${y}" width="28" height="${barHeight}" rx="4" fill="var(--primary)" />
            <text x="${x + 14}" y="${y - 4}" font-size="8.5" font-weight="700" fill="var(--text-primary)" text-anchor="middle">${h.count}</text>
            <text x="${x + 14}" y="${height - 4}" font-size="8" font-weight="600" fill="var(--text-secondary)" text-anchor="middle">${h.time}</text>
          `;
        }).join('')}
      </svg>
    `;
    container.innerHTML = svgHTML;
  }
};
