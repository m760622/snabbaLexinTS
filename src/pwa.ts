/**
 * PWA Service Worker Registration and Management
 * SnabbaLexin - Swedish-Arabic Dictionary
 */

// Define PWA related interfaces
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // Use a more robust way to register the service worker that works well with Vite
      const swUrl = new URL('./sw.ts', import.meta.url);
      const registration = await navigator.serviceWorker.register(swUrl, { type: 'module' });
      console.log("[PWA] ServiceWorker registered with URL:", swUrl.href);

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        
        console.log("[PWA] New service worker installing...");

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New update available
            showUpdatePrompt();
          }
        });
      });
    } catch (error) {
      console.log("[PWA] ServiceWorker registration failed:", error);
    }
  });
}

// Show update prompt when new SW is available
function showUpdatePrompt() {
  const updatePrompt = document.getElementById("updatePrompt");
  if (updatePrompt) {
    updatePrompt.classList.remove("hidden");

    const updateBtn = document.getElementById("updateBtn");
    const dismissBtn = document.getElementById("dismissUpdate");

    if (updateBtn) {
      updateBtn.addEventListener("click", () => {
        // Tell SW to skip waiting and activate
        navigator.serviceWorker.controller?.postMessage({
          type: "SKIP_WAITING",
        });
        window.location.reload();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        updatePrompt.classList.add("hidden");
      });
    }
  }
}

// Handle offline/online status
window.addEventListener("online", () => {
  const offlineBanner = document.getElementById("offlineBanner");
  if (offlineBanner) {
    offlineBanner.classList.add("hidden");
  }
});

window.addEventListener("offline", () => {
  const offlineBanner = document.getElementById("offlineBanner");
  if (offlineBanner) {
    offlineBanner.classList.remove("hidden");
  }
});

// Check initial online status
if (!navigator.onLine) {
  const offlineBanner = document.getElementById("offlineBanner");
  if (offlineBanner) {
    offlineBanner.classList.remove("hidden");
  }
}

// PWA Install Prompt Handler
let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;

  // Show install button or prompt
  const installBtn = document.getElementById("installApp");
  const pwaPrompt = document.getElementById("pwa-install-prompt");

  if (installBtn) {
    installBtn.classList.remove("hidden");
    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("[PWA] User response:", outcome);
        deferredPrompt = null;
        installBtn.classList.add("hidden");
      }
    });
  }

  // Show PWA install prompt after delay
  if (pwaPrompt && !localStorage.getItem("pwa-prompt-dismissed")) {
    setTimeout(() => {
      pwaPrompt.classList.remove("hidden");
    }, 5000);
  }
});

// Handle PWA prompt buttons
document.addEventListener("DOMContentLoaded", () => {
  const pwaInstallBtn = document.getElementById("pwa-install-btn");
  const pwaLaterBtn = document.getElementById("pwa-later-btn");
  const pwaPrompt = document.getElementById("pwa-install-prompt");

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("[PWA] Install prompt outcome:", outcome);
        deferredPrompt = null;
      }
      if (pwaPrompt) pwaPrompt.classList.add("hidden");
    });
  }

  if (pwaLaterBtn) {
    pwaLaterBtn.addEventListener("click", () => {
      if (pwaPrompt) pwaPrompt.classList.add("hidden");
      localStorage.setItem("pwa-prompt-dismissed", "true");
    });
  }
});

// iOS Install Prompt
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isInStandaloneMode =
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as any).standalone;

if (isIOS && !isInStandaloneMode) {
  const iosPrompt = document.getElementById("iosInstallPrompt");
  if (iosPrompt && !localStorage.getItem("ios-prompt-dismissed")) {
    setTimeout(() => {
      iosPrompt.classList.remove("hidden");
    }, 10000);

    const closeBtn = document.getElementById("closeIosPrompt");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        iosPrompt.classList.add("hidden");
        localStorage.setItem("ios-prompt-dismissed", "true");
      });
    }
  }
}

console.log("[PWA] Module loaded");
