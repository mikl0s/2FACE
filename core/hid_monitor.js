/**
 * 2FACE - HID Device Monitor
 * Monitors USB Human Interface Devices for security purposes
 * 
 * @copyright 2024 Mikkel Georgsen / Dataløs
 * @license MIT
 */

class HIDMonitor {
  constructor() {
    this.knownDevices = new Set();
    this.isEnabled = false;
    this.onUnknownDeviceCallback = null;
  }

  async initialize() {
    try {
      // Load known devices from storage
      const result = await chrome.storage.sync.get(['knownHIDDevices', 'hidMonitoringEnabled']);
      if (result.knownHIDDevices) {
        this.knownDevices = new Set(result.knownHIDDevices);
      }
      this.isEnabled = result.hidMonitoringEnabled || false;
    } catch (error) {
      console.error('Failed to initialize HID monitor:', error);
    }
  }

  async enable() {
    this.isEnabled = true;
    await chrome.storage.sync.set({ hidMonitoringEnabled: true });
    this.startMonitoring();
  }

  async disable() {
    this.isEnabled = false;
    await chrome.storage.sync.set({ hidMonitoringEnabled: false });
  }

  setCallback(callback) {
    this.onUnknownDeviceCallback = callback;
  }

  async startMonitoring() {
    if (!this.isEnabled) return;

    try {
      const devices = await navigator.hid.getDevices();
      const currentDevices = new Set(devices.map(device => this.getDeviceIdentifier(device)));

      // Check for unknown devices
      for (const device of devices) {
        const deviceId = this.getDeviceIdentifier(device);
        if (!this.knownDevices.has(deviceId)) {
          this.handleUnknownDevice();
          break;
        }
      }

      // Set up device connect/disconnect listeners
      navigator.hid.addEventListener('connect', (event) => {
        const deviceId = this.getDeviceIdentifier(event.device);
        if (!this.knownDevices.has(deviceId)) {
          this.handleUnknownDevice();
        }
      });

      navigator.hid.addEventListener('disconnect', () => {
        // Refresh device list on disconnect
        this.startMonitoring();
      });

    } catch (error) {
      console.error('Failed to monitor HID devices:', error);
    }
  }

  getDeviceIdentifier(device) {
    return `${device.vendorId}-${device.productId}-${device.productName}`;
  }

  handleUnknownDevice() {
    if (this.onUnknownDeviceCallback) {
      this.onUnknownDeviceCallback();
    }
  }

  async trustCurrentDevices() {
    try {
      const devices = await navigator.hid.getDevices();
      const deviceIds = devices.map(device => this.getDeviceIdentifier(device));
      this.knownDevices = new Set(deviceIds);
      await chrome.storage.sync.set({ knownHIDDevices: Array.from(this.knownDevices) });
    } catch (error) {
      console.error('Failed to trust current devices:', error);
    }
  }
}

export const hidMonitor = new HIDMonitor(); 