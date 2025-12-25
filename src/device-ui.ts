/**
 * UI Logic for the Device Info section
 */
export function initDeviceUI() {
    console.log('[DeviceUI] Initializing...');
    
    applyTheme();
    loadDeviceInfo();

    // Export functions to global scope
    (window as any).toggleMobileView = () => (window as any).MobileViewManager?.toggle();
    (window as any).loadDeviceInfo = loadDeviceInfo;

    // Listeners
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) loadDeviceInfo();
    });
    window.addEventListener('online', loadDeviceInfo);
    window.addEventListener('offline', loadDeviceInfo);
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (localStorage.getItem('mobileView') === 'true') {
        document.documentElement.classList.add('iphone-mode');
        document.body.classList.add('iphone-view');
        document.getElementById('mobileToggle')?.classList.add('active');
    }
}


function loadDeviceInfo() {
    const ua = navigator.userAgent;

    // Device Type & Icon
    let deviceIcon = '💻';
    let deviceName = 'Desktop';
    let deviceType = 'Stationär dator / حاسوب مكتبي';

    if (/iPhone/i.test(ua)) {
        deviceIcon = '📱';
        deviceName = 'iPhone';
        deviceType = 'Apple Smartphone / هاتف آيفون';
    } else if (/iPad/i.test(ua)) {
        deviceIcon = '📱';
        deviceName = 'iPad';
        deviceType = 'Apple Tablet / جهاز آيباد';
    } else if (/Android/i.test(ua)) {
        if (/Mobile/i.test(ua)) {
            deviceIcon = '📱';
            deviceName = 'Android Phone';
            deviceType = 'Android Smartphone / هاتف أندرويد';
        } else {
            deviceIcon = '📱';
            deviceName = 'Android Tablet';
            deviceType = 'Android Tablet / جهاز لوحي أندرويد';
        }
    } else if (/Macintosh/i.test(ua)) {
        deviceIcon = '💻';
        deviceName = 'Mac';
        deviceType = 'Apple Computer / حاسوب ماك';
    } else if (/Windows/i.test(ua)) {
        deviceIcon = '🖥️';
        deviceName = 'Windows PC';
        deviceType = 'Windows Computer / حاسوب ويندوز';
    } else if (/Linux/i.test(ua)) {
        deviceIcon = '🐧';
        deviceName = 'Linux';
        deviceType = 'Linux Computer / حاسوب لينكس';
    }

    const iconEl = document.getElementById('deviceIcon');
    const nameEl = document.getElementById('deviceName');
    const typeEl = document.getElementById('deviceType');

    if (iconEl) iconEl.textContent = deviceIcon;
    if (nameEl) nameEl.textContent = deviceName;
    if (typeEl) typeEl.textContent = deviceType;

    // Browser
    let browser = 'Unknown';
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Google Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
    else if (/Opera|OPR/i.test(ua)) browser = 'Opera';
    const browserEl = document.getElementById('browserInfo');
    if (browserEl) browserEl.textContent = browser;

    // OS
    let os = 'Unknown';
    if (/Windows NT 10.0/i.test(ua)) {
        os = ua.includes('Win64') ? 'Windows 11/10 (64-bit)' : 'Windows 10';
    } else if (/iPhone OS (\d+)/i.test(ua)) {
        const match = ua.match(/iPhone OS (\d+)/i);
        os = 'iOS ' + (match ? match[1] : '');
    } else if (/Mac OS X/i.test(ua)) os = 'macOS';
    else if (/Android (\d+)/i.test(ua)) {
        const match = ua.match(/Android (\d+)/i);
        os = 'Android ' + (match ? match[1] : '');
    } else if (/Linux/i.test(ua)) os = 'Linux';
    const osEl = document.getElementById('osInfo');
    if (osEl) osEl.textContent = os;

    // Screen
    const w = window.screen.width;
    const h = window.screen.height;
    const screenInfoEl = document.getElementById('screenInfo');
    const screenVisualEl = document.getElementById('screenVisual');
    if (screenInfoEl) screenInfoEl.textContent = `${w} × ${h} px`;
    if (screenVisualEl) screenVisualEl.textContent = `${w}×${h}`;

    // Pixel Ratio
    const ratio = window.devicePixelRatio || 1;
    const ratioEl = document.getElementById('pixelRatio');
    if (ratioEl) ratioEl.textContent = `${ratio}x (${ratio > 1 ? 'Retina' : 'Standard'})`;

    // Battery
    if ('getBattery' in (navigator as any)) {
        (navigator as any).getBattery().then((battery: any) => {
            const card = document.getElementById('batteryCard');
            if (card) card.style.display = 'block';
            updateBattery(battery);
            battery.addEventListener('levelchange', () => updateBattery(battery));
            battery.addEventListener('chargingchange', () => updateBattery(battery));
        });
    }

    // Network
    const online = navigator.onLine;
    const networkDot = document.getElementById('networkDot');
    const networkInfo = document.getElementById('networkInfo');

    if (networkInfo) {
        if (online) {
            networkDot?.classList.remove('offline');
            let connection = 'Online';
            const navConn = (navigator as any).connection;
            if (navConn && navConn.effectiveType) {
                connection += ` (${navConn.effectiveType.toUpperCase()})`;
            }
            networkInfo.textContent = connection;
        } else {
            networkDot?.classList.add('offline');
            networkInfo.textContent = 'Offline';
        }
    }

    // Language
    const lang = navigator.language;
    const langNames: Record<string, string> = {
        'sv': 'Svenska 🇸🇪', 'sv-SE': 'Svenska 🇸🇪',
        'ar': 'العربية 🇸🇦', 'ar-SA': 'العربية 🇸🇦',
        'en': 'English 🇬🇧', 'en-US': 'English 🇺🇸', 'en-GB': 'English 🇬🇧'
    };
    const langEl = document.getElementById('languageInfo');
    if (langEl) langEl.textContent = langNames[lang] || lang;

    // Touch
    const touchEl = document.getElementById('touchInfo');
    if (touchEl) {
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        touchEl.textContent = hasTouch ? '✅ Touch stöds' : '❌ Ingen touch';
        touchEl.className = 'touch-indicator' + (hasTouch ? '' : ' no-touch');
    }

    // Memory
    if ((navigator as any).deviceMemory) {
        const card = document.getElementById('memoryCard');
        if (card) card.style.display = 'block';
        const memEl = document.getElementById('memoryInfo');
        if (memEl) memEl.textContent = `${(navigator as any).deviceMemory} GB RAM`;
    }

    // CPU
    const cores = navigator.hardwareConcurrency || 'Unknown';
    const cpuEl = document.getElementById('cpuInfo');
    if (cpuEl) cpuEl.textContent = cores + (typeof cores === 'number' ? ' kärnor' : '');

    // Advanced Data
    
    // Timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date().getTimezoneOffset();
    const offsetHrs = Math.abs(offset / 60);
    const offsetSign = offset <= 0 ? '+' : '-';
    const tzEl = document.getElementById('timezoneInfo');
    if (tzEl) tzEl.textContent = `${tz} (UTC${offsetSign}${offsetHrs})`;

    // Canvas Fingerprint
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = 200;
            canvas.height = 50;
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(0, 0, 200, 50);
            ctx.fillStyle = '#069';
            ctx.fillText('Canvas Fingerprint 🎨', 2, 15);
            const dataURL = canvas.toDataURL();
            let hash = 0;
            for (let i = 0; i < dataURL.length; i++) {
                hash = ((hash << 5) - hash) + dataURL.charCodeAt(i);
                hash = hash & hash;
            }
            const canvasEl = document.getElementById('canvasInfo');
            if (canvasEl) canvasEl.textContent = Math.abs(hash).toString(16).toUpperCase();
        }
    } catch (e) {}

    // Storage Quota
    if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(estimate => {
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 0;
            const usedMB = (usage / 1024 / 1024).toFixed(2);
            const totalGB = (quota / 1024 / 1024 / 1024).toFixed(2);
            const percent = quota > 0 ? ((usage / quota) * 100).toFixed(1) : 0;
            const storageEl = document.getElementById('storageInfo');
            if (storageEl) storageEl.textContent = `${usedMB} MB / ${totalGB} GB`;
            const fillEl = document.getElementById('storageFill');
            if (fillEl) fillEl.style.width = percent + '%';
        });
    }

    // Timestamp
    const tsEl = document.getElementById('timestamp');
    if (tsEl) tsEl.textContent = new Date().toLocaleString('sv-SE');
}

function updateBattery(battery: any) {
    const level = Math.round(battery.level * 100);
    const charging = battery.charging;

    const fill = document.getElementById('batteryFill');
    const text = document.getElementById('batteryText');
    const icon = document.getElementById('batteryIcon');

    if (fill) {
        fill.style.width = level + '%';
        fill.className = 'battery-fill';
        if (level <= 20) fill.classList.add('low');
        else if (level <= 50) fill.classList.add('medium');
    }
    if (text) text.textContent = level + '%';
    if (icon) icon.textContent = charging ? '⚡' : (level <= 20 ? '🪫' : '🔋');
}
