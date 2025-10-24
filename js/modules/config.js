/**
 * @fileoverview Global Configuration Module
 * @description Manages global variables, cache, and configuration for the dashboard
 * @version 1.0.0
 * @author Zuhal Müzik Dashboard Team
 */

/**
 * Data cache storage for loaded years
 * @type {Object.<string, Object>}
 */
window.loadedDataCache = {};

/**
 * Set of loaded years for tracking
 * @type {Set<number>}
 */
window.loadedYears = new Set();

/**
 * Metadata storage
 * @type {Object}
 */
window.metadata = {};

/**
 * Central targets configuration
 * @type {Object}
 */
window.centralTargets = {};

/**
 * All stores targets configuration
 * @type {Object}
 */
window.allStoresTargets = {};

/**
 * Yearly target configuration
 * @type {Object}
 */
window.yearlyTarget = {};

/**
 * Monthly target configuration
 * @type {Object}
 */
window.monthlyTarget = {};

/**
 * Stock locations mapping
 * @type {Object}
 */
window.stockLocations = {};

/**
 * Loading progress tracker
 * @type {Object}
 * @property {boolean} pageInit - Page initialization status
 * @property {boolean} dataFiles - Data files loading status
 * @property {boolean} targets - Targets loading status
 * @property {boolean} ready - Overall ready status
 */
window.dataLoadProgress = {
    pageInit: false,
    dataFiles: false,
    targets: false,
    ready: false
};

/**
 * Generates daily version string for cache busting
 * @returns {string} Version string in format YYYYMMDD
 * @example getDailyVersion() // Returns: "20241024"
 */
window.getDailyVersion = function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

/**
 * Generates hourly version string for cache busting
 * @returns {string} Version string in format YYYYMMDDHH
 * @example getHourlyVersion() // Returns: "2024102416"
 */
window.getHourlyVersion = function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    return `${year}${month}${day}${hour}`;
};

console.log('✅ Config module loaded');

