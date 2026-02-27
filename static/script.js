document.addEventListener("DOMContentLoaded", () => {
    console.log("Kirk Clicker V3 - Loaded");
    
    // ==================== DOM ELEMENTS & STATE ====================
    const elements = {
        kirkButton: document.getElementById('kirkButton'),
        counter: document.getElementById('counter'),
        kpsCounter: document.getElementById('kpsCounter'),
        kpsValue: document.getElementById('kpsValue'),
        upgradesContainer: document.getElementById('upgradesContainer'),
        upgradeTabContent: document.getElementById('upgradeTabContent'),
        upgradeClickCount: document.getElementById('upgradeClickCount'),
        upgradeClickNext: document.getElementById('upgradeClickNext'),
        authStatus: document.getElementById('authStatus'),
        btnSave: document.getElementById('btnSave'),
        btnLoad: document.getElementById('btnLoad'),
        btnExport: document.getElementById('btnExport'),
        btnImport: document.getElementById('btnImport'),
        btnReset: document.getElementById('btnReset'),
        topPanelOverlay: document.getElementById('topPanelOverlay'),
        topPanelTitle: document.getElementById('topPanelTitle'),
        topPanelClose: document.getElementById('topPanelClose'),
        panelSettings: document.getElementById('panelSettings'),
        panelStats: document.getElementById('panelStats'),
        panelInfo: document.getElementById('panelInfo'),
        panelSkins: document.getElementById('panelSkins'),
        topActionButtons: document.querySelectorAll('.top-action-btn[data-panel]'),
        statTotalKirksMade: document.getElementById('statTotalKirksMade'),
        statPlaytime: document.getElementById('statPlaytime'),
        statAutoClickersOwned: document.getElementById('statAutoClickersOwned'),
        statRunTime: document.getElementById('statRunTime'),
        statHandClickedKirks: document.getElementById('statHandClickedKirks'),
        importFile: document.getElementById('importFile'),
        jumpscareOverlay: document.getElementById('jumpscareOverlay'),
        jumpscareAudio: document.getElementById('jumpscareAudio')
    };
    
    // Game state - MINIMAL APPROACH
    let gameState = {
        kirks: 0,
        totalClicks: 0,              // NEW: Track manual clicks
        generalLevel: 0,             // NEW: General upgrade level
        maxGeneralUnlocked: 0,       // NEW: Max general level unlocked by phases
        manualLevel: 0,              // NEW: Manual click upgrade level
        totalKirksMade: 0,           // NEW: Lifetime kirks produced (manual + auto)
        handClickedKirks: 0,         // NEW: Kirks generated from manual clicks
        totalPlaytimeMs: 0,          // NEW: Cumulative playtime
        clickerTierById: {},         // NEW: { erika: 0, debater: 0, ... }
        freeMode: false,
        
        // Phase definitions
        phases: [
            { id: 'phase1', name: 'Personal Circle', start: 0, end: 3 },      // Indices 0-2
            { id: 'phase2', name: 'Online Influence', start: 3, end: 11 },    // Indices 3-10
            { id: 'phase3', name: 'Political Power', start: 11, end: 14 },    // Indices 11-13
            { id: 'phase4', name: 'Institutional Power', start: 14, end: 17 }, // Indices 14-16
            { id: 'phase5', name: 'Abstract/Mythological', start: 17, end: 21 } // Indices 17-20
        ],
        
        upgrades: [
            // Phase 1: Personal Circle (indices 0-2)
            { id: 'erika', name: 'Erika Kirk', desc: 'Generates 2 Kirks/sec', 
              owned: 0, baseCost: 500, cost: 500, perSec: 2, costMult: 1.15, 
              image: 'static/erikakirk.jpeg', unlocked: false },
            
            { id: 'debater', name: 'Master Debater', desc: 'Generates 10 Kirks/sec', 
              owned: 0, baseCost: 7500, cost: 7500, perSec: 10, costMult: 1.15, 
              image: 'static/master debater.jpg', unlocked: false },
            
            { id: 'fetus', name: 'Fetus in Latin', desc: 'Generates 50 Kirks/sec', 
              owned: 0, baseCost: 112500, cost: 112500, perSec: 50, costMult: 1.15, 
              image: 'static/fetus.jpeg', unlocked: false },
            
            // Phase 2: Online Influence (indices 3-10)
            { id: 'woke', name: 'The Woke Left', desc: 'Generates 200 Kirks/sec', 
              owned: 0, baseCost: 1800000, cost: 1800000, perSec: 200, costMult: 1.15, 
              image: 'static/wokeleft.jpeg', unlocked: false },
            
            { id: 'schnapp', name: 'Noah Schnapp', desc: 'Generates 1,000 Kirks/sec', 
              owned: 0, baseCost: 32400000, cost: 32400000, perSec: 1000, costMult: 1.15, 
              image: 'static/noah schnapp.jpg', unlocked: false },
            
            { id: 'owens', name: 'Candace Owens', desc: 'Generates 5,000 Kirks/sec', 
              owned: 0, baseCost: 648000000, cost: 648000000, perSec: 5000, costMult: 1.15, 
              image: 'static/candace owens.jpg', unlocked: false },
            
            { id: 'baby', name: 'Baby No Money', desc: 'Generates 25,000 Kirks/sec', 
              owned: 0, baseCost: 15000000000, cost: 15000000000, perSec: 25000, costMult: 1.15, 
              image: 'static/bbnos.jpg', unlocked: false },
            
            { id: 'shapiro', name: 'Ben Shapiro', desc: 'Generates 100,000 Kirks/sec', 
              owned: 0, baseCost: 375000000000, cost: 375000000000, perSec: 100000, costMult: 1.15, 
              image: 'static/ben shapiro.jpg', unlocked: false },
            
            { id: 'supremacists', name: 'Mexican White Supremacists', desc: 'Generates 500,000 Kirks/sec', 
              owned: 0, baseCost: 10000000000000, cost: 10000000000000, perSec: 500000, costMult: 1.15, 
              image: 'static/white supremacists.jpg', unlocked: false },
            
            { id: 'fuentes', name: 'Nick Fuentes', desc: 'Generates 2,500,000 Kirks/sec', 
              owned: 0, baseCost: 300000000000000, cost: 300000000000000, perSec: 2500000, costMult: 1.15, 
              image: 'static/fuentes.jpg', unlocked: false },
            
            { id: 'trans', name: 'Transgender OnlyFans', desc: 'Generates 10,000,000 Kirks/sec', 
              owned: 0, baseCost: 10000000000000000, cost: 10000000000000000, perSec: 10000000, costMult: 1.15, 
              image: 'static/transfans.jpeg', unlocked: false },
            
            // Phase 3: Political Power (indices 11-13)
            { id: 'ice', name: 'Immigration and Customs Enforcement', desc: 'Generates 50,000,000 Kirks/sec', 
              owned: 0, baseCost: 350000000000000000, cost: 350000000000000000, perSec: 50000000, costMult: 1.15, 
              image: 'static/immigration and customs.jpg', unlocked: false },
            
            { id: 'vance', name: 'JD Vance', desc: 'Generates 250,000,000 Kirks/sec', 
              owned: 0, baseCost: 14000000000000000000, cost: 14000000000000000000, perSec: 250000000, costMult: 1.15, 
              image: 'static/vance.jpeg', unlocked: false },
            
            { id: 'aipac', name: 'AIPAC', desc: 'Generates 1,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 560000000000000000000, cost: 560000000000000000000, perSec: 1250000000, costMult: 1.15, 
              image: 'static/aipac.jpeg', unlocked: false },
            
            // Phase 4: Institutional Power (indices 14-16)
            { id: 'oracle', name: 'Oracle', desc: 'Generates 6,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 25000000000000000000000, cost: 25000000000000000000000, perSec: 6250000000, costMult: 1.15, 
              image: 'static/oracle.jpg', unlocked: false },
            
            { id: 'blackrock', name: 'BlackRock', desc: 'Generates 31,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 1250000000000000000000000, cost: 1250000000000000000000000, perSec: 31250000000, costMult: 1.15, 
              image: 'static/blackrock.jpg', unlocked: false },
            
            { id: 'trump', name: 'Donald Trump', desc: 'Generates 156,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 75000000000000000000000000, cost: 75000000000000000000000000, perSec: 156250000000, costMult: 1.15, 
              image: 'static/trump.jpeg', unlocked: false },
            
            // Phase 5: Abstract/Mythological (indices 17-20)
            { id: 'grok', name: 'Grok', desc: 'Generates 781,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 5000000000000000000000000000, cost: 5000000000000000000000000000, perSec: 781250000000, costMult: 1.15, 
              image: 'static/grok.jpg', unlocked: false },
            
            { id: 'jesus', name: 'Jesus Christ', desc: 'Generates 3,906,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 350000000000000000000000000000000, cost: 350000000000000000000000000000000, perSec: 3906250000000, costMult: 1.15, 
              image: 'static/jesus.gif', unlocked: false },
            
            { id: 'israel', name: 'Israel', desc: 'Generates 19,531,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 28000000000000000000000000000000000, cost: 28000000000000000000000000000000000, perSec: 19531250000000, costMult: 1.15, 
              image: 'static/israel.jpeg', unlocked: false },
            
            { id: 'yakub', name: 'Yakub', desc: 'Generates 97,656,250,000,000 Kirks/sec', 
              owned: 0, baseCost: 2500000000000000000000000000000000000, cost: 2500000000000000000000000000000000000, perSec: 97656250000000, costMult: 1.15, 
              image: 'static/yakub.jpeg', unlocked: false }
        ]
    };

    const CLICKER_BASE_COST = 50;
    const CLICKER_BASE_PER_SEC = 0.5;
    const CLICKER_PHASE1_MULTIPLIER = 6;
    const CLICKER_CPS_STEP_FACTOR = 0.82;
    const CLICKER_COST_MULTIPLIER = 1.18;
    const UPGRADE_COMMON_MULTIPLIER = 4.2;
    const GENERAL_UPGRADE_BASE_COST = 5000;
    const GENERAL_MULTIPLIER_PER_LEVEL = 1.08;
    const MANUAL_UPGRADE_BASE_COST = 2000;
    const CLICKER_TIER_UPGRADE_BASE_FACTOR = 2;
    const CLICKER_TIER_MULTIPLIER = 1.5;
    const EARLY_CLICKER_COUNT = 10;
    const NEXT_UNLOCK_PREVIEW_OWNED = 5;
    const NEXT_UNLOCK_OWNED = 10;
    const PRE_REBIRTH_SOFTCAP_START = 1000000;
    const PRE_REBIRTH_SOFTCAP_EXPONENT = 0.72;

    function formatPerSecondForDesc(value) {
        if (Math.abs(value) >= 1000) return formatNumber(value);
        return formatDecimal(value);
    }

    function rebalanceClickerTiers() {
        function getPhaseIndexForUpgradeIndex(upgradeIndex) {
            for (let i = 0; i < gameState.phases.length; i++) {
                const phase = gameState.phases[i];
                if (upgradeIndex >= phase.start && upgradeIndex < phase.end) {
                    return i;
                }
            }
            return 0;
        }

        function getStepMultiplier(upgradeIndex) {
            const phaseIndex = getPhaseIndexForUpgradeIndex(upgradeIndex);
            const phase = gameState.phases[phaseIndex];
            const indexInPhase = Math.max(0, upgradeIndex - phase.start);

            if (phaseIndex === 0) return CLICKER_PHASE1_MULTIPLIER; // Phase 1: 6x
            if (phaseIndex === 1) return CLICKER_PHASE1_MULTIPLIER + 1; // Phase 2: 7x
            if (phaseIndex === 2) return CLICKER_PHASE1_MULTIPLIER + 2; // Phase 3: 8x
            if (phaseIndex === 3) return CLICKER_PHASE1_MULTIPLIER + 3 + indexInPhase; // Phase 4: 9x, 10x, 11x...
            return CLICKER_PHASE1_MULTIPLIER + 4 + (indexInPhase * 2); // Phase 5: 10x, 12x, 14x...
        }

        let runningCost = CLICKER_BASE_COST;
        let runningPerSec = CLICKER_BASE_PER_SEC;

        gameState.upgrades.forEach((upgrade, index) => {
            if (index > 0) {
                const stepMultiplier = getStepMultiplier(index);
                const cpsStepMultiplier = Math.max(1.05, stepMultiplier * CLICKER_CPS_STEP_FACTOR);
                runningCost = Math.round(runningCost * stepMultiplier);
                runningPerSec = runningPerSec * cpsStepMultiplier;
            }

            upgrade.baseCost = runningCost;
            upgrade.perSec = runningPerSec;
            upgrade.cost = runningCost;
            upgrade.costMult = CLICKER_COST_MULTIPLIER;
            upgrade.desc = `Generates ${formatPerSecondForDesc(upgrade.perSec)} Kirks/sec`;
            upgrade.unlocked = (index === 0);
        });
    }

    rebalanceClickerTiers();
    recomputeUpgradeUnlockStates();
    
    // Initialize clickerTierById for all clickers
    gameState.upgrades.forEach(clicker => {
        gameState.clickerTierById[clicker.id] = 0;
    });
    
    // Save system constants
    const SAVE_KEY_V3 = 'kirkClickerSaveV3';
    const SAVE_KEY_V2 = 'kirkClickerSaveV2'; // Old key for migration
    const SAVE_VERSION = 3;
    
    // Performance-critical: Cached DOM references
    let domCache = {
        buttons: new Map(),
        costSpans: new Map(),
        countSpans: new Map(),
        prodSpans: new Map()
    };
    
    // Performance: Cache upgrade references by ID for O(1) lookup
    const upgradeMap = new Map();
    
    // Auto-save tracking
    let lastAutoSave = Date.now();
    let originalStatusText = '';
    let runStartedAt = Date.now();
    let lastLoopAt = Date.now();
    
    // Rendering control
    let needsRender = false;
    let needsUpgradeTabRender = false;
    
    // KPS tracking
    let lastDisplayedKPS = null;
    let lastKpsPulseAt = 0;
    let lastKpsUpdateTime = 0;
    const KPS_PULSE_INTERVAL = 250;
    const KPS_UPDATE_INTERVAL = 1000;
    const KPS_EPSILON = 1e-6;
    const JUMPSCARE_CHANCE_DENOMINATOR = 1000000;
    const JUMPSCARE_DURATION_MS = 84;
    let jumpscareTimeout = null;
    let jumpscareActive = false;
    let jumpscareHasPlayed = false;
    const MONSTER_CHANCE_DENOMINATOR = 1800;
    const MONSTER_BOOST_MULTIPLIER = 2.2;
    const MONSTER_BOOST_DURATION_MS = 20000;
    const MONSTER_IMAGE_SRC = 'static/460-4605622_transparent-monster-energy-can-png-white-monster-energy.png';
    const AGARTHAN_KIRK_SRC = 'static/agarthan kirk.jpg';
    const AGARTHA_BG_SRC = 'static/agartha.jpg';
    const MONSTER_WHITE_KEY_THRESHOLD = 235;
    let monsterElement = null;
    let monsterImageRuntimeSrc = MONSTER_IMAGE_SRC;
    let boostTimeout = null;
    let boostActiveUntil = 0;
    let originalKirkSrc = '';
    let originalBodyBackgroundImage = '';
    
    // ==================== WOBBLE ANIMATION CONTROL ====================
    function initWobbleControl() {
        if (!elements.kirkButton) return;

        const clearWobble = (e) => {
            if (e.animationName === 'wobble') {
                elements.kirkButton.classList.remove('wobble');
            }
        };

        elements.kirkButton.addEventListener('animationend', clearWobble);
        elements.kirkButton.addEventListener('animationcancel', clearWobble);
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    function formatNumber(num) {
        const suffixes = [
            '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 
            'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod',
            'Vg', 'Uvg', 'Dvg', 'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg',
            'Tg', 'Utg', 'Dtg', 'Ttg', 'Qatg', 'Qitg', 'Sxtg', 'Sptg', 'Octg', 'Notg'
        ];
        
        if (num < 1000) return Math.floor(num).toString();
        
        const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
        
        if (tier >= suffixes.length) {
            return num.toExponential(3);
        }
        
        const suffix = suffixes[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        
        if (scaled < 10) {
            return scaled.toFixed(2).replace(/\.?0+$/, '') + suffix;
        } else if (scaled < 100) {
            return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
        } else {
            return scaled.toFixed(0) + suffix;
        }
    }
    
    function formatDecimal(num) {
        if (num >= 1000) return formatNumber(num);
        if (num >= 100) return num.toFixed(0);
        if (num >= 10) return num.toFixed(1);
        if (num >= 1) return num.toFixed(2);
        if (num >= 0.1) return num.toFixed(3);
        if (num >= 0.01) return num.toFixed(4);
        return num.toFixed(5);
    }

    function formatDuration(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }
    
    function showStatusMessage(message, duration = 1500) {
        if (!elements.authStatus) return;
        
        elements.authStatus.textContent = message;
        
        setTimeout(() => {
            if (elements.authStatus.textContent === message) {
                elements.authStatus.textContent = originalStatusText;
            }
        }, duration);
    }
    
    function updateKPS(force = false) {
        if (!elements.kpsValue || !elements.kpsCounter) return;
        
        const incomePerSecond = calculateIncomePerSecond();
        const now = Date.now();
        
        const valueChanged = lastDisplayedKPS === null || 
                            Math.abs(incomePerSecond - lastDisplayedKPS) > KPS_EPSILON;
        
        if (force || valueChanged) {
            elements.kpsValue.textContent = formatDecimal(incomePerSecond);
            lastDisplayedKPS = incomePerSecond;
        }
        
        let shouldPulse = false;
        
        if (incomePerSecond > 0) {
            if (force) {
                shouldPulse = true;
            } else if (valueChanged) {
                shouldPulse = true;
            } else if (now - lastKpsUpdateTime >= KPS_UPDATE_INTERVAL) {
                shouldPulse = true;
            }
        }
        
        if (shouldPulse && (force || now - lastKpsPulseAt >= KPS_PULSE_INTERVAL)) {
            elements.kpsCounter.classList.add("income-pulse");
            setTimeout(() => {
                if (elements.kpsCounter) {
                    elements.kpsCounter.classList.remove("income-pulse");
                }
            }, 300);
            
            lastKpsPulseAt = now;
            if (!force) {
                lastKpsUpdateTime = now;
            }
        }
    }
    
    function initUpgradeMap() {
        upgradeMap.clear();
        gameState.upgrades.forEach((upgrade, index) => {
            upgradeMap.set(upgrade.id, { upgrade, index });
        });
    }

    function getUpgradeVisibilityState(index) {
        if (index === 0) return 'unlocked';

        const upgrade = gameState.upgrades[index];
        if (upgrade && upgrade.owned > 0) return 'unlocked';

        const previousUpgrade = gameState.upgrades[index - 1];
        if (!previousUpgrade) return 'hidden';

        if (previousUpgrade.owned >= NEXT_UNLOCK_OWNED) return 'unlocked';
        if (previousUpgrade.owned >= NEXT_UNLOCK_PREVIEW_OWNED) return 'preview';
        return 'hidden';
    }

    function isUpgradeFullyUnlocked(index) {
        return getUpgradeVisibilityState(index) === 'unlocked';
    }

    function recomputeUpgradeUnlockStates() {
        gameState.upgrades.forEach((upgrade, index) => {
            upgrade.unlocked = isUpgradeFullyUnlocked(index);
        });
    }

    function applyPreRebirthSoftcap(rawIncomePerSecond) {
        if (rawIncomePerSecond <= PRE_REBIRTH_SOFTCAP_START) return rawIncomePerSecond;
        const overflow = rawIncomePerSecond - PRE_REBIRTH_SOFTCAP_START;
        return PRE_REBIRTH_SOFTCAP_START + Math.pow(overflow, PRE_REBIRTH_SOFTCAP_EXPONENT);
    }
    
    // ==================== MULTIPLIER CALCULATIONS ====================
    
    // General multiplier: GENERAL_MULTIPLIER_PER_LEVEL^generalLevel
    function getGeneralMultiplier() {
        return Math.pow(GENERAL_MULTIPLIER_PER_LEVEL, gameState.generalLevel);
    }
    
    // Manual click value: baseClick * (2^manualLevel) * generalMultiplier
    function getManualClickValue() {
        const manualMultiplier = Math.pow(2, gameState.manualLevel);
        return 1 * manualMultiplier * getGeneralMultiplier() * getMonsterBoostMultiplier();
    }

    function getTotalAutoClickersOwned() {
        return gameState.upgrades.reduce((sum, upgrade) => sum + upgrade.owned, 0);
    }

    function updateStatsPanel() {
        if (elements.statTotalKirksMade) {
            elements.statTotalKirksMade.textContent = formatNumber(gameState.totalKirksMade);
        }
        if (elements.statPlaytime) {
            elements.statPlaytime.textContent = formatDuration(gameState.totalPlaytimeMs);
        }
        if (elements.statAutoClickersOwned) {
            elements.statAutoClickersOwned.textContent = formatNumber(getTotalAutoClickersOwned());
        }
        if (elements.statRunTime) {
            elements.statRunTime.textContent = formatDuration(Date.now() - runStartedAt);
        }
        if (elements.statHandClickedKirks) {
            elements.statHandClickedKirks.textContent = formatNumber(gameState.handClickedKirks);
        }
    }

    function closeTopPanel() {
        if (!elements.topPanelOverlay) return;
        elements.topPanelOverlay.classList.add('hidden');
    }

    function openTopPanel(panelKey) {
        if (!elements.topPanelOverlay) return;

        const panelMap = {
            settings: { title: 'Settings', element: elements.panelSettings },
            stats: { title: 'Stats', element: elements.panelStats },
            info: { title: 'Info', element: elements.panelInfo },
            skins: { title: 'Skins', element: elements.panelSkins }
        };

        const selected = panelMap[panelKey];
        if (!selected) return;

        [elements.panelSettings, elements.panelStats, elements.panelInfo, elements.panelSkins].forEach(panel => {
            if (panel) panel.classList.add('hidden');
        });

        if (elements.topPanelTitle) {
            elements.topPanelTitle.textContent = selected.title;
        }

        if (selected.element) {
            selected.element.classList.remove('hidden');
        }

        if (panelKey === 'stats') {
            updateStatsPanel();
        }

        elements.topPanelOverlay.classList.remove('hidden');
    }

    function setupTopPanels() {
        if (elements.topActionButtons) {
            elements.topActionButtons.forEach(button => {
                button.addEventListener('click', () => openTopPanel(button.dataset.panel));
            });
        }

        if (elements.topPanelClose) {
            elements.topPanelClose.addEventListener('click', closeTopPanel);
        }

        if (elements.topPanelOverlay) {
            elements.topPanelOverlay.addEventListener('click', (event) => {
                if (event.target === elements.topPanelOverlay) {
                    closeTopPanel();
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeTopPanel();
            }
        });
    }
    
    // Clicker production: owned * perSec * (tier multiplier) * generalMultiplier
    function getClickerProduction(clickerId) {
        const cached = upgradeMap.get(clickerId);
        if (!cached) return 0;
        
        const clicker = cached.upgrade;
        const tier = gameState.clickerTierById[clickerId] || 0;
        const tierMultiplier = Math.pow(CLICKER_TIER_MULTIPLIER, tier);
        
        return clicker.owned * clicker.perSec * tierMultiplier * getGeneralMultiplier() * getMonsterBoostMultiplier();
    }
    
    // Total income per second
    function calculateIncomePerSecond() {
        let total = 0;
        gameState.upgrades.forEach(clicker => {
            total += getClickerProduction(clicker.id);
        });
        return applyPreRebirthSoftcap(total);
    }
    
    // ==================== UPGRADE COST CALCULATIONS ====================
    
    function getScaledUpgradeCost(baseCost, level) {
        return Math.floor(baseCost * Math.pow(UPGRADE_COMMON_MULTIPLIER, level));
    }

    function hideJumpscare() {
        if (!elements.jumpscareOverlay) return;

        elements.jumpscareOverlay.classList.remove('active');
        elements.jumpscareOverlay.setAttribute('aria-hidden', 'true');
        if (elements.jumpscareAudio) {
            try {
                elements.jumpscareAudio.pause();
                elements.jumpscareAudio.currentTime = 0;
            } catch (error) {
                console.log('Jumpscare audio stop failed:', error);
            }
        }
        jumpscareActive = false;
    }

    function getMonsterBoostMultiplier() {
        return Date.now() < boostActiveUntil ? MONSTER_BOOST_MULTIPLIER : 1;
    }

    function cacheOriginalVisualState() {
        if (!originalKirkSrc && elements.kirkButton) {
            originalKirkSrc = elements.kirkButton.getAttribute('src') || 'static/kirk.jpg';
        }

        if (!originalBodyBackgroundImage) {
            originalBodyBackgroundImage = window.getComputedStyle(document.body).backgroundImage || '';
        }
    }

    function updateAllProductionDisplays() {
        gameState.upgrades.forEach(clicker => {
            const prodSpan = domCache.prodSpans.get(clicker.id);
            if (prodSpan) {
                prodSpan.textContent = formatNumber(getClickerProduction(clicker.id));
            }
        });
    }

    function applyAgarthaVisuals() {
        cacheOriginalVisualState();

        if (elements.kirkButton) {
            elements.kirkButton.src = AGARTHAN_KIRK_SRC;
        }

        document.body.style.backgroundImage = `url('${AGARTHA_BG_SRC}')`;
    }

    function restoreOriginalVisuals() {
        if (elements.kirkButton && originalKirkSrc) {
            elements.kirkButton.src = originalKirkSrc;
        }

        if (originalBodyBackgroundImage) {
            document.body.style.backgroundImage = originalBodyBackgroundImage;
        } else {
            document.body.style.removeProperty('background-image');
        }
    }

    function clearMonster() {
        if (!monsterElement) return;
        monsterElement.remove();
        monsterElement = null;
    }

    function endMonsterBoost() {
        boostActiveUntil = 0;
        if (boostTimeout) {
            clearTimeout(boostTimeout);
            boostTimeout = null;
        }

        restoreOriginalVisuals();
        updateAllProductionDisplays();
        updateKPS(true);
    }

    function activateMonsterBoost() {
        boostActiveUntil = Date.now() + MONSTER_BOOST_DURATION_MS;
        if (boostTimeout) {
            clearTimeout(boostTimeout);
        }

        clearMonster();
        applyAgarthaVisuals();
        updateAllProductionDisplays();
        updateKPS(true);
        showStatusMessage(`Agartha Boost x${MONSTER_BOOST_MULTIPLIER.toFixed(1)} (${Math.round(MONSTER_BOOST_DURATION_MS / 1000)}s)`, 1800);

        boostTimeout = setTimeout(endMonsterBoost, MONSTER_BOOST_DURATION_MS);
    }

    function spawnWhiteMonster(force = false) {
        if (monsterElement) return;
        if (!force && Math.floor(Math.random() * MONSTER_CHANCE_DENOMINATOR) !== 0) return;

        const size = 120;
        const maxX = Math.max(0, window.innerWidth - size);
        const maxY = Math.max(0, window.innerHeight - size);
        const x = Math.floor(Math.random() * (maxX + 1));
        const y = Math.floor(Math.random() * (maxY + 1));

        const monster = document.createElement('img');
        monster.className = 'white-monster';
        monster.src = monsterImageRuntimeSrc;
        monster.alt = 'White Monster';
        monster.style.left = `${x}px`;
        monster.style.top = `${y}px`;
        monster.addEventListener('click', activateMonsterBoost, { once: true });

        document.body.appendChild(monster);
        if (typeof monster.animate === 'function') {
            monster.animate(
                [
                    { transform: 'rotate(0deg) scale(1)' },
                    { transform: 'rotate(-10deg) scale(1.06)' },
                    { transform: 'rotate(10deg) scale(1.06)' },
                    { transform: 'rotate(-8deg) scale(1.04)' },
                    { transform: 'rotate(8deg) scale(1.04)' },
                    { transform: 'rotate(0deg) scale(1)' }
                ],
                {
                    duration: 700,
                    easing: 'ease-in-out',
                    iterations: Infinity
                }
            );
        }
        monsterElement = monster;
    }

    function setupMonsterAdminHotkey() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.altKey && event.key.toLowerCase() === 'm') {
                event.preventDefault();
                spawnWhiteMonster(true);
            }
        });
    }

    function prepareMonsterImageTransparency() {
        const sourceImage = new Image();
        sourceImage.src = MONSTER_IMAGE_SRC;
        sourceImage.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = sourceImage.naturalWidth || sourceImage.width;
                canvas.height = sourceImage.naturalHeight || sourceImage.height;

                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (!ctx) return;

                ctx.drawImage(sourceImage, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];

                    // Remove white/near-white matte background.
                    if (r >= MONSTER_WHITE_KEY_THRESHOLD && g >= MONSTER_WHITE_KEY_THRESHOLD && b >= MONSTER_WHITE_KEY_THRESHOLD) {
                        pixels[i + 3] = 0;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                monsterImageRuntimeSrc = canvas.toDataURL('image/png');
            } catch (error) {
                console.log('Monster transparency prep failed:', error);
            }
        };
        sourceImage.onerror = () => {
            console.log('Monster image load failed; using original source.');
        };
    }

    function playJumpscare(force = false) {
        if (!elements.jumpscareOverlay) return;
        if (jumpscareHasPlayed) return;
        if (jumpscareActive && !force) return;

        if (jumpscareTimeout) {
            clearTimeout(jumpscareTimeout);
            jumpscareTimeout = null;
        }

        jumpscareActive = true;
        elements.jumpscareOverlay.classList.add('active');
        elements.jumpscareOverlay.setAttribute('aria-hidden', 'false');

        if (elements.jumpscareAudio) {
            try {
                elements.jumpscareAudio.currentTime = 0;
                const playPromise = elements.jumpscareAudio.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {});
                }
            } catch (error) {
                console.log('Jumpscare audio failed:', error);
            }
        }

        jumpscareTimeout = setTimeout(hideJumpscare, JUMPSCARE_DURATION_MS);
        jumpscareHasPlayed = true;
    }

    function maybeTriggerRandomJumpscare() {
        // 1-in-1,000,000 chance each second.
        if (Math.floor(Math.random() * JUMPSCARE_CHANCE_DENOMINATOR) === 0) {
            playJumpscare();
        }
    }

    function setupJumpscareHotkey() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.altKey && event.key.toLowerCase() === 'j') {
                event.preventDefault();
                playJumpscare(true);
            }
        });
    }

    // General upgrade cost: base * (UPGRADE_COMMON_MULTIPLIER^level)
    function getGeneralUpgradeCost() {
        return getScaledUpgradeCost(GENERAL_UPGRADE_BASE_COST, gameState.generalLevel);
    }
    
    // Manual upgrade cost: base * (UPGRADE_COMMON_MULTIPLIER^level)
    function getManualUpgradeCost() {
        return getScaledUpgradeCost(MANUAL_UPGRADE_BASE_COST, gameState.manualLevel);
    }
    
    // Clicker tier cost: based on current building cost (not static base) and scaled by common multiplier
    function getClickerTierCost(clickerId) {
        const cached = upgradeMap.get(clickerId);
        if (!cached) return Infinity;
        
        const clicker = cached.upgrade;
        const tier = gameState.clickerTierById[clickerId] || 0;
        const tierBaseCost = clicker.cost * CLICKER_TIER_UPGRADE_BASE_FACTOR;

        return getScaledUpgradeCost(tierBaseCost, tier + 1);
    }

    function getClickerTierRequiredOwned(clickerId, nextTier) {
        const cached = upgradeMap.get(clickerId);
        if (!cached) return nextTier * 50;

        // First 10 clickers: tiers unlock at 25, 50, 100, 150...
        if (cached.index < EARLY_CLICKER_COUNT) {
            if (nextTier === 1) return 25;
            if (nextTier === 2) return 50;
            return (nextTier - 1) * 50;
        }

        return nextTier * 50;
    }
    
    // ==================== UPGRADE AVAILABILITY CHECKS ====================
    
    // Check if general upgrade is available
    function isGeneralUpgradeAvailable() {
        return gameState.generalLevel < gameState.maxGeneralUnlocked;
    }
    
    // Check if manual upgrade is available
    function isManualUpgradeAvailable() {
        const requiredClicks = (gameState.manualLevel + 1) * 1000;
        return gameState.totalClicks >= requiredClicks;
    }
    
    // Get list of clickers with available tier upgrades
    function getAvailableClickerTierUpgrades() {
        const available = [];
        
        gameState.upgrades.forEach((clicker, index) => {
            if (!isUpgradeFullyUnlocked(index)) return;
            
            const tier = gameState.clickerTierById[clicker.id] || 0;
            const requiredOwned = getClickerTierRequiredOwned(clicker.id, tier + 1);
            
            if (clicker.owned >= requiredOwned) {
                available.push({
                    id: clicker.id,
                    name: clicker.name,
                    tier: tier + 1,
                    requiredOwned: requiredOwned,
                    cost: getClickerTierCost(clicker.id)
                });
            }
        });
        
        return available;
    }
    
    // ==================== PHASE DETECTION ====================
    
    // Detect highest phase reached based on owned clickers
    function getHighestPhaseReached() {
        let highestPhase = 0;
        
        gameState.phases.forEach((phase, index) => {
            // Check if any clicker in this phase is owned
            for (let i = phase.start; i < phase.end; i++) {
                if (gameState.upgrades[i].owned > 0) {
                    highestPhase = Math.max(highestPhase, index);
                    break;
                }
            }
        });
        
        return highestPhase;
    }
    
    // Update max general unlocked based on phases
    function updateMaxGeneralUnlocked() {
        const highestPhase = getHighestPhaseReached();
        gameState.maxGeneralUnlocked = highestPhase + 1; // Phase 0 unlocks 1 general, etc.
    }
    
    // ==================== SAVE SYSTEM ====================
    
    function getSaveData() {
        return {
            version: SAVE_VERSION,
            kirks: gameState.kirks,
            totalClicks: gameState.totalClicks,
            generalLevel: gameState.generalLevel,
            maxGeneralUnlocked: gameState.maxGeneralUnlocked,
            manualLevel: gameState.manualLevel,
            totalKirksMade: gameState.totalKirksMade,
            handClickedKirks: gameState.handClickedKirks,
            totalPlaytimeMs: gameState.totalPlaytimeMs,
            clickerTierById: gameState.clickerTierById,
            upgrades: gameState.upgrades.map(upgrade => ({
                id: upgrade.id,
                owned: upgrade.owned,
                cost: upgrade.cost
            }))
        };
    }
    
    function saveToLocalStorage() {
        try {
            const saveData = getSaveData();
            localStorage.setItem(SAVE_KEY_V3, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Failed to save:', error);
            return false;
        }
    }
    
    function loadFromLocalStorage() {
        try {
            // Try V3 first
            let saved = localStorage.getItem(SAVE_KEY_V3);
            let saveData = null;
            
            if (saved) {
                saveData = JSON.parse(saved);
            } else {
                // Migrate from V2
                saved = localStorage.getItem(SAVE_KEY_V2);
                if (saved) {
                    const v2Data = JSON.parse(saved);
                    
                    // Convert V2 to V3 format
                    saveData = {
                        version: SAVE_VERSION,
                        kirks: v2Data.kirks || 0,
                        totalClicks: 0,
                        generalLevel: 0,
                        maxGeneralUnlocked: 0,
                        manualLevel: 0,
                        totalKirksMade: v2Data.kirks || 0,
                        handClickedKirks: 0,
                        totalPlaytimeMs: 0,
                        clickerTierById: {},
                        upgrades: v2Data.upgrades || []
                    };
                    
                    // Initialize all clicker tiers to 0
                    gameState.upgrades.forEach(clicker => {
                        saveData.clickerTierById[clicker.id] = 0;
                    });
                    
                    console.log('Migrated from V2 to V3');
                }
            }
            
            if (!saveData || typeof saveData !== 'object') return null;
            
            const version = saveData.version || 1;
            if (version > SAVE_VERSION) {
                showStatusMessage(`Save v${version} too new (v${SAVE_VERSION} max)`);
                return null;
            }
            
            if (typeof saveData.kirks !== 'number') return null;
            if (!Array.isArray(saveData.upgrades)) return null;
            
            saveData.version = SAVE_VERSION;
            
            return saveData;
        } catch (error) {
            console.error('Failed to load:', error);
            return null;
        }
    }
    
    function applySave(saveData) {
        if (!saveData) return;
        const firstClickerId = gameState.upgrades[0] ? gameState.upgrades[0].id : null;
        
        gameState.kirks = Number.isFinite(saveData.kirks) ? saveData.kirks : 0;
        gameState.totalClicks = Number.isFinite(saveData.totalClicks) ? saveData.totalClicks : 0;
        gameState.generalLevel = Number.isFinite(saveData.generalLevel) ? saveData.generalLevel : 0;
        gameState.maxGeneralUnlocked = Number.isFinite(saveData.maxGeneralUnlocked) ? saveData.maxGeneralUnlocked : 0;
        gameState.manualLevel = Number.isFinite(saveData.manualLevel) ? saveData.manualLevel : 0;
        gameState.totalKirksMade = Number.isFinite(saveData.totalKirksMade) ? Math.max(0, saveData.totalKirksMade) : Math.max(0, gameState.kirks);
        gameState.handClickedKirks = Number.isFinite(saveData.handClickedKirks) ? Math.max(0, saveData.handClickedKirks) : 0;
        gameState.totalPlaytimeMs = Number.isFinite(saveData.totalPlaytimeMs) ? Math.max(0, saveData.totalPlaytimeMs) : 0;
        
        // Load clicker tiers
        if (saveData.clickerTierById && typeof saveData.clickerTierById === 'object') {
            gameState.clickerTierById = { ...saveData.clickerTierById };

            if (
                firstClickerId &&
                Number.isFinite(saveData.clickerTierById.tyler) &&
                !Number.isFinite(saveData.clickerTierById[firstClickerId])
            ) {
                gameState.clickerTierById[firstClickerId] = Math.max(0, saveData.clickerTierById.tyler);
            }
        }
        
        // Ensure all clickers have a tier entry
        gameState.upgrades.forEach(clicker => {
            if (!(clicker.id in gameState.clickerTierById)) {
                gameState.clickerTierById[clicker.id] = 0;
            }
        });
        
        // Reset all upgrades first
        gameState.upgrades.forEach(upgrade => {
            upgrade.owned = 0;
            upgrade.cost = upgrade.baseCost;
            upgrade.unlocked = false;
        });
        
        // Apply saved upgrades
        if (saveData.upgrades && Array.isArray(saveData.upgrades)) {
            saveData.upgrades.forEach(savedUpgrade => {
                const targetId = savedUpgrade.id === 'tyler' && firstClickerId ? firstClickerId : savedUpgrade.id;
                const cached = upgradeMap.get(targetId);
                if (cached) {
                    const upgrade = cached.upgrade;

                    if (savedUpgrade.id === 'tyler' && upgrade.owned > 0) {
                        return;
                    }

                    upgrade.owned = Number.isFinite(savedUpgrade.owned) ? Math.max(0, savedUpgrade.owned) : 0;
                    // Recalculate next cost from owned count so rebalanced tier prices apply to old saves.
                    upgrade.cost = Math.max(
                        upgrade.baseCost,
                        Math.floor(upgrade.baseCost * Math.pow(upgrade.costMult, upgrade.owned))
                    );
                }
            });
        }

        recomputeUpgradeUnlockStates();
        
        // Update phase-based unlocks
        updateMaxGeneralUnlocked();
        
        initUpgradeMap();
        needsRender = true;
        needsUpgradeTabRender = true;
        updateCounterOnly();
        updateKPS(true);
        updateStatsPanel();
    }
    
    function saveGame() {
        if (saveToLocalStorage()) {
            showStatusMessage('Saved!');
        } else {
            showStatusMessage('Save failed');
        }
    }
    
    function loadGame() {
        const saveData = loadFromLocalStorage();
        if (saveData) {
            applySave(saveData);
            showStatusMessage('Loaded!');
        } else {
            showStatusMessage('No save found');
        }
    }
    
    function exportSave() {
        try {
            const saveData = getSaveData();
            const blob = new Blob([JSON.stringify(saveData, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `kirk-clicker-save-v3.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showStatusMessage('Exported!');
        } catch (error) {
            showStatusMessage('Export failed');
        }
    }
    
    function importSave() {
        if (!elements.importFile) {
            showStatusMessage('Import not supported');
            return;
        }
        
        elements.importFile.value = '';
        
        elements.importFile.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    if (!saveData || typeof saveData !== 'object') {
                        throw new Error('Invalid file format');
                    }
                    
                    const version = saveData.version || 1;
                    if (version > SAVE_VERSION) {
                        throw new Error(`Save v${version} too new (v${SAVE_VERSION} max)`);
                    }
                    
                    if (typeof saveData.kirks !== 'number' || !Number.isFinite(saveData.kirks)) {
                        throw new Error('Invalid kirks value');
                    }
                    
                    applySave(saveData);
                    saveToLocalStorage();
                    showStatusMessage('Imported!');
                } catch (error) {
                    showStatusMessage('Import failed');
                }
            };
            
            reader.readAsText(file);
        };
        
        elements.importFile.click();
    }
    
    function resetGame() {
        if (confirm('Are you sure you want to reset the game? This will delete all progress and cannot be undone.')) {
            localStorage.removeItem(SAVE_KEY_V3);
            localStorage.removeItem(SAVE_KEY_V2);
            
            gameState.kirks = 0;
            gameState.totalClicks = 0;
            gameState.generalLevel = 0;
            gameState.maxGeneralUnlocked = 0;
            gameState.manualLevel = 0;
            gameState.totalKirksMade = 0;
            gameState.handClickedKirks = 0;
            gameState.totalPlaytimeMs = 0;
            runStartedAt = Date.now();
            lastLoopAt = Date.now();
            
            gameState.upgrades.forEach(upgrade => {
                upgrade.owned = 0;
                upgrade.cost = upgrade.baseCost;
                upgrade.unlocked = false;
                gameState.clickerTierById[upgrade.id] = 0;
            });
            recomputeUpgradeUnlockStates();
            
            initUpgradeMap();
            needsRender = true;
            needsUpgradeTabRender = true;
            
            showStatusMessage('Game reset!');
            updateKPS(true);
            updateStatsPanel();
        }
    }
    
    function updateUpgradeClickFooter() {
        if (!elements.upgradeClickCount || !elements.upgradeClickNext) return;

        const totalClicks = gameState.totalClicks;
        const nextManualRequirement = (gameState.manualLevel + 1) * 1000;

        elements.upgradeClickCount.textContent = formatNumber(totalClicks);

        if (totalClicks >= nextManualRequirement) {
            elements.upgradeClickNext.textContent = 'Manual upgrade unlocked (' + formatNumber(nextManualRequirement) + ' clicks)';
        } else {
            elements.upgradeClickNext.textContent = 'Next Manual at ' + formatNumber(nextManualRequirement) + ' (' + formatNumber(totalClicks) + ' / ' + formatNumber(nextManualRequirement) + ')';
        }
    }

    // ==================== GAME FUNCTIONS ====================
    
    function updateCounterOnly() {
        if (elements.counter) {
            elements.counter.textContent = `${formatNumber(gameState.kirks)} Kirks`;
        }

        updateUpgradeClickFooter();
    }

    function updateButtonStates() {
        // Auto-clicker buttons
        domCache.buttons.forEach((button, upgradeId) => {
            if (!button) return;
            
            const cached = upgradeMap.get(upgradeId);
            if (!cached) return;
            
            const { upgrade } = cached;
            const isUnlocked = isUpgradeFullyUnlocked(cached.index);
            upgrade.unlocked = isUnlocked;
            const canBuy = gameState.freeMode || gameState.kirks >= upgrade.cost;
            const isDisabled = !canBuy || !isUnlocked;
            
            button.disabled = isDisabled;
        });
    }
    
    function renderUpgrades() {
        if (!elements.upgradesContainer) return;
        
        elements.upgradesContainer.innerHTML = '';
        
        domCache.buttons.clear();
        domCache.costSpans.clear();
        domCache.countSpans.clear();
        domCache.prodSpans.clear();
        
        gameState.upgrades.forEach((upgrade, index) => {
            const visibilityState = getUpgradeVisibilityState(index);
            if (visibilityState === 'hidden') {
                upgrade.unlocked = false;
                return;
            }

            const isPreview = visibilityState === 'preview';
            upgrade.unlocked = !isPreview;

            const upgradeEl = document.createElement('div');
            upgradeEl.className = `upgrade-item ${isPreview ? 'upgrade-item-preview' : ''}`;
            upgradeEl.dataset.upgradeId = upgrade.id;

            if (isPreview) {
                const previousUpgrade = gameState.upgrades[index - 1];
                const revealProgress = previousUpgrade ? Math.min(previousUpgrade.owned, NEXT_UNLOCK_OWNED) : 0;
                upgradeEl.innerHTML = `
                    <div class="upgrade-header">
                        <div class="upgrade-image">
                            <div class="placeholder-text mystery">?</div>
                        </div>
                        <div class="upgrade-info">
                            <h4 class="upgrade-name">Unknown Auto-Clicker</h4>
                            <p class="upgrade-description">A new unit is close. Keep pushing to reveal it.</p>
                            <div class="upgrade-stats">
                                <span class="stat">Owned: ???</span>
                                <span class="stat">Production: ???/sec</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn upgrade-btn" disabled>
                        Locked (<span class="upgrade-mystery-progress">${revealProgress}</span> / ${NEXT_UNLOCK_OWNED})
                    </button>
                `;
                elements.upgradesContainer.appendChild(upgradeEl);
                return;
            }

            const imgTag = upgrade.image ? 
                `<img src="${upgrade.image}" alt="${upgrade.name}" loading="lazy">` : 
                `<div class="placeholder-text">${upgrade.id.toUpperCase()}</div>`;
            
            const production = getClickerProduction(upgrade.id);
            
            upgradeEl.innerHTML = `
                <div class="upgrade-header">
                    <div class="upgrade-image">
                        ${imgTag}
                    </div>
                    <div class="upgrade-info">
                        <h4 class="upgrade-name">${upgrade.name}</h4>
                        <p class="upgrade-description">${upgrade.desc}</p>
                        <div class="upgrade-stats">
                            <span class="stat">Owned: <span class="upgrade-count" data-upgrade-id="${upgrade.id}">${upgrade.owned}</span></span>
                            <span class="stat">Production: <span class="upgrade-production" data-upgrade-id="${upgrade.id}">${formatNumber(production)}</span>/sec</span>
                        </div>
                    </div>
                </div>
                <button class="btn upgrade-btn" 
                        data-upgrade-id="${upgrade.id}"
                        data-upgrade-index="${index}">
                    Buy for <span class="upgrade-cost" data-upgrade-id="${upgrade.id}">${formatNumber(upgrade.cost)}</span> Kirks
                </button>
            `;
            
            elements.upgradesContainer.appendChild(upgradeEl);
            
            const button = upgradeEl.querySelector(`button[data-upgrade-id="${upgrade.id}"]`);
            const costSpan = upgradeEl.querySelector(`.upgrade-cost[data-upgrade-id="${upgrade.id}"]`);
            const countSpan = upgradeEl.querySelector(`.upgrade-count[data-upgrade-id="${upgrade.id}"]`);
            const prodSpan = upgradeEl.querySelector(`.upgrade-production[data-upgrade-id="${upgrade.id}"]`);
            
            if (button) domCache.buttons.set(upgrade.id, button);
            if (costSpan) domCache.costSpans.set(upgrade.id, costSpan);
            if (countSpan) domCache.countSpans.set(upgrade.id, countSpan);
            if (prodSpan) domCache.prodSpans.set(upgrade.id, prodSpan);
        });
        
        attachUpgradeEventListeners();
        updateButtonStates();
    }
    
    function attachUpgradeEventListeners() {
        domCache.buttons.forEach((button, upgradeId) => {
            const index = parseInt(button.dataset.upgradeIndex);
            if (!isNaN(index)) {
                button.addEventListener('click', () => buyUpgrade(index));
            }
        });
    }
    
    function clickKirk() {
        const clickValue = getManualClickValue();
        gameState.kirks += clickValue;
        gameState.totalClicks += 1;
        gameState.totalKirksMade += clickValue;
        gameState.handClickedKirks += clickValue;
        
        updateCounterOnly();
        updateButtonStates();
        updateStatsPanel();
        
        // Check if manual upgrade became available
        if (isManualUpgradeAvailable()) {
            needsUpgradeTabRender = true;
        }
        
        const el = elements.kirkButton;
        if (!el) return;
        
        // Click-pulse: restart every click with reflow trick
        el.classList.remove('click-pulse');
        void el.offsetWidth; // Force reflow
        el.classList.add('click-pulse');
        
        // Wobble: only if not already wobbling (class gate)
        if (!el.classList.contains('wobble')) {
            el.classList.add('wobble');
        }
    }
    
    function buyUpgrade(index) {
        const upgrade = gameState.upgrades[index];
        if (!upgrade) return;
        if (!isUpgradeFullyUnlocked(index)) return;
        if (!gameState.freeMode && gameState.kirks < upgrade.cost) return;

        const previousNextVisibility = index < gameState.upgrades.length - 1 ? getUpgradeVisibilityState(index + 1) : null;
        
        if (!gameState.freeMode) {
            gameState.kirks -= upgrade.cost;
        }
        
        upgrade.owned += 1;
        upgrade.cost = Math.floor(upgrade.cost * upgrade.costMult);

        recomputeUpgradeUnlockStates();
        const nextVisibility = index < gameState.upgrades.length - 1 ? getUpgradeVisibilityState(index + 1) : null;
        const visibilityChanged = previousNextVisibility !== nextVisibility;

        if (!visibilityChanged) {
            const countSpan = domCache.countSpans.get(upgrade.id);
            const costSpan = domCache.costSpans.get(upgrade.id);
            const prodSpan = domCache.prodSpans.get(upgrade.id);
            
            if (countSpan) countSpan.textContent = upgrade.owned;
            if (costSpan) costSpan.textContent = formatNumber(upgrade.cost);
            if (prodSpan) prodSpan.textContent = formatNumber(getClickerProduction(upgrade.id));
        }
        
        if (visibilityChanged) {
            needsRender = true;
        }
        
        // Check if this unlocks a new phase (and thus general upgrade)
        const oldMax = gameState.maxGeneralUnlocked;
        updateMaxGeneralUnlocked();
        if (gameState.maxGeneralUnlocked > oldMax) {
            needsUpgradeTabRender = true;
        }
        
        // Check if clicker tier upgrade became available
        const tier = gameState.clickerTierById[upgrade.id] || 0;
        const requiredOwned = getClickerTierRequiredOwned(upgrade.id, tier + 1);
        if (upgrade.owned >= requiredOwned) {
            needsUpgradeTabRender = true;
        }
        
        updateCounterOnly();
        updateButtonStates();
        updateKPS(true);
        
        saveToLocalStorage();
    }
    
    // ==================== UPGRADE TAB RENDERING ====================
    
    function renderUpgradeTab() {
        const container = document.getElementById('upgradeTabContent');
        if (!container) return;
        
        container.innerHTML = '';
        
        let hasAnyUpgrade = false;
        
        // 1. GENERAL UPGRADE
        if (isGeneralUpgradeAvailable()) {
            hasAnyUpgrade = true;
            const cost = getGeneralUpgradeCost();
            const canAfford = gameState.freeMode || gameState.kirks >= cost;
            const currentMult = getGeneralMultiplier();
            const nextMult = Math.pow(GENERAL_MULTIPLIER_PER_LEVEL, gameState.generalLevel + 1);
            
            const generalEl = document.createElement('div');
            generalEl.className = 'upgrade-item-special';
            generalEl.innerHTML = `
                <div class="upgrade-special-header">
                    <h4 class="upgrade-special-name">⚡ General Multiplier</h4>
                    <span class="upgrade-special-level">Level ${gameState.generalLevel} → ${gameState.generalLevel + 1}</span>
                </div>
                <p class="upgrade-special-desc">
                    Multiply all production and click power by ${GENERAL_MULTIPLIER_PER_LEVEL.toFixed(2)}x<br>
                    <small>Current: ${currentMult.toFixed(2)}x → Next: ${nextMult.toFixed(2)}x</small>
                </p>
                <button class="btn upgrade-btn-special ${canAfford ? '' : 'disabled'}" 
                        id="btnBuyGeneral"
                        ${canAfford ? '' : 'disabled'}>
                    Buy for ${formatNumber(cost)} Kirks
                </button>
            `;
            container.appendChild(generalEl);
            
            const button = generalEl.querySelector('#btnBuyGeneral');
            if (button) {
                button.addEventListener('click', buyGeneralUpgrade);
            }
        }
        
        // 2. MANUAL UPGRADE
        if (isManualUpgradeAvailable()) {
            hasAnyUpgrade = true;
            const cost = getManualUpgradeCost();
            const canAfford = gameState.freeMode || gameState.kirks >= cost;
            const requiredClicks = (gameState.manualLevel + 1) * 1000;
            const currentValue = getManualClickValue();
            const nextValue = Math.pow(2, gameState.manualLevel + 1) * getGeneralMultiplier();
            
            const manualEl = document.createElement('div');
            manualEl.className = 'upgrade-item-special';
            manualEl.innerHTML = `
                <div class="upgrade-special-header">
                    <h4 class="upgrade-special-name">👆 Manual Click Power</h4>
                    <span class="upgrade-special-level">Tier ${gameState.manualLevel + 1}</span>
                </div>
                <p class="upgrade-special-desc">
                    Double manual click power (affected by General Multiplier)<br>
                    <small>Current: ${formatDecimal(currentValue)} → Next: ${formatDecimal(nextValue)}</small><br>
                    <small class="upgrade-progress">Unlocked at ${formatNumber(requiredClicks)} clicks (✓)</small>
                </p>
                <button class="btn upgrade-btn-special ${canAfford ? '' : 'disabled'}" 
                        id="btnBuyManual"
                        ${canAfford ? '' : 'disabled'}>
                    Buy for ${formatNumber(cost)} Kirks
                </button>
            `;
            container.appendChild(manualEl);
            
            const button = manualEl.querySelector('#btnBuyManual');
            if (button) {
                button.addEventListener('click', buyManualUpgrade);
            }
        }
        
        // 3. CLICKER TIER UPGRADES
        const availableTiers = getAvailableClickerTierUpgrades();
        if (availableTiers.length > 0) {
            hasAnyUpgrade = true;
            
            availableTiers.forEach(tierUpgrade => {
                const canAfford = gameState.freeMode || gameState.kirks >= tierUpgrade.cost;
                const currentTier = gameState.clickerTierById[tierUpgrade.id] || 0;
                const currentMult = Math.pow(CLICKER_TIER_MULTIPLIER, currentTier);
                const nextMult = Math.pow(CLICKER_TIER_MULTIPLIER, tierUpgrade.tier);
                
                const tierEl = document.createElement('div');
                tierEl.className = 'upgrade-item-special upgrade-item-tier';
                tierEl.innerHTML = `
                    <div class="upgrade-special-header">
                        <h4 class="upgrade-special-name">${tierUpgrade.name}</h4>
                        <span class="upgrade-special-level">Tier ${currentTier} → ${tierUpgrade.tier}</span>
                    </div>
                    <p class="upgrade-special-desc">
                        Boost this clicker's production<br>
                        <small>Multiplier: ${currentMult.toFixed(2)}x → ${nextMult.toFixed(2)}x</small><br>
                        <small class="upgrade-progress">Unlocked at ${tierUpgrade.requiredOwned} owned (✓)</small>
                    </p>
                    <button class="btn upgrade-btn-special ${canAfford ? '' : 'disabled'}" 
                            data-clicker-id="${tierUpgrade.id}"
                            ${canAfford ? '' : 'disabled'}>
                        Buy for ${formatNumber(tierUpgrade.cost)} Kirks
                    </button>
                `;
                container.appendChild(tierEl);
                
                const button = tierEl.querySelector('button');
                if (button) {
                    button.addEventListener('click', () => buyClickerTierUpgrade(tierUpgrade.id));
                }
            });
        }
        
        // Show empty state if no upgrades available
        if (!hasAnyUpgrade) {
            container.innerHTML = `
                <div class="upgrade-empty-state">
                    <p>No upgrades available yet.</p>
                    <p class="upgrade-empty-hint">
                        ${gameState.generalLevel >= gameState.maxGeneralUnlocked ? 
                            "Buy more clickers to unlock phases and General upgrades!" : "Keep clicking and buying to unlock more upgrades!"}
                    </p>
                </div>
            `;
        }

        needsUpgradeTabRender = false;
    }
    
    function buyGeneralUpgrade() {
        const cost = getGeneralUpgradeCost();
        
        if (!gameState.freeMode && gameState.kirks < cost) return;
        if (!isGeneralUpgradeAvailable()) return;
        
        if (!gameState.freeMode) {
            gameState.kirks -= cost;
        }
        
        gameState.generalLevel += 1;
        
        // Update all production displays
        gameState.upgrades.forEach(clicker => {
            const prodSpan = domCache.prodSpans.get(clicker.id);
            if (prodSpan) {
                prodSpan.textContent = formatNumber(getClickerProduction(clicker.id));
            }
        });
        
        updateCounterOnly();
        updateButtonStates();
        updateKPS(true);
        needsUpgradeTabRender = true;
        
        saveToLocalStorage();
    }
    
    function buyManualUpgrade() {
        const cost = getManualUpgradeCost();
        
        if (!gameState.freeMode && gameState.kirks < cost) return;
        if (!isManualUpgradeAvailable()) return;
        
        if (!gameState.freeMode) {
            gameState.kirks -= cost;
        }
        
        gameState.manualLevel += 1;
        
        updateCounterOnly();
        updateButtonStates();
        needsUpgradeTabRender = true;
        
        saveToLocalStorage();
    }
    
    function buyClickerTierUpgrade(clickerId) {
        const cost = getClickerTierCost(clickerId);
        
        if (!gameState.freeMode && gameState.kirks < cost) return;
        
        const tier = gameState.clickerTierById[clickerId] || 0;
        const cached = upgradeMap.get(clickerId);
        if (!cached) return;
        
        const requiredOwned = getClickerTierRequiredOwned(clickerId, tier + 1);
        if (cached.upgrade.owned < requiredOwned) return;
        
        if (!gameState.freeMode) {
            gameState.kirks -= cost;
        }
        
        gameState.clickerTierById[clickerId] = tier + 1;
        
        // Update production display for this clicker
        const prodSpan = domCache.prodSpans.get(clickerId);
        if (prodSpan) {
            prodSpan.textContent = formatNumber(getClickerProduction(clickerId));
        }
        
        updateCounterOnly();
        updateButtonStates();
        updateKPS(true);
        needsUpgradeTabRender = true;
        
        saveToLocalStorage();
    }
    
    // ==================== EVENT LISTENERS ====================
    
    if (elements.kirkButton) {
        elements.kirkButton.addEventListener('click', clickKirk);
    }
    
    if (elements.btnSave) {
        elements.btnSave.addEventListener('click', saveGame);
    }
    
    if (elements.btnLoad) {
        elements.btnLoad.addEventListener('click', loadGame);
    }
    
    if (elements.btnExport) {
        elements.btnExport.addEventListener('click', exportSave);
    }
    
    if (elements.btnImport) {
        elements.btnImport.addEventListener('click', importSave);
    }
    
    if (elements.btnReset) {
        elements.btnReset.addEventListener('click', resetGame);
    }
    
    // ==================== GAME LOOP ====================
    function gameLoop() {
        const now = Date.now();
        const deltaMs = Math.max(0, now - lastLoopAt);
        lastLoopAt = now;
        gameState.totalPlaytimeMs += deltaMs;

        const incomePerSecond = calculateIncomePerSecond();
        const incomePerTick = incomePerSecond / 10;
        gameState.kirks += incomePerTick;
        gameState.totalKirksMade += incomePerTick;
        
        updateCounterOnly();
        updateButtonStates();
        updateKPS(false);
        updateStatsPanel();
        
        if (needsRender) {
            renderUpgrades();
            needsRender = false;
        }
        
        if (needsUpgradeTabRender) {
            renderUpgradeTab();
        }
        
        if (now - lastAutoSave >= 45000) {
            saveToLocalStorage();
            lastAutoSave = now;
        }
    }
    
    // ==================== INITIALIZATION ====================
    function init() {
        console.log('=== INITIALIZING KIRK CLICKER V3 ===');
        console.log('Total clickers:', gameState.upgrades.length);
        
        initUpgradeMap();
        initWobbleControl(); // Initialize wobble animation control
        
        const savedData = loadFromLocalStorage();
        if (savedData) {
            applySave(savedData);
            console.log('Loaded saved game (v' + (savedData.version || 1) + ')');
        } else {
            console.log('Starting fresh game');
        }
        
        renderUpgrades();
        renderUpgradeTab();
        updateCounterOnly();
        updateKPS(true);
        updateStatsPanel();
        setupTopPanels();
        setupJumpscareHotkey();
        setupMonsterAdminHotkey();
        prepareMonsterImageTransparency();
        setInterval(maybeTriggerRandomJumpscare, 1000);
        setInterval(() => spawnWhiteMonster(false), 1000);
        
        // Start game loop
        setInterval(gameLoop, 100);
        
        console.log('Kirk Clicker V3 initialized!');
    }
    
    init();
});












