/* ==========================================================================
   Society Staff Management System - Router & Screen Renderer (52+ Screens)
   ========================================================================== */

const AppState = {
  currentRole: 'Admin', // Admin, Management, Employee
  currentScreen: 'reports-overview', 
  viewMode: 'single', // single, gallery
  theme: 'light',
  currentTab: 'home',
  activeEmployee: 'EMP-101',
  activeItem: 'INV-01'
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.bindEvents();
    this.updateRoleUI();
    this.renderScreen(AppState.currentScreen);
  },

  bindEvents() {
    // Mode View Switcher (Single Frame vs Gallery Grid)
    document.querySelectorAll('[data-view-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-view-mode');
        this.switchViewMode(mode);
      });
    });

    // Global Role Switcher Top Bar
    const roleSelect = document.getElementById('globalRoleSelect');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        AppState.currentRole = e.target.value;
        this.updateRoleUI();
        
        if (AppState.currentRole === 'Admin') {
          this.renderScreen('admin-dashboard');
        } else if (AppState.currentRole === 'Management') {
          this.renderScreen('mgmt-dashboard');
        } else {
          this.renderScreen('emp-dashboard');
        }

        if (AppState.viewMode === 'gallery') {
          this.renderGalleryGrid();
        }
      });
    }

    // Theme Toggle Button
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', AppState.theme);
        themeBtn.innerHTML = AppState.theme === 'light' 
          ? '<i class="ri-moon-line"></i> Dark Mode' 
          : '<i class="ri-sun-line"></i> Light Mode';
        
        if (AppState.viewMode === 'gallery') {
          this.renderGalleryGrid();
        }
      });
    }
  },

  switchViewMode(mode) {
    AppState.viewMode = mode;
    document.querySelectorAll('[data-view-mode]').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-view-mode="${mode}"]`)?.classList.add('active');

    const singleWrap = document.getElementById('singleDeviceWrapper');
    const galleryWrap = document.getElementById('galleryGridWrapper');

    if (mode === 'single') {
      singleWrap.style.display = 'flex';
      galleryWrap.style.display = 'none';
      this.renderScreen(AppState.currentScreen);
    } else {
      singleWrap.style.display = 'none';
      galleryWrap.style.display = 'block';
      this.renderGalleryGrid();
    }
  },

  updateRoleUI() {
    const user = MockData.userProfiles[AppState.currentRole] || MockData.userProfiles.Admin;

    const nameEl = document.getElementById('headerUserName');
    if (nameEl) nameEl.textContent = user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1] ? user.name.split(' ')[1][0] + '.' : '');

    const avatarEl = document.getElementById('headerUserAvatar');
    if (avatarEl) avatarEl.src = user.avatar;

    const roleBadgeEl = document.getElementById('drawerRoleBadgeText');
    if (roleBadgeEl) roleBadgeEl.textContent = `${user.role} View`;

    const drawerNameEl = document.getElementById('drawerUserName');
    if (drawerNameEl) drawerNameEl.textContent = user.name;

    const drawerAvatarEl = document.getElementById('drawerUserAvatar');
    if (drawerAvatarEl) drawerAvatarEl.src = user.avatar;
  },

  toggleDrawer(open) {
    const overlay = document.getElementById('drawerOverlay');
    if (overlay) {
      if (open) overlay.classList.add('open');
      else overlay.classList.remove('open');
    }
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  },

  renderScreen(screenKey) {
    AppState.currentScreen = screenKey;
    const viewport = document.getElementById('mobileScreenViewport');
    if (!viewport) return;

    // Update screen selector chips highlight
    document.querySelectorAll('.screen-switch-chip').forEach(chip => {
      if (chip.getAttribute('data-screen') === screenKey) {
        chip.classList.add('active');
        chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        chip.classList.remove('active');
      }
    });

    const contentHTML = this.getScreenHTML(screenKey);
    viewport.innerHTML = contentHTML;

    // Post-render dynamic SVG charts in single mode
    if (screenKey === 'admin-dashboard' || screenKey === 'reports-overview') {
      ChartEngine.renderAttendanceTrend('dashAttendanceChart');
    } else if (screenKey === 'payroll-admin' || screenKey === 'report-payroll') {
      ChartEngine.renderPayrollBarChart('payrollDeptChart');
    } else if (screenKey === 'inventory-admin' || screenKey === 'report-inventory') {
      ChartEngine.renderInventoryPie('inventoryPieChart');
    } else if (screenKey === 'report-attendance') {
      ChartEngine.renderHourlyAttendanceBar('attHourlyChart');
    }

    if (screenKey === 'scanner' || screenKey === 'emp-face-verify') {
      this.startScannerSim();
    }
  },

  startScannerSim() {
    let pct = 0;
    const pctEl = document.getElementById('scanConfidencePct');
    const hudStatus = document.getElementById('scanHudStatus');
    const container = document.getElementById('scannerFrameContainer');

    if (!pctEl) return;

    const interval = setInterval(() => {
      pct += Math.floor(Math.random() * 15) + 12;
      if (pct > 99) pct = 99.4;
      pctEl.textContent = `${pct}% Match`;

      if (pct >= 99.4) {
        clearInterval(interval);
        if (hudStatus) {
          hudStatus.innerHTML = '<i class="ri-checkbox-circle-fill" style="color: #22C55E;"></i> AI Identity Verified!';
        }
        if (container) {
          container.style.borderColor = 'var(--success)';
          container.style.boxShadow = '0 0 40px rgba(34, 197, 94, 0.4)';
        }
      }
    }, 180);
  },

  /* ==========================================================================
     Master Screen Templates Engine (52 Screens)
     ========================================================================== */

  getScreenHTML(key) {
    switch (key) {
      // Group 1: Auth & Onboarding
      case 'splash': return this.getSplashScreenHTML();
      case 'welcome': return this.getWelcomeScreenHTML();
      case 'role-select': return this.getRoleSelectHTML();
      case 'login': return this.getLoginScreenHTML();
      case 'register': return this.getRegisterHTML();
      case 'forgot-password': return this.getForgotPasswordHTML();

      // Group 2: AI Face Recognition
      case 'face-reg': return this.getFaceRegistrationHTML();
      case 'face-reg-success': return this.getFaceSuccessHTML();
      case 'scanner': return this.getFaceScannerHTML();

      // Group 3: Admin Module
      case 'admin-dashboard': return this.getAdminDashboardHTML();
      case 'emp-list-admin': return this.getEmployeeListHTML();
      case 'emp-details': return this.getEmployeeDetailsHTML();
      case 'add-emp': return this.getAddEmployeeHTML();
      case 'dept-designation': return this.getDeptDesignationHTML();
      case 'attendance-admin': return this.getAttendanceDashboardHTML();
      case 'payroll-admin': return this.getPayrollDashboardHTML();
      case 'salary-gen': return this.getSalaryGenHTML();
      case 'inventory-admin': return this.getInventoryDashboardHTML();
      case 'settings-admin': return this.getSettingsHTML();

      // Group 4: Management Module
      case 'mgmt-dashboard': return this.getMgmtDashboardHTML();
      case 'mgmt-emp-summary': return this.getMgmtEmpSummaryHTML();
      case 'mgmt-attendance': return this.getMgmtAttendanceHTML();
      case 'mgmt-leave-approval': return this.getLeaveManagementHTML();
      case 'mgmt-late-logs': return this.getMgmtLateLogsHTML();
      case 'mgmt-inventory-stock': return this.getMgmtStockEntryHTML();
      case 'mgmt-vendor': return this.getMgmtVendorHTML();
      case 'mgmt-qr-scanner': return this.getMgmtQRScannerHTML();
      case 'mgmt-announcements': return this.getMgmtAnnouncementsHTML();
      case 'mgmt-reports': return this.getReportsHTML();

      // Group 5: Employee Module
      case 'emp-dashboard': return this.getEmployeeDashboardHTML();
      case 'emp-shift-clock': return this.getEmpShiftClockHTML();
      case 'emp-face-verify': return this.getFaceScannerHTML();
      case 'emp-leave-balance': return this.getEmpLeaveBalanceHTML();
      case 'emp-apply-leave': return this.getEmpApplyLeaveHTML();
      case 'emp-leave-history': return this.getEmpLeaveHistoryHTML();
      case 'emp-salary-summary': return this.getEmpSalarySummaryHTML();
      case 'emp-payslip-pdf': return this.getPayslipHTML();
      case 'emp-notifications': return this.getNotificationsHTML();
      case 'emp-my-profile': return this.getProfileHTML();

      // Group 6: Reports & Analytics (Professional Custom Screens)
      case 'reports-overview': return this.getReportsOverviewHTML();
      case 'report-attendance': return this.getReportAttendanceHTML();
      case 'report-payroll': return this.getReportPayrollHTML();
      case 'report-inventory': return this.getReportInventoryHTML();
      case 'item-details': return this.getItemDetailsHTML();
      case 'holiday-calendar': return this.getHolidayCalendarHTML();

      // Group 7: UI Components & States
      case 'notifications': return this.getNotificationsHTML();
      case 'drawer-view': return this.getDrawerViewHTML();
      case 'dark-mode': return this.getDarkModeShowcaseHTML();
      case 'empty-state': return this.getEmptyStateHTML();
      case 'loading-skeleton': return this.getLoadingSkeletonHTML();
      case 'error-screen': return this.getErrorScreenHTML();
      case 'success-dialog': return this.getSuccessDialogHTML();

      default: return this.getAdminDashboardHTML();
    }
  },

  /* --- 1. Splash Screen --- */
  getSplashScreenHTML() {
    return `
      <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background:linear-gradient(135deg, #0F766E, #090D16); color:#fff; padding:24px;">
        <div class="brand-logo" style="width:76px; height:76px; font-size:2.4rem; margin-bottom:20px; box-shadow: 0 10px 30px rgba(20, 184, 166, 0.4);">S</div>
        <div style="font-family:var(--font-heading); font-size:1.6rem; font-weight:800; margin-bottom:6px;">Society Staff OS</div>
        <div style="font-size:0.85rem; opacity:0.85; margin-bottom:36px; max-width:260px;">Enterprise AI Face Biometrics & Operations Management</div>
        <button class="btn-primary" style="background:#fff; color:var(--primary); font-weight:800;" onclick="App.renderScreen('welcome')">
          Launch Portal <i class="ri-arrow-right-line"></i>
        </button>
      </div>
    `;
  },

  /* --- 2. Onboarding Welcome Screen --- */
  getWelcomeScreenHTML() {
    return `
      <div style="padding:16px 8px; text-align:center;">
        <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400" style="width:100%; height:180px; object-fit:cover; border-radius:var(--radius-lg); margin-bottom:16px;" />
        <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800; margin-bottom:8px;">Smart Society Operations</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5; margin-bottom:24px;">
          Seamless AI Face Attendance, Automated Payroll Slips, Inventory Tracking, and Geofenced Staff Management.
        </div>
        <button class="btn-primary" style="margin-bottom:12px;" onclick="App.renderScreen('role-select')">Select Access Role</button>
        <button class="btn-secondary" onclick="App.renderScreen('login')">Existing User Sign In</button>
      </div>
    `;
  },

  /* --- 3. Choose Role Screen --- */
  getRoleSelectHTML() {
    return `
      <div style="padding:10px;">
        <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800; margin-bottom:4px;">Select Account Role</div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:18px;">Choose your workspace persona:</div>

        <div class="card-solid" style="margin-bottom:12px; cursor:pointer; border:2px solid var(--primary);" onclick="AppState.currentRole='Admin'; App.updateRoleUI(); App.renderScreen('admin-dashboard');">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:44px; height:44px; border-radius:var(--radius-md); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
              <i class="ri-shield-star-line"></i>
            </div>
            <div>
              <div style="font-weight:800; font-size:1rem; color:var(--text-primary);">Society Admin</div>
              <div style="font-size:0.78rem; color:var(--text-secondary);">Full executive control, payroll, and board oversight</div>
            </div>
          </div>
        </div>

        <div class="card-solid" style="margin-bottom:12px; cursor:pointer;" onclick="AppState.currentRole='Management'; App.updateRoleUI(); App.renderScreen('mgmt-dashboard');">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:44px; height:44px; border-radius:var(--radius-md); background:var(--secondary-light); color:var(--secondary); display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
              <i class="ri-briefcase-line"></i>
            </div>
            <div>
              <div style="font-weight:800; font-size:1rem; color:var(--text-primary);">Society Management</div>
              <div style="font-size:0.78rem; color:var(--text-secondary);">Operations, staff roster, leaves & inventory control</div>
            </div>
          </div>
        </div>

        <div class="card-solid" style="cursor:pointer;" onclick="AppState.currentRole='Employee'; App.updateRoleUI(); App.renderScreen('emp-dashboard');">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:44px; height:44px; border-radius:var(--radius-md); background:var(--purple-light); color:var(--purple); display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
              <i class="ri-user-smile-line"></i>
            </div>
            <div>
              <div style="font-weight:800; font-size:1rem; color:var(--text-primary);">Society Employee</div>
              <div style="font-size:0.78rem; color:var(--text-secondary);">Personal shift check-in, leaves & salary slips</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* --- 4. Login Screen --- */
  getLoginScreenHTML() {
    return `
      <div style="padding:10px;">
        <div style="font-family:var(--font-heading); font-size:1.4rem; font-weight:800; margin-bottom:4px;">Portal Sign In</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:20px;">Access your society staff account</div>

        <div class="segment-control">
          <div class="segment-btn active">Email & Password</div>
          <div class="segment-btn">Mobile OTP</div>
        </div>

        <div class="input-group">
          <label class="input-label">Email or Username</label>
          <div class="input-field-wrap">
            <i class="ri-user-line input-icon"></i>
            <input type="text" class="input-control" value="admin@greenwoodheights.org" />
          </div>
        </div>

        <div class="input-group" style="margin-bottom:12px;">
          <label class="input-label">Password</label>
          <div class="input-field-wrap">
            <i class="ri-lock-line input-icon"></i>
            <input type="password" class="input-control" value="••••••••••••" />
          </div>
        </div>

        <div style="text-align:right; margin-bottom:20px;">
          <span style="font-size:0.78rem; font-weight:700; color:var(--primary); cursor:pointer;" onclick="App.renderScreen('forgot-password')">Forgot Password?</span>
        </div>

        <button class="btn-primary" style="margin-bottom:12px;" onclick="App.renderScreen('admin-dashboard')">Sign In to Dashboard</button>
        <button class="btn-secondary" onclick="App.renderScreen('scanner')"><i class="ri-user-scan-line"></i> Quick AI Face Sign In</button>
      </div>
    `;
  },

  /* --- 5. Register Screen --- */
  getRegisterHTML() {
    return `
      <div style="padding:10px;">
        <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800; margin-bottom:4px;">Society Registration</div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:16px;">Set up new housing society workspace</div>

        <div class="input-group">
          <label class="input-label">Society Name</label>
          <input type="text" class="input-control" placeholder="e.g. Greenwood Heights CHS" />
        </div>
        <div class="input-group">
          <label class="input-label">Registration No.</label>
          <input type="text" class="input-control" placeholder="HSG/MUM/2026/102" />
        </div>
        <div class="input-group">
          <label class="input-label">Admin Contact Email</label>
          <input type="email" class="input-control" placeholder="admin@society.org" />
        </div>

        <button class="btn-primary" style="margin-top:10px;" onclick="App.renderScreen('face-reg')">Proceed to Face Setup</button>
      </div>
    `;
  },

  /* --- 6. Forgot Password Screen --- */
  getForgotPasswordHTML() {
    return `
      <div style="padding:10px;">
        <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800; margin-bottom:4px;">Reset Password</div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:18px;">Enter mobile number for security OTP code:</div>

        <div class="input-group">
          <label class="input-label">Registered Phone Number</label>
          <div class="input-field-wrap">
            <i class="ri-phone-line input-icon"></i>
            <input type="tel" class="input-control" value="+91 98200 11223" />
          </div>
        </div>

        <button class="btn-primary" onclick="App.renderScreen('login')">Send Security OTP</button>
      </div>
    `;
  },

  /* --- 7. AI Face Registration Screen --- */
  getFaceRegistrationHTML() {
    return `
      <div style="padding:10px;">
        <div class="section-header">
          <span class="section-title"><i class="ri-user-scan-line" style="color:var(--primary);"></i> AI Face Embedding Setup</span>
          <span class="badge badge-purple">Step 2 of 2</span>
        </div>

        <div class="face-scanner-container">
          <div class="scanner-video-sim">
            <div class="scanner-face-oval" style="border-color:var(--accent);">
              <div class="scanner-laser-line"></div>
            </div>
          </div>
          <div class="scanner-hud">
            <div><i class="ri-scan-2-line"></i> Center face inside oval...</div>
            <span class="badge badge-success">Mesh 128 Points</span>
          </div>
        </div>

        <button class="btn-primary" onclick="App.renderScreen('face-reg-success')">Capture & Store Face Vector</button>
      </div>
    `;
  },

  /* --- 8. AI Face Registration Success --- */
  getFaceSuccessHTML() {
    return `
      <div style="text-align:center; padding:30px 16px;">
        <div style="width:72px; height:72px; border-radius:50%; background:var(--success-light); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:2.5rem; margin:0 auto 16px auto;">
          <i class="ri-checkbox-circle-fill"></i>
        </div>
        <div style="font-family:var(--font-heading); font-size:1.4rem; font-weight:800; margin-bottom:6px;">Face Enrolled Successfully</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:24px;">128-point biometric facial embedding stored with 99.8% precision.</div>

        <button class="btn-primary" onclick="App.renderScreen('admin-dashboard')">Enter Admin Dashboard</button>
      </div>
    `;
  },

  /* --- 9. AI Face Scanner Screen --- */
  getFaceScannerHTML() {
    return `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;" onclick="App.renderScreen('admin-dashboard')">
        <i class="ri-arrow-left-line"></i> <span style="font-size:0.85rem; font-weight:700;">Exit Scanner</span>
      </div>

      <div class="section-header">
        <span class="section-title"><i class="ri-user-scan-line" style="color:var(--primary);"></i> AI Face Verification</span>
        <span class="badge badge-success"><i class="ri-map-pin-user-line"></i> GPS Verified</span>
      </div>

      <div class="face-scanner-container" id="scannerFrameContainer">
        <div class="scanner-video-sim">
          <div class="scanner-face-oval">
            <div class="scanner-laser-line"></div>
          </div>
        </div>
        <div class="scanner-hud">
          <div id="scanHudStatus"><i class="ri-loader-4-line" style="animation:spin 1s infinite linear;"></i> Verifying identity...</div>
          <div style="font-weight:800; color:var(--secondary);" id="scanConfidencePct">0% Match</div>
        </div>
      </div>

      <div class="card-solid" style="margin-bottom:16px;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">GEOFENCE LOCATION VERIFICATION</div>
        <div style="display:flex; align-items:center; gap:10px; font-size:0.85rem;">
          <i class="ri-map-pin-2-fill" style="color:var(--primary); font-size:1.2rem;"></i>
          <div>
            <div style="font-weight:700;">Gate 1 - Main Security Guard Room</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Lat 19.0330° N, Long 73.0297° E (Accuracy: ±2m)</div>
          </div>
        </div>
      </div>

      <button class="btn-primary" onclick="App.renderScreen('success-dialog')">
        <i class="ri-checkbox-circle-line"></i> Confirm & Record Attendance
      </button>
    `;
  },

  /* --- 10. Admin Main Dashboard --- */
  getAdminDashboardHTML() {
    const stats = MockData.dashboardStats;
    return `
      <div class="hero-banner">
        <div class="hero-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; opacity:0.85;">August 07, 2026</span>
            <span class="badge badge-success"><i class="ri-broadcast-line"></i> Live Geofence</span>
          </div>
          <div class="hero-title">Welcome back, ${MockData.userProfiles.Admin.name.split(' ')[0]} 👋</div>
          <div class="hero-subtitle">${MockData.societyInfo.name}</div>
          <button class="hero-action-btn" onclick="App.renderScreen('scanner')">
            <i class="ri-user-scan-line"></i> AI Face Attendance
          </button>
        </div>
      </div>

      <div class="quick-actions-bar">
        <div class="quick-action-pill" onclick="App.renderScreen('scanner')">
          <i class="ri-qr-scan-2-line"></i> Mark Attendance
        </div>
        <div class="quick-action-pill" onclick="App.renderScreen('payroll-admin')">
          <i class="ri-bank-card-line"></i> Generate Salary
        </div>
        <div class="quick-action-pill" onclick="App.renderScreen('emp-list-admin')">
          <i class="ri-user-add-line"></i> Add Staff
        </div>
        <div class="quick-action-pill" onclick="App.renderScreen('inventory-admin')">
          <i class="ri-box-3-line"></i> Issue Stock
        </div>
      </div>

      <div class="section-header">
        <span class="section-title"><i class="ri-dashboard-3-line" style="color:var(--primary);"></i> Staff Overview</span>
        <span class="section-link" onclick="App.renderScreen('emp-list-admin')">View All</span>
      </div>

      <div class="stats-grid">
        <div class="stat-card" style="--accent-color: var(--primary); --accent-bg: var(--primary-light);">
          <div class="stat-header">
            <span class="stat-label">Total Staff</span>
            <div class="stat-icon"><i class="ri-team-line"></i></div>
          </div>
          <div class="stat-value">${stats.totalEmployees}</div>
          <div class="stat-trend up"><i class="ri-arrow-up-line"></i> +4 this month</div>
        </div>

        <div class="stat-card" style="--accent-color: var(--success); --accent-bg: var(--success-light);">
          <div class="stat-header">
            <span class="stat-label">Present Today</span>
            <div class="stat-icon"><i class="ri-user-check-line"></i></div>
          </div>
          <div class="stat-value">${stats.presentToday}</div>
          <div class="stat-trend up"><i class="ri-arrow-up-line"></i> 85.4% Rate</div>
        </div>

        <div class="stat-card" style="--accent-color: var(--danger); --accent-bg: var(--danger-light);">
          <div class="stat-header">
            <span class="stat-label">Absent / Late</span>
            <div class="stat-icon"><i class="ri-user-unfollow-line"></i></div>
          </div>
          <div class="stat-value">${stats.absentToday + stats.lateToday}</div>
          <div class="stat-trend down"><i class="ri-alert-line"></i> 3 Absent, 2 Late</div>
        </div>

        <div class="stat-card" style="--accent-color: var(--warning); --accent-bg: var(--warning-light);">
          <div class="stat-header">
            <span class="stat-label">Pending Leave</span>
            <div class="stat-icon"><i class="ri-calendar-event-line"></i></div>
          </div>
          <div class="stat-value">${stats.pendingLeaveRequests}</div>
          <div class="stat-trend down"><i class="ri-time-line"></i> Requires Review</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="section-header" style="margin-bottom:8px;">
          <span class="section-title"><i class="ri-line-chart-line" style="color:var(--primary);"></i> Attendance Trend</span>
          <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:600;">This Week</span>
        </div>
        <div class="chart-container" id="dashAttendanceChart"></div>
      </div>
    `;
  },

  /* --- 11. Admin Staff Directory --- */
  getEmployeeListHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-team-line" style="color:var(--primary);"></i> Society Staff Directory</span>
        <button class="badge badge-purple" onclick="App.openModal('addEmployeeModal')">+ Add Staff</button>
      </div>

      <div class="input-group" style="margin-bottom:12px;">
        <div class="input-field-wrap">
          <i class="ri-search-line input-icon"></i>
          <input type="text" class="input-control" placeholder="Search by name, role, or phone..." />
        </div>
      </div>

      <div class="employee-grid">
        ${MockData.employees.map(emp => `
          <div class="employee-card" onclick="AppState.activeEmployee = '${emp.id}'; App.renderScreen('emp-details');">
            <img src="${emp.avatar}" class="emp-avatar" />
            <div class="emp-info">
              <div class="emp-name">${emp.name}</div>
              <div class="emp-role">${emp.designation} • ${emp.department}</div>
            </div>
            <div style="text-align:right;">
              <span class="badge ${emp.status === 'Present' ? 'badge-success' : emp.status === 'Late' ? 'badge-warning' : 'badge-danger'}">${emp.status}</span>
              <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary); margin-top:4px;">${emp.salary}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 12. Employee Details Screen --- */
  getEmployeeDetailsHTML() {
    const emp = MockData.employees.find(e => e.id === AppState.activeEmployee) || MockData.employees[0];
    return `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;" onclick="App.renderScreen('emp-list-admin')">
        <i class="ri-arrow-left-line"></i> <span style="font-size:0.85rem; font-weight:700;">Back to Directory</span>
      </div>

      <div class="card-glass" style="margin-bottom:16px; text-align:center; padding:20px 16px;">
        <img src="${emp.avatar}" style="width:76px; height:76px; border-radius:50%; border:3px solid var(--primary); margin-bottom:8px;" />
        <div style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800;">${emp.name}</div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px;">${emp.designation} (${emp.department})</div>
        <span class="badge badge-success"><i class="ri-shield-check-line"></i> Biometric Face Vector Enrolled</span>
      </div>

      <div class="card-solid">
        <div style="display:flex; flex-direction:column; gap:10px; font-size:0.85rem;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Employee ID</span>
            <span style="font-weight:700;">${emp.id}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Phone</span>
            <span style="font-weight:700;">${emp.phone}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Shift</span>
            <span style="font-weight:700;">${emp.shift}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Monthly Base Salary</span>
            <span style="font-weight:700; color:var(--primary);">${emp.salary}</span>
          </div>
        </div>
      </div>
    `;
  },

  /* --- 13. Add Employee Screen --- */
  getAddEmployeeHTML() {
    return `
      <div style="padding:10px;">
        <div class="section-header">
          <span class="section-title"><i class="ri-user-add-line" style="color:var(--primary);"></i> Add Staff Member</span>
        </div>

        <div class="input-group">
          <label class="input-label">Full Name</label>
          <input type="text" class="input-control" value="Ramesh Pawar" />
        </div>
        <div class="input-group">
          <label class="input-label">Department</label>
          <select class="input-control" style="padding-left:14px;">
            <option>Security</option>
            <option>Maintenance</option>
            <option>Housekeeping</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Designation</label>
          <input type="text" class="input-control" value="Head Supervisor" />
        </div>

        <button class="btn-primary" onclick="App.renderScreen('face-reg')">Proceed to Face Scan Setup</button>
      </div>
    `;
  },

  /* --- 14. Departments & Designations Screen --- */
  getDeptDesignationHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-building-4-line" style="color:var(--primary);"></i> Society Departments</span>
      </div>

      <div class="employee-grid">
        ${MockData.departments.map(d => `
          <div class="card-solid" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-weight:800; font-size:0.95rem;">${d.name}</div>
              <div style="font-size:0.78rem; color:var(--text-secondary);">Head: ${d.head}</div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-purple">${d.staffCount} Staff</span>
              <div style="font-size:0.75rem; font-weight:700; color:var(--text-primary); margin-top:2px;">${d.budget}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 15. Admin Attendance Console --- */
  getAttendanceDashboardHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-calendar-check-line" style="color:var(--primary);"></i> Attendance Console</span>
        <button class="btn-primary" style="width:auto; padding:6px 12px; font-size:0.78rem;" onclick="App.renderScreen('scanner')">
          <i class="ri-scan-line"></i> Open Face Scanner
        </button>
      </div>

      <div class="card-glass" style="margin-bottom:16px; text-align:center; padding:16px;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--text-secondary);">TODAY'S ATTENDANCE RATE</div>
        <div style="font-family:var(--font-heading); font-size:2.2rem; font-weight:800; color:var(--success); margin:6px 0;">85.4%</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">41 Present • 3 Absent • 2 Late • 2 On Leave</div>
      </div>

      <div class="employee-grid">
        ${MockData.attendanceLogs.map(log => `
          <div class="card-solid" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-weight:700; font-size:0.9rem;">${log.name}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">${log.gate} • ${log.time}</div>
            </div>
            <span class="badge ${log.status === 'Present' ? 'badge-success' : 'badge-warning'}">${log.status}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 16. Admin Payroll Overview --- */
  getPayrollDashboardHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-bank-card-line" style="color:var(--primary);"></i> Monthly Payroll</span>
        <button class="badge badge-success" onclick="App.renderScreen('emp-payslip-pdf')">View Slips</button>
      </div>

      <div class="card-glass" style="margin-bottom:16px; padding:16px;">
        <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">AUGUST 2026 TOTAL PAYROLL</div>
        <div style="font-family:var(--font-heading); font-size:1.8rem; font-weight:800; color:var(--primary); margin:4px 0;">₹12,45,000</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">42 Staff Paid • 6 Pending Disbursements</div>
      </div>

      <div class="chart-card">
        <div class="section-header" style="margin-bottom:8px;">
          <span class="section-title"><i class="ri-bar-chart-fill" style="color:var(--primary);"></i> Department Payout Breakdown</span>
        </div>
        <div class="chart-container" id="payrollDeptChart"></div>
      </div>
    `;
  },

  /* --- 17. Salary Generation Screen --- */
  getSalaryGenHTML() {
    return `
      <div style="padding:10px;">
        <div class="section-header">
          <span class="section-title"><i class="ri-file-list-3-line" style="color:var(--primary);"></i> Process Monthly Payroll</span>
        </div>

        <div class="card-solid" style="margin-bottom:14px;">
          <div style="font-weight:700; margin-bottom:6px;">Select Payroll Cycle</div>
          <select class="input-control" style="padding-left:14px;">
            <option>August 2026 (Current Cycle)</option>
            <option>July 2026</option>
          </select>
        </div>

        <button class="btn-primary" onclick="App.renderScreen('payroll-admin')">Execute Payout Batch</button>
      </div>
    `;
  },

  /* --- 18. Admin Inventory Screen --- */
  getInventoryDashboardHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-box-3-line" style="color:var(--primary);"></i> Society Inventory & Assets</span>
      </div>

      <div class="chart-card">
        <div class="section-header" style="margin-bottom:8px;">
          <span class="section-title"><i class="ri-pie-chart-line" style="color:var(--primary);"></i> Category Allocation</span>
        </div>
        <div class="chart-container" id="inventoryPieChart"></div>
      </div>

      <div class="employee-grid">
        ${MockData.inventoryItems.map(item => `
          <div class="employee-card" onclick="AppState.activeItem = '${item.id}'; App.renderScreen('item-details');">
            <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
              <i class="ri-tools-line"></i>
            </div>
            <div class="emp-info">
              <div class="emp-name">${item.name}</div>
              <div class="emp-role">${item.category} • ${item.vendor}</div>
            </div>
            <span class="badge ${item.status === 'In Stock' ? 'badge-success' : 'badge-warning'}">${item.stock} ${item.unit}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 19. Admin Settings & Permissions --- */
  getSettingsHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-settings-4-line" style="color:var(--primary);"></i> App Settings & Security</span>
      </div>

      <div class="card-solid" style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; font-size:0.9rem;">Dark Theme</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Toggle UI color scheme</div>
          </div>
          <button class="btn-secondary" style="width:auto; padding:6px 12px;" onclick="document.getElementById('themeToggleBtn').click();">Toggle</button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px;">
          <div>
            <div style="font-weight:700; font-size:0.9rem;">AI Biometrics Geofence</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Enforce facial scans on Gate 1 camera</div>
          </div>
          <span class="badge badge-success">Enabled</span>
        </div>
      </div>
    `;
  },

  /* --- 20. Management Operations Dashboard --- */
  getMgmtDashboardHTML() {
    return `
      <div class="hero-banner" style="background: linear-gradient(135deg, #14B8A6 0%, #0F766E 100%);">
        <div class="hero-content">
          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; opacity:0.9;">Operations Control</div>
          <div class="hero-title">Hello, ${MockData.userProfiles.Management.name.split(' ')[0]} 🛠️</div>
          <div class="hero-subtitle">Facility Operations & Staff Roster</div>
          <button class="hero-action-btn" onclick="App.renderScreen('mgmt-leave-approval')">
            <i class="ri-check-double-line"></i> Review Leave Requests (4)
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card" style="--accent-color: var(--primary);">
          <div class="stat-label">Shift Supervisors</div>
          <div class="stat-value">6 Active</div>
        </div>
        <div class="stat-card" style="--accent-color: var(--warning);">
          <div class="stat-label">Stock Alerts</div>
          <div class="stat-value">3 Reorders</div>
        </div>
      </div>
    `;
  },

  /* --- 21. Management Staff Summary --- */
  getMgmtEmpSummaryHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-user-shared-line" style="color:var(--primary);"></i> Operations Roster</span>
      </div>
      <div class="employee-grid">
        ${MockData.employees.map(e => `
          <div class="card-solid" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700;">${e.name}</div>
              <div style="font-size:0.78rem; color:var(--text-secondary);">${e.designation}</div>
            </div>
            <span class="badge badge-info">${e.shift.split(' ')[0]}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 22. Live Attendance Approval --- */
  getMgmtAttendanceHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-time-line" style="color:var(--primary);"></i> Attendance Logs & Overtime</span>
      </div>
      <div class="employee-grid">
        ${MockData.attendanceLogs.map(l => `
          <div class="card-solid" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700;">${l.name}</div>
              <div style="font-size:0.75rem; color:var(--text-secondary);">${l.time} • ${l.gate}</div>
            </div>
            <button class="btn-primary" style="width:auto; padding:4px 10px; font-size:0.72rem;">Verify Log</button>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 23. Leave Management & Approval --- */
  getLeaveManagementHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-calendar-event-line" style="color:var(--primary);"></i> Pending Leave Requests</span>
      </div>

      <div class="employee-grid">
        ${MockData.leaveRequests.map(req => `
          <div class="card-solid">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:700;">${req.employeeName}</span>
              <span class="badge ${req.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${req.status}</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px;">${req.leaveType} (${req.totalDays} Days) • ${req.startDate}</div>
            ${req.status === 'Pending' ? `
              <div style="display:flex; gap:8px;">
                <button class="btn-primary" style="padding:6px 12px; font-size:0.78rem;">Approve</button>
                <button class="btn-secondary" style="padding:6px 12px; font-size:0.78rem; color:var(--danger);">Reject</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 24. Late Arrivals & AI Verification Logs --- */
  getMgmtLateLogsHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-user-unfollow-line" style="color:var(--warning);"></i> Late Arrival Exceptions</span>
      </div>
      <div class="card-solid">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700;">Ganesh Kadam</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">10:15 AM (75 mins late) • Gate 2</div>
          </div>
          <span class="badge badge-warning">Late Entry</span>
        </div>
      </div>
    `;
  },

  /* --- 25. Stock In / Stock Out Entry --- */
  getMgmtStockEntryHTML() {
    return `
      <div style="padding:10px;">
        <div class="section-header">
          <span class="section-title"><i class="ri-box-3-line" style="color:var(--primary);"></i> Stock Inventory Entry</span>
        </div>
        <div class="input-group">
          <label class="input-label">Select Item</label>
          <select class="input-control" style="padding-left:14px;">
            <option>LED Floodlight 100W</option>
            <option>Floor Cleaner 20L</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Quantity</label>
          <input type="number" class="input-control" value="10" />
        </div>
        <button class="btn-primary" onclick="App.renderScreen('inventory-admin')">Record Stock Movement</button>
      </div>
    `;
  },

  /* --- 26. Vendor Management Screen --- */
  getMgmtVendorHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-store-2-line" style="color:var(--primary);"></i> Approved Society Vendors</span>
      </div>
      <div class="employee-grid">
        ${MockData.vendors.map(v => `
          <div class="card-solid" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700;">${v.name}</div>
              <div style="font-size:0.78rem; color:var(--text-secondary);">${v.category} • ${v.contact}</div>
            </div>
            <span class="badge badge-success">${v.rating}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 27. QR / Barcode Asset Scanner --- */
  getMgmtQRScannerHTML() {
    return `
      <div style="padding:10px; text-align:center;">
        <div class="section-header">
          <span class="section-title"><i class="ri-qr-code-line" style="color:var(--primary);"></i> Asset QR Scanner</span>
        </div>
        <div class="face-scanner-container" style="height:280px;">
          <div style="width:180px; height:180px; border:3px solid var(--primary); border-radius:var(--radius-md); position:relative; box-shadow:0 0 20px var(--primary-glow);"></div>
        </div>
        <button class="btn-primary" onclick="App.renderScreen('item-details')">Simulate QR Code Scan</button>
      </div>
    `;
  },

  /* --- 28. Broadcast Announcements --- */
  getMgmtAnnouncementsHTML() {
    return `
      <div style="padding:10px;">
        <div class="section-header">
          <span class="section-title"><i class="ri-megaphone-line" style="color:var(--primary);"></i> Broadcast Emergency Alert</span>
        </div>
        <div class="input-group">
          <label class="input-label">Notice Title</label>
          <input type="text" class="input-control" value="Water Supply Maintenance Shutdown" />
        </div>
        <div class="input-group">
          <label class="input-label">Announcement Content</label>
          <textarea class="input-control" style="height:80px; padding:10px 14px;">Main pump house maintenance scheduled tomorrow 10:00 AM to 02:00 PM.</textarea>
        </div>
        <button class="btn-primary" onclick="App.renderScreen('notifications')">Broadcast Push Notification</button>
      </div>
    `;
  },

  /* --- 30. Employee Portal Dashboard --- */
  getEmployeeDashboardHTML() {
    const user = MockData.userProfiles.Employee;
    return `
      <div class="hero-banner" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid var(--border);">
        <div style="display:flex; align-items:center; gap:16px;">
          <img src="${user.avatar}" style="width:64px; height:64px; border-radius:50%; border:3px solid var(--secondary);" />
          <div>
            <div style="font-size:0.8rem; text-transform:uppercase; color:var(--secondary); font-weight:700;">Employee Portal</div>
            <div style="font-size:1.2rem; font-weight:800; color:#fff;">${user.name}</div>
            <div style="font-size:0.8rem; opacity:0.8;">${user.designation}</div>
          </div>
        </div>
      </div>

      <div class="card-glass" style="margin-bottom:16px; text-align:center; padding:20px;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">TODAY'S SHIFT STATUS</div>
        <div style="font-family:var(--font-heading); font-size:2rem; font-weight:800; color:var(--primary); margin-bottom:12px;">08:14:32 HRS</div>
        
        <button class="btn-primary" onclick="App.renderScreen('scanner')">
          <i class="ri-user-scan-line"></i> Verify Face Check-Out
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card" style="--accent-color: var(--primary);">
          <div class="stat-label">Annual Leave Balance</div>
          <div class="stat-value">12 / 18</div>
        </div>
        <div class="stat-card" style="--accent-color: var(--purple);" onclick="App.renderScreen('emp-payslip-pdf')">
          <div class="stat-label">Last Payout</div>
          <div class="stat-value">₹28,500</div>
        </div>
      </div>
    `;
  },

  /* --- 31. Shift Clock In/Out Screen --- */
  getEmpShiftClockHTML() {
    return `
      <div style="padding:10px; text-align:center;">
        <div class="section-header">
          <span class="section-title"><i class="ri-time-line" style="color:var(--primary);"></i> Duty Shift Clock</span>
        </div>
        <div class="card-solid" style="padding:24px; margin-bottom:16px;">
          <div style="font-size:0.85rem; color:var(--text-secondary);">DAY SHIFT (GATE 1)</div>
          <div style="font-family:var(--font-heading); font-size:2.4rem; font-weight:800; color:var(--primary); margin:12px 0;">08:00 - 17:00</div>
          <span class="badge badge-success">Clocked In at 08:00 AM</span>
        </div>
        <button class="btn-primary" onclick="App.renderScreen('scanner')">Clock Out with Face Scan</button>
      </div>
    `;
  },

  /* --- 33. Employee Leave Balance Cards --- */
  getEmpLeaveBalanceHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-calendar-event-line" style="color:var(--primary);"></i> My Leave Balances</span>
        <button class="badge badge-purple" onclick="App.renderScreen('emp-apply-leave')">+ Apply</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card" style="--accent-color: var(--primary);">
          <div class="stat-label">Casual Leave</div>
          <div class="stat-value">6 Days</div>
        </div>
        <div class="stat-card" style="--accent-color: var(--danger);">
          <div class="stat-label">Sick Leave</div>
          <div class="stat-value">4 Days</div>
        </div>
      </div>
    `;
  },

  /* --- 34. Apply Leave Form --- */
  getEmpApplyLeaveHTML() {
    return `
      <div style="padding:10px;">
        <div class="section-header">
          <span class="section-title"><i class="ri-edit-box-line" style="color:var(--primary);"></i> Apply for Leave</span>
        </div>
        <div class="input-group">
          <label class="input-label">Leave Type</label>
          <select class="input-control" style="padding-left:14px;">
            <option>Casual Leave</option>
            <option>Sick Leave</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Reason</label>
          <input type="text" class="input-control" placeholder="Brief explanation..." />
        </div>
        <button class="btn-primary" onclick="App.renderScreen('emp-leave-history')">Submit Application</button>
      </div>
    `;
  },

  /* --- 35. Employee Leave History --- */
  getEmpLeaveHistoryHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-history-line" style="color:var(--primary);"></i> My Leave History</span>
      </div>
      <div class="card-solid">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:700;">Casual Leave (3 Days)</span>
          <span class="badge badge-success">Approved</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary);">07 Aug 2026 - 09 Aug 2026</div>
      </div>
    `;
  },

  /* --- 36. Employee Salary Summary --- */
  getEmpSalarySummaryHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-wallet-3-line" style="color:var(--primary);"></i> Salary Payout Records</span>
      </div>
      <div class="card-solid" style="display:flex; justify-content:space-between; align-items:center;" onclick="App.renderScreen('emp-payslip-pdf')">
        <div>
          <div style="font-weight:700;">August 2026 Salary</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Disbursed via Direct Bank Deposit</div>
        </div>
        <span class="badge badge-success">₹28,500</span>
      </div>
    `;
  },

  /* --- 37. Formal Salary Slip PDF Screen --- */
  getPayslipHTML() {
    const user = MockData.userProfiles.Employee;
    return `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;" onclick="App.renderScreen('emp-dashboard')">
        <i class="ri-arrow-left-line"></i> <span style="font-size:0.85rem; font-weight:700;">Back to Dashboard</span>
      </div>

      <div class="card-solid" style="border:2px solid var(--primary-light); padding:20px;">
        <div style="text-align:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:12px;">
          <div style="font-family:var(--font-heading); font-weight:800; font-size:1.05rem; color:var(--primary);">${MockData.societyInfo.name}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Official Salary Slip - August 2026</div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:12px;">
          <div>
            <div style="font-weight:700; color:var(--text-primary);">${user.name}</div>
            <div style="color:var(--text-secondary);">${user.designation}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:700;">Emp ID: ${user.id}</div>
            <div style="color:var(--text-secondary);">Paid: Aug 01, 2026</div>
          </div>
        </div>

        <div style="background:var(--surface-subtle); padding:12px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Basic Pay</span>
            <span style="font-weight:700;">₹18,000</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>HRA Allowance</span>
            <span style="font-weight:700;">₹6,500</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Special Allowance</span>
            <span style="font-weight:700;">₹4,000</span>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border); padding-top:6px; font-weight:800; color:var(--primary);">
            <span>Net Salary Payable</span>
            <span>₹28,500</span>
          </div>
        </div>

        <button class="btn-primary">
          <i class="ri-file-download-line"></i> Download PDF Payslip
        </button>
      </div>
    `;
  },

  /* ==========================================================================
     GROUP 6: PROFESSIONAL REPORTS & ANALYTICS SCREENS
     ========================================================================== */

  /* --- 40. Reports Overview Dashboard --- */
  getReportsOverviewHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-file-chart-line" style="color:var(--primary);"></i> Reports Dashboard</span>
        <span class="badge badge-info"><i class="ri-download-cloud-line"></i> PDF Summary</span>
      </div>

      <!-- Date Range Selector -->
      <div class="segment-control" style="margin-bottom:12px;">
        <div class="segment-btn active">This Month (Aug 2026)</div>
        <div class="segment-btn">Q3 2026</div>
      </div>

      <!-- KPI Overview Grid -->
      <div class="stats-grid" style="margin-bottom:12px;">
        <div class="stat-card" style="--accent-color: var(--primary);">
          <div class="stat-label">Staff Productivity</div>
          <div class="stat-value">94.2%</div>
          <div class="stat-trend up"><i class="ri-arrow-up-line"></i> +2.1% YoY</div>
        </div>
        <div class="stat-card" style="--accent-color: var(--purple);">
          <div class="stat-label">Monthly Payroll</div>
          <div class="stat-value">₹12.45L</div>
          <div class="stat-trend up">Budget Compliant</div>
        </div>
      </div>

      <!-- Main Trend Line Chart -->
      <div class="chart-card" style="margin-bottom:12px;">
        <div class="section-header" style="margin-bottom:6px;">
          <span style="font-size:0.85rem; font-weight:700;">Overall Attendance & Punctuality Trend</span>
        </div>
        <div class="chart-container" id="dashAttendanceChart"></div>
      </div>

      <!-- Module Shortcut Reports Grid -->
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
        <div class="card-solid" style="cursor:pointer;" onclick="App.renderScreen('report-attendance')">
          <i class="ri-calendar-check-line" style="color:var(--primary); font-size:1.4rem;"></i>
          <div style="font-weight:700; font-size:0.85rem; margin-top:4px;">Attendance</div>
          <div style="font-size:0.72rem; color:var(--text-secondary);">85.4% Avg Rate</div>
        </div>

        <div class="card-solid" style="cursor:pointer;" onclick="App.renderScreen('report-payroll')">
          <i class="ri-bank-card-line" style="color:var(--purple); font-size:1.4rem;"></i>
          <div style="font-weight:700; font-size:0.85rem; margin-top:4px;">Payroll Cost</div>
          <div style="font-size:0.72rem; color:var(--text-secondary);">42 Paid / 6 Pending</div>
        </div>
      </div>
    `;
  },

  /* --- 41. Detailed Attendance Analytics --- */
  getReportAttendanceHTML() {
    return `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;" onclick="App.renderScreen('reports-overview')">
        <i class="ri-arrow-left-line"></i> <span style="font-size:0.85rem; font-weight:700;">Back to Analytics</span>
      </div>

      <div class="section-header">
        <span class="section-title"><i class="ri-line-chart-line" style="color:var(--primary);"></i> Attendance Analytics</span>
        <span class="badge badge-success">85.4% Rate</span>
      </div>

      <div class="card-solid" style="margin-bottom:12px; padding:12px;">
        <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">PEAK ARRIVAL TRAFFIC HOURS</div>
        <div class="chart-container" id="attHourlyChart"></div>
      </div>

      <div class="card-solid">
        <div style="font-weight:800; font-size:0.9rem; margin-bottom:8px;">Department Performance Index</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between;">
            <span>Security Supervisor Squad</span>
            <span style="font-weight:700; color:var(--success);">96.2% Present</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Electrical & Plumbing Maintenance</span>
            <span style="font-weight:700; color:var(--success);">92.0% Present</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Housekeeping Facility Staff</span>
            <span style="font-weight:700; color:var(--warning);">88.4% Present</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Garden & Landscape Staff</span>
            <span style="font-weight:700; color:var(--danger);">84.0% Present</span>
          </div>
        </div>
      </div>
    `;
  },

  /* --- 42. Department Cost & Salary Expense Report --- */
  getReportPayrollHTML() {
    return `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;" onclick="App.renderScreen('reports-overview')">
        <i class="ri-arrow-left-line"></i> <span style="font-size:0.85rem; font-weight:700;">Back to Analytics</span>
      </div>

      <div class="section-header">
        <span class="section-title"><i class="ri-money-dollar-circle-line" style="color:var(--purple);"></i> Department Cost Report</span>
      </div>

      <div class="card-glass" style="margin-bottom:12px; padding:16px;">
        <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">AUGUST 2026 TOTAL EXPENDITURE</div>
        <div style="font-family:var(--font-heading); font-size:1.8rem; font-weight:800; color:var(--primary); margin:4px 0;">₹12,45,000</div>
        <div style="font-size:0.75rem; color:var(--success); font-weight:700;"><i class="ri-arrow-down-line"></i> -2.4% Variance vs Allocated Budget</div>
      </div>

      <div class="chart-card">
        <div style="font-weight:700; font-size:0.85rem; margin-bottom:6px;">Department Cost Distribution (₹ Lakhs)</div>
        <div class="chart-container" id="payrollDeptChart"></div>
      </div>
    `;
  },

  /* --- 43. Inventory Asset Usage & Stock Report --- */
  getReportInventoryHTML() {
    return `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;" onclick="App.renderScreen('reports-overview')">
        <i class="ri-arrow-left-line"></i> <span style="font-size:0.85rem; font-weight:700;">Back to Analytics</span>
      </div>

      <div class="section-header">
        <span class="section-title"><i class="ri-pie-chart-line" style="color:var(--accent);"></i> Inventory Stock Report</span>
      </div>

      <div class="card-glass" style="margin-bottom:12px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">TOTAL ASSET VALUATION</div>
            <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:var(--text-primary);">₹18,40,000</div>
          </div>
          <span class="badge badge-warning">3 Low Stock Alerts</span>
        </div>
      </div>

      <div class="chart-card">
        <div style="font-weight:700; font-size:0.85rem; margin-bottom:6px;">Category Allocation Breakdown</div>
        <div class="chart-container" id="inventoryPieChart"></div>
      </div>
    `;
  },

  /* --- 44. Stock Item Details & Movement History --- */
  getItemDetailsHTML() {
    const item = MockData.inventoryItems[0];
    return `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;" onclick="App.renderScreen('report-inventory')">
        <i class="ri-arrow-left-line"></i> <span style="font-size:0.85rem; font-weight:700;">Back to Stock Report</span>
      </div>

      <div class="card-solid" style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
          <div>
            <div style="font-family:var(--font-heading); font-size:1.1rem; font-weight:800;">${item.name}</div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">Code: ${item.id} • Category: ${item.category}</div>
          </div>
          <span class="badge badge-warning">${item.status}</span>
        </div>

        <div style="background:var(--surface-subtle); padding:10px; border-radius:var(--radius-sm); margin:10px 0; font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Current Stock</span>
            <span style="font-weight:800; color:var(--primary);">${item.stock} ${item.unit}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Minimum Reorder Level</span>
            <span style="font-weight:700;">${item.minThreshold} ${item.unit}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Approved Vendor</span>
            <span style="font-weight:700;">${item.vendor}</span>
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn-primary" style="flex:1;"><i class="ri-add-line"></i> Stock In</button>
          <button class="btn-secondary" style="flex:1;"><i class="ri-subtract-line"></i> Issue Item</button>
        </div>
      </div>

      <div class="card-solid">
        <div style="font-weight:800; font-size:0.88rem; margin-bottom:8px;">Recent Movement Log</div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.78rem;">
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-light); padding-bottom:6px;">
            <div>
              <div style="font-weight:700; color:var(--success);">+10 Pcs (Stock In)</div>
              <div style="color:var(--text-secondary);">Purchase Order #PO-882</div>
            </div>
            <span style="color:var(--text-muted);">Aug 02</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <div>
              <div style="font-weight:700; color:var(--danger);">-4 Pcs (Issued)</div>
              <div style="color:var(--text-secondary);">To: Ramesh Pawar (Gate 1)</div>
            </div>
            <span style="color:var(--text-muted);">Aug 05</span>
          </div>
        </div>
      </div>
    `;
  },

  /* --- 45. Society Annual Holiday & Event Calendar --- */
  getHolidayCalendarHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-calendar-2-line" style="color:var(--primary);"></i> 2026 Society Holidays</span>
      </div>
      
      <div class="quick-actions-bar" style="margin-bottom:12px;">
        <span class="quick-action-pill active">All Holidays (${MockData.holidays.length})</span>
        <span class="quick-action-pill">National</span>
        <span class="quick-action-pill">Festivals</span>
      </div>

      <div class="employee-grid">
        ${MockData.holidays.map(h => `
          <div class="card-solid" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:800; font-size:0.92rem;">${h.title}</div>
              <div style="font-size:0.78rem; color:var(--text-secondary);">${h.type}</div>
            </div>
            <span class="badge badge-purple">${h.date}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 46. Notifications Center --- */
  getNotificationsHTML() {
    return `
      <div class="section-header">
        <span class="section-title"><i class="ri-notification-3-line" style="color:var(--primary);"></i> Notifications</span>
      </div>
      <div class="employee-grid">
        ${MockData.notifications.map(n => `
          <div class="card-solid" style="display:flex; gap:12px; align-items:flex-start;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center;">
              <i class="${n.icon}"></i>
            </div>
            <div>
              <div style="font-weight:700; font-size:0.88rem;">${n.title}</div>
              <div style="font-size:0.78rem; color:var(--text-secondary); margin:2px 0;">${n.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* --- 47. Drawer View --- */
  getDrawerViewHTML() {
    return `
      <div class="card-solid" style="background:linear-gradient(135deg, var(--primary), var(--primary-hover)); color:#fff; padding:20px;">
        <div style="font-weight:800; font-size:1.2rem; margin-bottom:4px;">Drawer Navigation Overlay</div>
        <div style="font-size:0.85rem; opacity:0.85; margin-bottom:16px;">Slide-over sidebar navigation panel</div>
        <button class="btn-primary" style="background:#fff; color:var(--primary);" onclick="App.toggleDrawer(true)">Open Drawer Panel</button>
      </div>
    `;
  },

  /* --- 48. Dark Mode Showcase --- */
  getDarkModeShowcaseHTML() {
    return `
      <div class="card-solid" style="text-align:center; padding:24px;">
        <i class="ri-moon-fill" style="font-size:3rem; color:var(--purple); margin-bottom:12px; display:block;"></i>
        <div style="font-weight:800; font-size:1.2rem; margin-bottom:6px;">Dark Mode System Theme</div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:16px;">Sleek slate color palette (#090D16) for dark environments</div>
        <button class="btn-primary" onclick="document.getElementById('themeToggleBtn').click();">Toggle Dark Mode</button>
      </div>
    `;
  },

  /* --- 49. Empty State Screen --- */
  getEmptyStateHTML() {
    return `
      <div style="text-align:center; padding:40px 16px;">
        <i class="ri-inbox-line" style="font-size:3.5rem; color:var(--text-muted); margin-bottom:12px; display:block;"></i>
        <div style="font-weight:800; font-size:1.1rem; margin-bottom:4px;">No Staff Records Found</div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:20px;">No employees match the selected department filter.</div>
        <button class="btn-primary" style="width:auto; padding:8px 16px;" onclick="App.renderScreen('emp-list-admin')">Reset Directory Search</button>
      </div>
    `;
  },

  /* --- 50. Shimmer Loading Skeleton --- */
  getLoadingSkeletonHTML() {
    return `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="skeleton" style="height:140px;"></div>
        <div class="skeleton" style="height:60px;"></div>
        <div class="skeleton" style="height:60px;"></div>
        <div class="skeleton" style="height:60px;"></div>
      </div>
    `;
  },

  /* --- 51. Error / Offline Screen --- */
  getErrorScreenHTML() {
    return `
      <div style="text-align:center; padding:36px 16px;">
        <i class="ri-wifi-off-line" style="font-size:3.5rem; color:var(--danger); margin-bottom:12px; display:block;"></i>
        <div style="font-weight:800; font-size:1.2rem; margin-bottom:4px;">Connection Interrupted</div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:20px;">Geofence server offline. Retrying connection...</div>
        <button class="btn-primary" onclick="App.renderScreen('admin-dashboard')">Retry Connection</button>
      </div>
    `;
  },

  /* --- 52. Success Dialog Screen --- */
  getSuccessDialogHTML() {
    return `
      <div style="text-align:center; padding:36px 16px;">
        <div style="width:72px; height:72px; border-radius:50%; background:var(--success-light); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:2.5rem; margin:0 auto 16px auto;">
          <i class="ri-check-line"></i>
        </div>
        <div style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800; margin-bottom:4px;">Attendance Marked!</div>
        <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:24px;">AI face matched with 99.4% confidence at Gate 1 Guard Room.</div>
        <button class="btn-primary" onclick="App.renderScreen('admin-dashboard')">Back to Dashboard</button>
      </div>
    `;
  },

  /* --- Master Gallery Grid Renderer (ALL 52 SCREENS Categorized with Live SVGs) --- */
  renderGalleryGrid() {
    const grid = document.getElementById('galleryGridWrapper');
    if (!grid) return;

    const screenGroups = [
      {
        category: "Group 1: Authentication & Onboarding (6 Screens)",
        screens: [
          { key: 'splash', title: '1. Splash Screen' },
          { key: 'welcome', title: '2. Onboarding & Features' },
          { key: 'role-select', title: '3. Role Selection Screen' },
          { key: 'login', title: '4. Login (Email / Mobile / OTP)' },
          { key: 'register', title: '5. Account Registration' },
          { key: 'forgot-password', title: '6. Forgot Password Reset' }
        ]
      },
      {
        category: "Group 2: AI Face Biometrics (3 Screens)",
        screens: [
          { key: 'face-reg', title: '7. AI Face Registration Setup' },
          { key: 'face-reg-success', title: '8. AI Face Enrolled Success' },
          { key: 'scanner', title: '9. AI Face Scanner & Geofence Verification' }
        ]
      },
      {
        category: "Group 3: Society Admin Module (10 Screens)",
        screens: [
          { key: 'admin-dashboard', title: '10. Admin Executive Dashboard' },
          { key: 'emp-list-admin', title: '11. Admin Staff Directory' },
          { key: 'emp-details', title: '12. Employee Details & Biometrics' },
          { key: 'add-emp', title: '13. Add Staff Wizard' },
          { key: 'dept-designation', title: '14. Society Departments Structure' },
          { key: 'attendance-admin', title: '15. Admin Attendance Console' },
          { key: 'payroll-admin', title: '16. Admin Monthly Payroll' },
          { key: 'salary-gen', title: '17. Salary Generation Execution' },
          { key: 'inventory-admin', title: '18. Admin Inventory Assets' },
          { key: 'settings-admin', title: '19. Admin Settings & Permissions' }
        ]
      },
      {
        category: "Group 4: Society Management Module (10 Screens)",
        screens: [
          { key: 'mgmt-dashboard', title: '20. Management Operations Dashboard' },
          { key: 'mgmt-emp-summary', title: '21. Staff Roster & Shift Summary' },
          { key: 'mgmt-attendance', title: '22. Live Attendance Log Verifier' },
          { key: 'mgmt-leave-approval', title: '23. Pending Leave Approval Sheet' },
          { key: 'mgmt-late-logs', title: '24. Late Arrivals & Exceptions' },
          { key: 'mgmt-inventory-stock', title: '25. Stock In / Stock Out Entry' },
          { key: 'mgmt-vendor', title: '26. Approved Vendor Management' },
          { key: 'mgmt-qr-scanner', title: '27. Asset QR Scanner View' },
          { key: 'mgmt-announcements', title: '28. Emergency Alerts Broadcast' },
          { key: 'mgmt-reports', title: '29. Management Operations Reports' }
        ]
      },
      {
        category: "Group 5: Society Employee Module (10 Screens)",
        screens: [
          { key: 'emp-dashboard', title: '30. Employee Personal Dashboard' },
          { key: 'emp-shift-clock', title: '31. Duty Shift Clock In/Out' },
          { key: 'emp-face-verify', title: '32. Employee Face Verification' },
          { key: 'emp-leave-balance', title: '33. My Leave Balances' },
          { key: 'emp-apply-leave', title: '34. Apply Leave Application' },
          { key: 'emp-leave-history', title: '35. My Leave History' },
          { key: 'emp-salary-summary', title: '36. Salary Payout History' },
          { key: 'emp-payslip-pdf', title: '37. Formal Payslip PDF Download' },
          { key: 'emp-notifications', title: '38. Employee Alerts' },
          { key: 'emp-my-profile', title: '39. My Profile & Bank Info' }
        ]
      },
      {
        category: "Group 6: Reports & Analytics (6 Screens)",
        screens: [
          { key: 'reports-overview', title: '40. Reports Overview Dashboard' },
          { key: 'report-attendance', title: '41. Attendance Analytics' },
          { key: 'report-payroll', title: '42. Department Cost Report' },
          { key: 'report-inventory', title: '43. Inventory Asset Usage' },
          { key: 'item-details', title: '44. Stock Item Details' },
          { key: 'holiday-calendar', title: '45. Society Holiday Calendar' }
        ]
      },
      {
        category: "Group 7: UI Components & System States (7 Screens)",
        screens: [
          { key: 'notifications', title: '46. Notification Center' },
          { key: 'drawer-view', title: '47. Drawer Navigation Overlay' },
          { key: 'dark-mode', title: '48. Dark Mode Theme View' },
          { key: 'empty-state', title: '49. Empty Data & Search State' },
          { key: 'loading-skeleton', title: '50. Shimmer Loading Skeleton' },
          { key: 'error-screen', title: '51. Network Error / Offline View' },
          { key: 'success-dialog', title: '52. Attendance Marked Success Dialog' }
        ]
      }
    ];

    let fullHTML = '';

    screenGroups.forEach(group => {
      fullHTML += `
        <div style="grid-column: 1 / -1; margin-top:24px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:8px;">
          <h3 style="font-family:var(--font-heading); font-size:1.15rem; font-weight:800; color:var(--secondary);">${group.category}</h3>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px; width:100%;">
          ${group.screens.map(s => `
            <div class="gallery-card">
              <div class="gallery-title">
                <span>${s.title}</span>
                <button class="control-btn" style="padding:4px 8px; font-size:0.72rem;" onclick="App.switchViewMode('single'); App.renderScreen('${s.key}');">Inspect</button>
              </div>
              <div class="gallery-screen-preview" id="gallery_prev_${s.key}"></div>
            </div>
          `).join('')}
        </div>
      `;
    });

    grid.innerHTML = fullHTML;

    // Render snapshot html into each gallery box & mount charts
    screenGroups.forEach(group => {
      group.screens.forEach(s => {
        const prevEl = document.getElementById(`gallery_prev_${s.key}`);
        if (prevEl) {
          const html = this.getScreenHTML(s.key);
          prevEl.innerHTML = `<div style="padding:14px; height:100%; overflow-y:auto;">${html}</div>`;

          // Dynamic Chart Mount in Gallery Previews
          const lineChartEl = prevEl.querySelector('#dashAttendanceChart');
          if (lineChartEl) ChartEngine.renderAttendanceTrend(lineChartEl, true);

          const barChartEl = prevEl.querySelector('#payrollDeptChart');
          if (barChartEl) ChartEngine.renderPayrollBarChart(barChartEl, true);

          const pieChartEl = prevEl.querySelector('#inventoryPieChart');
          if (pieChartEl) ChartEngine.renderInventoryPie(pieChartEl);

          const hourlyChartEl = prevEl.querySelector('#attHourlyChart');
          if (hourlyChartEl) ChartEngine.renderHourlyAttendanceBar(hourlyChartEl);
        }
      });
    });
  }
};
