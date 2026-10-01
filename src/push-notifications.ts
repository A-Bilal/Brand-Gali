/**
 * BrandGali Push Notification & PWA Service Manager
 * Handles:
 * 1. Service Worker registration
 * 2. Mobile & Desktop Notification permission requests
 * 3. Token / Push Subscription storage in Firestore under users/{uid}/devices
 * 4. Local OS-level notifications and test triggers
 */

import { db, doc, setDoc, handleFirestoreError, OperationType } from './firebase';

export type PushPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export interface PushDeviceInfo {
  userAgent: string;
  platform: string;
  isMobile: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  permission: NotificationPermission | 'unsupported';
  endpoint?: string;
  updatedAt: string;
}

class PushNotificationManager {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private currentUserId: string | null = null;

  constructor() {
    this.initServiceWorker();
  }

  // Register the background Service Worker
  public async initServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      this.swRegistration = reg;
      return reg;
    } catch (err) {
      console.warn('BrandGali Service Worker registration failed:', err);
      return null;
    }
  }

  // Check if Push Notifications are supported on this device
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Detect iOS environment
  public isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }

  // Check if running in standalone (PWA Installed) mode
  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  // Get current permission state
  public getPermission(): PushPermissionStatus {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission as PushPermissionStatus;
  }

  // Request native OS Notification permission from the user
  public async requestPermission(userId?: string): Promise<PushPermissionStatus> {
    if (!this.isSupported()) {
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const uId = userId || this.currentUserId;
        if (uId) {
          await this.syncDeviceToFirestore(uId);
        }
      }
      return permission as PushPermissionStatus;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  // Set active user and sync device state
  public async setActiveUser(userId: string | null) {
    this.currentUserId = userId;
    if (userId && this.getPermission() === 'granted') {
      await this.syncDeviceToFirestore(userId);
    }
  }

  // Sync device metadata to Firestore for the user
  public async syncDeviceToFirestore(userId: string) {
    if (!userId || !this.isSupported()) return;

    try {
      // Create a deterministic device fingerprint key
      const nav = window.navigator;
      const ua = nav.userAgent;
      const isMobile = /android|iphone|ipad|ipod|mobile/i.test(ua);
      const isIOS = this.isIOS();
      const isStandalone = this.isStandalone();
      const deviceId = btoa(`${ua.substring(0, 32)}_${nav.platform || 'web'}`).replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 40);

      const deviceDocRef = doc(db, 'users', userId, 'devices', deviceId);
      const path = `users/${userId}/devices/${deviceId}`;

      const data: PushDeviceInfo = {
        userAgent: ua,
        platform: nav.platform || 'unknown',
        isMobile,
        isIOS,
        isStandalone,
        permission: Notification.permission,
        updatedAt: new Date().toISOString()
      };

      await setDoc(deviceDocRef, data, { merge: true });
    } catch (err) {
      // Non-blocking device sync
      console.warn('Push device registration sync warning:', err);
    }
  }

  // Send a native OS notification immediately (e.g. for testing or when followed sale triggers)
  public async triggerNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
    if (this.getPermission() !== 'granted') {
      return false;
    }

    const defaultOptions: NotificationOptions = {
      body: 'Discounts just dropped for one of your followed brands!',
      icon: '/assets/brandgali-logo.png',
      badge: '/assets/favicon.png',
      tag: 'brandgali-sale-alert',
      ...options
    };

    // Prefer ServiceWorker showNotification if available (works on phones in background)
    if (this.swRegistration && 'showNotification' in this.swRegistration) {
      await this.swRegistration.showNotification(title, defaultOptions);
      return true;
    } else if ('Notification' in window) {
      new Notification(title, defaultOptions);
      return true;
    }

    return false;
  }

  // Send a test phone push notification so the user can verify on their device
  public async sendTestNotification(brandName = 'Sapphire'): Promise<boolean> {
    return this.triggerNotification(`BrandGali: ${brandName} Sale is Live! 🔥`, {
      body: `Flat 40% OFF summer and lawn collection. Tap to browse discounts on BrandGali!`,
      icon: '/assets/brandgali-logo.png',
      badge: '/assets/favicon.png',
      tag: 'brandgali-test-alert',
      data: { url: '/live-sales.html' }
    });
  }
}

export const pushManager = new PushNotificationManager();
(window as any).BrandGaliPush = pushManager;
