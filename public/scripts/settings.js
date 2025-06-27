document.addEventListener("DOMContentLoaded", function () {
  function saveToLocalStorage(key, value) {
      localStorage.setItem(key, value);
  }

  function loadFromLocalStorage(key, defaultValue = "") {
      return localStorage.getItem(key) || defaultValue;
  }

  function persistInput(input) {
      if (!input) return;
      const key = input.id;
      input.value = loadFromLocalStorage(key, input.value);
      input.addEventListener("input", () => saveToLocalStorage(key, input.value));
  }

  function persistButton(button, key, value) {
      if (!button) return;
      button.addEventListener("click", () => saveToLocalStorage(key, value));
  }

  persistInput(document.getElementById("tabTitle"));

  const tabForm = document.getElementById("tabForm");
  if (tabForm) {
      tabForm.addEventListener("submit", function (event) {
          event.preventDefault();
          document.title = document.getElementById("tabTitle").value;
          saveToLocalStorage("tabTitle", document.title);
      });
  }

  const resetTab = document.getElementById("resetTab");
  if (resetTab) {
      resetTab.addEventListener("click", function () {
          localStorage.removeItem("tabTitle");
          document.getElementById("tabTitle").value = "";
          document.title = "";
      });
  }

  document.title = loadFromLocalStorage("tabTitle");

  const panicKey = document.getElementById("currentPanicKey");
  if (panicKey) {
      panicKey.textContent = "Current Panic Key: " + loadFromLocalStorage("panicKey", "2");
  }

  window.changePanicKey = function () {
      const newKey = prompt("Enter new Panic Key:");
      if (newKey) {
          saveToLocalStorage("panicKey", newKey);
          if (panicKey) {
              panicKey.textContent = "Current Panic Key: " + newKey;
          }
      }
  };

  function toggleDebugMode() {
      const debugStats = document.getElementById("debugStats");
      if (!debugStats) return;
      debugStats.style.display = debugStats.style.display === "none" ? "block" : "none";
      saveToLocalStorage("debugMode", debugStats.style.display);
  }

  const debugStats = document.getElementById("debugStats");
  if (debugStats) {
      debugStats.style.display = loadFromLocalStorage("debugMode", "none");
  }

  const debugButton = document.querySelector("button[onclick='toggleDebugMode()']");
  if (debugButton) {
      debugButton.addEventListener("click", toggleDebugMode);
  }

  const tabFavicon = document.getElementById("tabFavicon");
  if (tabFavicon) {
      tabFavicon.addEventListener("change", function () {
          const file = tabFavicon.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function (e) {
                  saveToLocalStorage("tabFavicon", e.target.result);
                  updateFavicon(e.target.result);
              };
              reader.readAsDataURL(file);
          }
      });
  }

  function updateFavicon(src) {
      let link = document.querySelector("link[rel='icon']") || document.createElement("link");
      link.rel = "icon";
      link.href = src;
      document.head.appendChild(link);
  }

  const savedFavicon = loadFromLocalStorage("tabFavicon");
  if (savedFavicon) {
      updateFavicon(savedFavicon);
  }

  // Theme Management System
  const themes = {
    default: {
      '--bg-primary': '#121212',
      '--bg-secondary': '#1e1e1e',
      '--bg-tertiary': '#2a2a2a',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b0b0b0',
      '--accent': '#575757',
      '--border': '#444444'
    },
    light: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f5f5f5',
      '--bg-tertiary': '#e0e0e0',
      '--text-primary': '#000000',
      '--text-secondary': '#666666',
      '--accent': '#007bff',
      '--border': '#cccccc'
    },
    blue: {
      '--bg-primary': '#0a1628',
      '--bg-secondary': '#1e2a3a',
      '--bg-tertiary': '#2a3f5f',
      '--text-primary': '#e6f3ff',
      '--text-secondary': '#b3d9ff',
      '--accent': '#4a90e2',
      '--border': '#3a5f8f'
    },
    purple: {
      '--bg-primary': '#1a0d2e',
      '--bg-secondary': '#2e1b3b',
      '--bg-tertiary': '#4a2c5a',
      '--text-primary': '#f0e6ff',
      '--text-secondary': '#d1b3ff',
      '--accent': '#8a2be2',
      '--border': '#6a4c93'
    },
    green: {
      '--bg-primary': '#0d1f0d',
      '--bg-secondary': '#1b2e1b',
      '--bg-tertiary': '#2c4a2c',
      '--text-primary': '#e6ffe6',
      '--text-secondary': '#b3ffb3',
      '--accent': '#2e8b57',
      '--border': '#4a7c59'
    },
    red: {
      '--bg-primary': '#2e0d0d',
      '--bg-secondary': '#3b1b1b',
      '--bg-tertiary': '#5a2c2c',
      '--text-primary': '#ffe6e6',
      '--text-secondary': '#ffb3b3',
      '--accent': '#dc143c',
      '--border': '#8b4a4a'
    }
  };

  function applyTheme(themeName) {
    const theme = themes[themeName];
    if (theme) {
      const root = document.documentElement;
      Object.keys(theme).forEach(property => {
        root.style.setProperty(property, theme[property]);
      });
      
      // Update body styles for immediate visual feedback
      document.body.style.backgroundColor = theme['--bg-primary'];
      document.body.style.color = theme['--text-primary'];
      
      saveToLocalStorage('selectedTheme', themeName);
      updateThemeSelection(themeName);
    }
  }

  function updateThemeSelection(themeName) {
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.remove('selected');
    });
    const selectedOption = document.querySelector(`[data-theme="${themeName}"]`);
    if (selectedOption) {
      selectedOption.classList.add('selected');
    }
  }

  function initializeThemes() {
    // Add CSS variables to document root
    const defaultTheme = themes.default;
    const root = document.documentElement;
    Object.keys(defaultTheme).forEach(property => {
      if (!root.style.getPropertyValue(property)) {
        root.style.setProperty(property, defaultTheme[property]);
      }
    });

    // Load saved theme
    const savedTheme = loadFromLocalStorage('selectedTheme', 'default');
    applyTheme(savedTheme);

    // Add event listeners to theme options
    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', () => {
        const themeName = option.dataset.theme;
        applyTheme(themeName);
      });
    });

    // Add reset theme button listener
    const resetThemeButton = document.getElementById('resetTheme');
    if (resetThemeButton) {
      resetThemeButton.addEventListener('click', () => {
        applyTheme('default');
        alert('Theme reset to default!');
      });
    }
  }

  // Initialize themes when DOM is loaded
  initializeThemes();

  // Export theme functions for global access
  window.applyTheme = applyTheme;
  window.getAvailableThemes = () => Object.keys(themes);
  window.getCurrentTheme = () => loadFromLocalStorage('selectedTheme', 'default');
});