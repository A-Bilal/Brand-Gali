import {
  auth,
  db,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  handleFirestoreError,
  OperationType,
  type User,
  type Unsubscribe
} from './firebase';
import { pushManager, type PushPermissionStatus } from './push-notifications';


interface BrandAlertData {
  brandId: string;
  brandName: string;
  userId: string;
  enabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Global state
let currentUser: User | null = null;
let followedBrands: Set<string> = new Set();
let notificationsUnsubscribe: Unsubscribe | null = null;
let pendingNotifyBrand: { id: string; name: string } | null = null;

// Helper: Show toast
function notifyToast(msg: string, icon = 'fa-solid fa-bell') {
  let toast = document.getElementById('bgToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bgToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="${icon}"></i> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast?.classList.remove('show');
  }, 3200);
}

// Helper: sync user profile to Firestore
async function syncUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  try {
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'BrandGali Shopper',
        createdAt: now,
        updatedAt: now
      });
    } else {
      await setDoc(userRef, {
        updatedAt: now
      }, { merge: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Listen to user notifications in Firestore
function listenToUserNotifications(userId: string) {
  if (notificationsUnsubscribe) {
    notificationsUnsubscribe();
    notificationsUnsubscribe = null;
  }

  const collRef = collection(db, 'users', userId, 'notifications');
  const path = `users/${userId}/notifications`;

  notificationsUnsubscribe = onSnapshot(
    collRef,
    (snapshot) => {
      followedBrands.clear();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as BrandAlertData;
        if (data && data.brandId && data.enabled !== false) {
          followedBrands.add(data.brandId);
        }
      });
      // Save cache locally for immediate render on next load
      try {
        localStorage.setItem('brandgali_following', JSON.stringify(Array.from(followedBrands)));
      } catch (_) {}

      // Refresh notify buttons on page
      if (typeof (window as any).refreshNotifyButtonsUI === 'function') {
        (window as any).refreshNotifyButtonsUI();
      }
      updateAccountButtonUI();
      updateAccountModalContent();
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Toggle Brand Notification in Firestore
export async function toggleBrandNotification(brandId: string, brandName: string): Promise<boolean> {
  if (!currentUser) {
    // Open auth modal with intent
    openAuthModal(brandId, brandName);
    return false;
  }

  const sanitizedBrandId = brandId.replace(/[^a-zA-Z0-9_-]/g, '');
  const alertRef = doc(db, 'users', currentUser.uid, 'notifications', sanitizedBrandId);
  const path = `users/${currentUser.uid}/notifications/${sanitizedBrandId}`;
  const isAlreadyFollowing = followedBrands.has(sanitizedBrandId);

  try {
    if (isAlreadyFollowing) {
      await deleteDoc(alertRef);
      followedBrands.delete(sanitizedBrandId);
      notifyToast(`Sale alert turned off for ${brandName}`, 'fa-regular fa-bell-slash');
    } else {
      const now = new Date().toISOString();
      const alertData: BrandAlertData = {
        brandId: sanitizedBrandId,
        brandName: brandName || sanitizedBrandId,
        userId: currentUser.uid,
        enabled: true,
        createdAt: now,
        updatedAt: now
      };
      await setDoc(alertRef, alertData);
      followedBrands.add(sanitizedBrandId);
      notifyToast(`Sale alert active for ${brandName}! You'll be notified on discounts.`, 'fa-solid fa-check');
    }

    // Refresh UI
    if (typeof (window as any).refreshNotifyButtonsUI === 'function') {
      (window as any).refreshNotifyButtonsUI();
    }
    updateAccountButtonUI();
    updateAccountModalContent();
    return !isAlreadyFollowing;
  } catch (err) {
    handleFirestoreError(err, isAlreadyFollowing ? OperationType.DELETE : OperationType.WRITE, path);
  }
}

// Update the topbar #userAccountBtn UI
function updateAccountButtonUI() {
  const userBtn = document.getElementById('userAccountBtn');
  if (!userBtn) return;

  if (currentUser) {
    const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'Account';
    const initials = (name.split(' ').map(n => n[0]).join('') || 'U').substring(0, 2).toUpperCase();
    const count = followedBrands.size;
    const badgeMarkup = count > 0 ? `<span class="user-alerts-badge" id="userAlertsCountBadge" title="${count} active brand alerts">${count}</span>` : '';

    if (currentUser.photoURL) {
      userBtn.innerHTML = `
        <div class="user-avatar-active">
          <img src="${currentUser.photoURL}" alt="${name}" referrerpolicy="no-referrer">
          ${badgeMarkup}
        </div>
      `;
    } else {
      userBtn.innerHTML = `
        <div class="user-avatar-active user-avatar-initials">
          <span>${initials}</span>
          ${badgeMarkup}
        </div>
      `;
    }
    userBtn.setAttribute('title', `${name} (${count} alerts active) - Click to manage`);
    userBtn.onclick = (e) => {
      e.preventDefault();
      openAccountModal();
    };
  } else {
    userBtn.innerHTML = `
      <div class="user-avatar-dot" id="userAvatarDotIcon">
        <i class="fa-solid fa-user"></i>
      </div>
    `;
    userBtn.setAttribute('title', 'Sign In / Register');
    userBtn.onclick = (e) => {
      e.preventDefault();
      openAuthModal();
    };
  }
}

// Build and inject Modals into DOM
function ensureModalsInDOM() {
  if (!document.getElementById('bgAuthModal')) {
    const authModal = document.createElement('div');
    authModal.id = 'bgAuthModal';
    authModal.className = 'bg-modal-overlay';
    authModal.setAttribute('role', 'dialog');
    authModal.setAttribute('aria-modal', 'true');
    authModal.setAttribute('aria-labelledby', 'authModalTitle');
    authModal.innerHTML = `
      <div class="bg-modal-card" id="authModalCard">
        <button type="button" class="bg-modal-close" id="authModalCloseBtn" aria-label="Close modal">&times;</button>
        
        <div class="auth-header">
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;">
            <img src="/assets/brandgali-logo.png" alt="BrandGali" style="height:36px;width:auto;max-width:36px;object-fit:contain;" onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src='/assets/brandgali-logo.jpeg';}">
            <span class="brand-logo-text" style="font-size:22px;">brand<span>gali</span></span>
          </div>
          <h3 id="authModalTitle">Sign in to BrandGali</h3>
          <p class="auth-subtitle" id="authModalSubtitle">
            Create an account to save your favourite Pakistani brands and get notified the minute their sales go live.
          </p>
        </div>

        <div class="auth-intent-banner" id="authIntentBanner" style="display:none;">
          <i class="fa-solid fa-bell-concierge"></i>
          <div>
            <strong>Sale Alert:</strong>
            <span id="authIntentBrandName">Khaadi</span> will be added to your alerts as soon as you sign in.
          </div>
        </div>

        <div class="auth-tabs" id="authTabsRow">
          <button type="button" class="auth-tab-btn active" id="authTabSignIn">Sign In</button>
          <button type="button" class="auth-tab-btn" id="authTabRegister">Create Account</button>
        </div>

        <div class="auth-body">
          <button type="button" class="google-auth-btn" id="googleAuthBtn">
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
            </svg>
            <span id="googleAuthBtnLabel">Continue with Google</span>
          </button>

          <div class="auth-divider">
            <span>or continue with email</span>
          </div>

          <form id="authEmailForm" onsubmit="return false;" novalidate>
            <div class="auth-form-group" id="authNameGroup" style="display:none;">
              <label for="authNameInput">Full Name</label>
              <div class="auth-input-wrapper">
                <i class="fa-regular fa-user"></i>
                <input type="text" id="authNameInput" placeholder="e.g. Fatima Ali" autocomplete="name">
              </div>
            </div>

            <div class="auth-form-group">
              <label for="authEmailInput">Email Address</label>
              <div class="auth-input-wrapper">
                <i class="fa-regular fa-envelope"></i>
                <input type="email" id="authEmailInput" placeholder="name@example.com" autocomplete="email" required>
              </div>
            </div>

            <div class="auth-form-group">
              <div class="auth-label-row">
                <label for="authPasswordInput">Password</label>
                <button type="button" class="auth-forgot-link" id="authForgotBtn">Forgot?</button>
              </div>
              <div class="auth-input-wrapper">
                <i class="fa-solid fa-lock"></i>
                <input type="password" id="authPasswordInput" placeholder="At least 6 characters" autocomplete="current-password" required>
                <button type="button" class="auth-toggle-pwd" id="authTogglePwdBtn" aria-label="Toggle password visibility">
                  <i class="fa-regular fa-eye"></i>
                </button>
              </div>
            </div>

            <div class="auth-error-box" id="authErrorBox" style="display:none;"></div>
            <div class="auth-success-box" id="authSuccessBox" style="display:none;"></div>

            <button type="submit" class="auth-submit-btn" id="authSubmitBtn">
              <span class="btn-text" id="authSubmitBtnText">Sign In</span>
              <span class="btn-spinner" id="authSubmitSpinner" style="display:none;"><i class="fa-solid fa-circle-notch fa-spin"></i></span>
            </button>
          </form>

          <div class="auth-security-badge">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Secured with Firebase Authentication. Credentials are cryptographically protected.</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(authModal);
    wireAuthModalEvents();
  }

  // Account modal
  if (!document.getElementById('bgAccountModal')) {
    const acctModal = document.createElement('div');
    acctModal.id = 'bgAccountModal';
    acctModal.className = 'bg-modal-overlay';
    acctModal.setAttribute('role', 'dialog');
    acctModal.setAttribute('aria-modal', 'true');
    acctModal.setAttribute('aria-labelledby', 'accountModalTitle');
    acctModal.innerHTML = `
      <div class="bg-modal-card account-modal-card" id="accountModalCard">
        <button type="button" class="bg-modal-close" id="acctModalCloseBtn" aria-label="Close modal">&times;</button>
        
        <div class="acct-profile-head">
          <div class="acct-avatar" id="acctAvatarDisplay">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="acct-info">
            <h3 id="acctUserName">User Name</h3>
            <p id="acctUserEmail">user@example.com</p>
            <span class="acct-badge" id="acctUserVerifiedBadge"><i class="fa-solid fa-shield-check"></i> Account Verified</span>
          </div>
        </div>

        <div class="acct-tabs-content">
          <!-- Real Phone Push Notification Center -->
          <div class="acct-push-card" id="acctPushSettingsCard">
            <div class="acct-push-header">
              <div class="acct-push-title-row">
                <div class="acct-push-icon">
                  <i class="fa-solid fa-mobile-screen-button"></i>
                </div>
                <div>
                  <h4 class="acct-push-heading">Phone Push Notifications</h4>
                  <span style="font-size:11px;color:var(--muted);">Instant lock-screen alerts when your followed brands drop sales</span>
                </div>
              </div>
              <span class="acct-push-status" id="acctPushStatusBadge">Checking...</span>
            </div>
            
            <p class="acct-push-desc" id="acctPushStatusDesc">
              Enable native phone notifications to receive immediate alerts even when your browser is closed.
            </p>

            <div class="acct-push-actions" id="acctPushActionsRow">
              <button type="button" class="btn-phone-push-toggle" id="btnTogglePhonePush">
                <i class="fa-solid fa-bell"></i> <span id="btnTogglePhonePushText">Enable Phone Alerts</span>
              </button>
              <button type="button" class="btn-phone-push-test" id="btnTestPhonePush" style="display:none;">
                <i class="fa-solid fa-paper-plane"></i> Send Test Notification
              </button>
            </div>

            <div class="acct-ios-guide" id="acctIosGuideNotice" style="display:none;">
              <i class="fa-brands fa-apple"></i> <strong>iPhone Shoppers:</strong> Apple requires saving BrandGali to your Home Screen first to receive lock-screen push alerts. Tap <strong>Share <i class="fa-solid fa-arrow-up-from-bracket"></i></strong> in Safari, then tap <strong>Add to Home Screen</strong>.
            </div>
          </div>

          <div class="acct-section-head">
            <h4><i class="fa-solid fa-bell" style="color:var(--orange-deep);"></i> My Brand Sale Alerts</h4>
            <span class="acct-alerts-counter" id="acctAlertsCounter">0 brands</span>
          </div>
          <p class="acct-section-desc">You will receive instant alerts whenever these Pakistani brands publish discounts or flash sales.</p>
          
          <div class="acct-alerts-list" id="acctAlertsList">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <div class="acct-footer-actions">
          <button type="button" class="acct-signout-btn" id="acctSignOutBtn">
            <i class="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(acctModal);
    wireAccountModalEvents();
  }
}

// Wire events for Auth modal
let isRegisterMode = false;
function wireAuthModalEvents() {
  const modal = document.getElementById('bgAuthModal');
  const closeBtn = document.getElementById('authModalCloseBtn');
  const tabSignIn = document.getElementById('authTabSignIn');
  const tabRegister = document.getElementById('authTabRegister');
  const googleBtn = document.getElementById('googleAuthBtn');
  const submitBtn = document.getElementById('authSubmitBtn');
  const forgotBtn = document.getElementById('authForgotBtn');
  const togglePwdBtn = document.getElementById('authTogglePwdBtn');
  const pwdInput = document.getElementById('authPasswordInput') as HTMLInputElement;

  closeBtn?.addEventListener('click', closeAuthModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeAuthModal();
  });

  function setMode(register: boolean) {
    isRegisterMode = register;
    const nameGroup = document.getElementById('authNameGroup');
    const title = document.getElementById('authModalTitle');
    const submitText = document.getElementById('authSubmitBtnText');
    const googleLabel = document.getElementById('googleAuthBtnLabel');
    const errorBox = document.getElementById('authErrorBox');
    const successBox = document.getElementById('authSuccessBox');
    if (errorBox) errorBox.style.display = 'none';
    if (successBox) successBox.style.display = 'none';

    if (register) {
      tabRegister?.classList.add('active');
      tabSignIn?.classList.remove('active');
      if (nameGroup) nameGroup.style.display = 'block';
      if (title) title.textContent = 'Create your account';
      if (submitText) submitText.textContent = 'Create Account';
      if (googleLabel) googleLabel.textContent = 'Sign up with Google';
    } else {
      tabSignIn?.classList.add('active');
      tabRegister?.classList.remove('active');
      if (nameGroup) nameGroup.style.display = 'none';
      if (title) title.textContent = 'Sign in to BrandGali';
      if (submitText) submitText.textContent = 'Sign In';
      if (googleLabel) googleLabel.textContent = 'Continue with Google';
    }
  }

  tabSignIn?.addEventListener('click', () => setMode(false));
  tabRegister?.addEventListener('click', () => setMode(true));

  // Toggle password visibility
  togglePwdBtn?.addEventListener('click', () => {
    if (pwdInput) {
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        togglePwdBtn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
      } else {
        pwdInput.type = 'password';
        togglePwdBtn.innerHTML = '<i class="fa-regular fa-eye"></i>';
      }
    }
  });

  // Google Sign-In
  googleBtn?.addEventListener('click', async () => {
    clearAuthAlerts();
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user);
      onAuthSuccess(result.user);
    } catch (err: any) {
      setAuthLoading(false);
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        showAuthError(friendlyAuthError(err));
      }
    }
  });

  // Email / Password submit
  submitBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    clearAuthAlerts();

    const email = (document.getElementById('authEmailInput') as HTMLInputElement)?.value.trim();
    const password = (document.getElementById('authPasswordInput') as HTMLInputElement)?.value;
    const name = (document.getElementById('authNameInput') as HTMLInputElement)?.value.trim();

    if (!email || !email.includes('@')) {
      showAuthError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      showAuthError('Password must be at least 6 characters long.');
      return;
    }

    setAuthLoading(true);

    try {
      if (isRegisterMode) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCred.user, { displayName: name });
        }
        await syncUserProfile(userCred.user);
        onAuthSuccess(userCred.user);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(userCred.user);
        onAuthSuccess(userCred.user);
      }
    } catch (err: any) {
      setAuthLoading(false);
      showAuthError(friendlyAuthError(err));
    }
  });

  // Forgot password
  forgotBtn?.addEventListener('click', async () => {
    clearAuthAlerts();
    const email = (document.getElementById('authEmailInput') as HTMLInputElement)?.value.trim();
    if (!email || !email.includes('@')) {
      showAuthError('Please enter your email address above, then click Forgot? to receive a reset link.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showAuthSuccess(`Password reset instructions have been sent to ${email}. Check your inbox!`);
    } catch (err: any) {
      showAuthError(friendlyAuthError(err));
    }
  });
}

function clearAuthAlerts() {
  const errBox = document.getElementById('authErrorBox');
  const succBox = document.getElementById('authSuccessBox');
  if (errBox) { errBox.style.display = 'none'; errBox.textContent = ''; }
  if (succBox) { succBox.style.display = 'none'; succBox.textContent = ''; }
}

function showAuthError(msg: string) {
  const errBox = document.getElementById('authErrorBox');
  if (errBox) {
    errBox.textContent = msg;
    errBox.style.display = 'block';
  }
}

function showAuthSuccess(msg: string) {
  const succBox = document.getElementById('authSuccessBox');
  if (succBox) {
    succBox.textContent = msg;
    succBox.style.display = 'block';
  }
}

function setAuthLoading(loading: boolean) {
  const btn = document.getElementById('authSubmitBtn') as HTMLButtonElement;
  const spinner = document.getElementById('authSubmitSpinner');
  const text = document.getElementById('authSubmitBtnText');
  const googleBtn = document.getElementById('googleAuthBtn') as HTMLButtonElement;

  if (btn) btn.disabled = loading;
  if (googleBtn) googleBtn.disabled = loading;
  if (spinner) spinner.style.display = loading ? 'inline-block' : 'none';
  if (text) text.style.opacity = loading ? '0.4' : '1';
}

function friendlyAuthError(err: any): string {
  const code = err?.code || '';
  if (code === 'auth/email-already-in-use') {
    return 'An account already exists with this email. Please sign in instead.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (code === 'auth/weak-password') {
    return 'The password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/invalid-email') {
    return 'The email format is invalid. Please check for typos.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many unsuccessful attempts. Access has been temporarily locked for security. Try again in a few minutes or reset your password.';
  }
  return err?.message || 'Authentication error occurred. Please try again.';
}

async function onAuthSuccess(user: User) {
  setAuthLoading(false);
  closeAuthModal();

  const name = user.displayName || user.email?.split('@')[0] || 'there';
  notifyToast(`Welcome back, ${name}! You are signed in.`, 'fa-solid fa-circle-check');

  // If user clicked "Notify" before signing in, follow that brand now
  if (pendingNotifyBrand) {
    const { id, name: bName } = pendingNotifyBrand;
    pendingNotifyBrand = null;
    setTimeout(() => {
      toggleBrandNotification(id, bName);
    }, 400);
  }
}

// Wire events for Account modal
function wireAccountModalEvents() {
  const modal = document.getElementById('bgAccountModal');
  const closeBtn = document.getElementById('acctModalCloseBtn');
  const signOutBtn = document.getElementById('acctSignOutBtn');
  const btnTogglePush = document.getElementById('btnTogglePhonePush');
  const btnTestPush = document.getElementById('btnTestPhonePush');

  closeBtn?.addEventListener('click', closeAccountModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeAccountModal();
  });

  // Enable / Request phone push notifications
  btnTogglePush?.addEventListener('click', async () => {
    const currentPermission = pushManager.getPermission();
    if (currentPermission === 'denied') {
      notifyToast('Notification permissions are blocked in your browser settings. Please unblock them in site settings.', 'fa-solid fa-triangle-exclamation');
      return;
    }

    notifyToast('Requesting phone notification permission...', 'fa-solid fa-bell');
    const res = await pushManager.requestPermission(currentUser?.uid);
    updatePushSettingsUI();
    if (res === 'granted') {
      notifyToast('Phone push notifications are now active!', 'fa-solid fa-circle-check');
      // Trigger a test alert to prove it works
      await pushManager.sendTestNotification('Sapphire');
    } else {
      notifyToast('Notification permission was not enabled.', 'fa-solid fa-circle-info');
    }
  });

  // Send test phone push notification
  btnTestPush?.addEventListener('click', async () => {
    const followedList = Array.from(followedBrands);
    const sampleBrand = followedList.length > 0 ? followedList[0] : 'Sapphire';
    const allBrands: any[] = (window as any).BRANDS || [];
    const brandObj = allBrands.find(b => b.id === sampleBrand);
    const brandName = brandObj ? brandObj.name : 'Sapphire';

    const sent = await pushManager.sendTestNotification(brandName);
    if (sent) {
      notifyToast(`Test push alert triggered for ${brandName}! Check your screen.`, 'fa-solid fa-paper-plane');
    } else {
      notifyToast('Could not trigger notification. Ensure permissions are allowed.', 'fa-solid fa-triangle-exclamation');
    }
  });

  signOutBtn?.addEventListener('click', async () => {
    try {
      await signOut(auth);
      closeAccountModal();
      followedBrands.clear();
      try {
        localStorage.removeItem('brandgali_following');
      } catch (_) {}
      updateAccountButtonUI();
      if (typeof (window as any).refreshNotifyButtonsUI === 'function') {
        (window as any).refreshNotifyButtonsUI();
      }
      notifyToast('You have been signed out successfully.', 'fa-solid fa-right-from-bracket');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  });
}

function updatePushSettingsUI() {
  const badge = document.getElementById('acctPushStatusBadge');
  const desc = document.getElementById('acctPushStatusDesc');
  const btnToggle = document.getElementById('btnTogglePhonePush');
  const btnToggleText = document.getElementById('btnTogglePhonePushText');
  const btnTest = document.getElementById('btnTestPhonePush');
  const iosNotice = document.getElementById('acctIosGuideNotice');

  if (!badge || !desc || !btnToggle) return;

  const permission = pushManager.getPermission();
  const isIOS = pushManager.isIOS();
  const isStandalone = pushManager.isStandalone();

  if (isIOS && !isStandalone) {
    if (iosNotice) iosNotice.style.display = 'block';
  } else {
    if (iosNotice) iosNotice.style.display = 'none';
  }

  if (permission === 'granted') {
    badge.className = 'acct-push-status active';
    badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Active';
    desc.textContent = 'Native phone push alerts are fully active. You will receive lock screen notifications when followed brands launch sales.';
    if (btnToggleText) btnToggleText.textContent = 'Notifications Active';
    btnToggle.style.background = '#2E7D32';
    btnToggle.setAttribute('title', 'Permissions already granted');
    if (btnTest) btnTest.style.display = 'inline-flex';
  } else if (permission === 'denied') {
    badge.className = 'acct-push-status denied';
    badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Blocked';
    desc.textContent = 'Phone notifications are blocked in your browser or device settings. To enable alerts, please tap the lock icon in your address bar and allow notifications.';
    if (btnToggleText) btnToggleText.textContent = 'Permission Blocked';
    btnToggle.style.background = '#C62828';
    if (btnTest) btnTest.style.display = 'none';
  } else if (permission === 'unsupported') {
    badge.className = 'acct-push-status inactive';
    badge.innerHTML = '<i class="fa-solid fa-circle-info"></i> In-App Only';
    desc.textContent = 'This browser environment does not support background push notifications. BrandGali will continue to show in-app sale banners.';
    if (btnToggleText) btnToggleText.textContent = 'Push Not Supported';
    btnToggle.style.display = 'none';
    if (btnTest) btnTest.style.display = 'none';
  } else {
    // Default / Not yet asked
    badge.className = 'acct-push-status inactive';
    badge.innerHTML = '<i class="fa-regular fa-bell"></i> Not Enabled';
    desc.textContent = 'Turn on phone push alerts to get immediate lock screen notifications the instant any of your followed brands drop a sale.';
    if (btnToggleText) btnToggleText.textContent = 'Enable Phone Alerts';
    btnToggle.style.background = 'var(--navy)';
    btnToggle.style.display = 'inline-flex';
    if (btnTest) btnTest.style.display = 'none';
  }
}


function updateAccountModalContent() {
  if (!currentUser) return;
  const nameEl = document.getElementById('acctUserName');
  const emailEl = document.getElementById('acctUserEmail');
  const avatarEl = document.getElementById('acctAvatarDisplay');
  const counterEl = document.getElementById('acctAlertsCounter');
  const listEl = document.getElementById('acctAlertsList');

  const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  const email = currentUser.email || '';
  const initials = (name.split(' ').map(n => n[0]).join('') || 'U').substring(0, 2).toUpperCase();

  if (nameEl) nameEl.textContent = name;
  if (emailEl) emailEl.textContent = email;

  if (avatarEl) {
    if (currentUser.photoURL) {
      avatarEl.innerHTML = `<img src="${currentUser.photoURL}" alt="${name}" referrerpolicy="no-referrer">`;
    } else {
      avatarEl.innerHTML = `<span>${initials}</span>`;
    }
  }

  const count = followedBrands.size;
  if (counterEl) {
    counterEl.textContent = `${count} brand${count === 1 ? '' : 's'}`;
  }

  if (listEl) {
    if (count === 0) {
      listEl.innerHTML = `
        <div class="acct-empty-state">
          <i class="fa-regular fa-bell-slash"></i>
          <p>You haven't set alerts for any brands yet.</p>
          <span style="font-size:11.5px;color:var(--muted);">Click "Notify" on any brand card across BrandGali to track discounts!</span>
        </div>
      `;
    } else {
      const allBrands: any[] = (window as any).BRANDS || [];
      const items = Array.from(followedBrands).map(bId => {
        const brand = allBrands.find(b => b.id === bId) || { id: bId, name: bId, category: 'Brand' };
        const badgeHTML = typeof (window as any).brandBadgeHTML === 'function' ? (window as any).brandBadgeHTML(brand, 38) : '';
        const isSale = brand.status === 'sale';
        const statusBadge = isSale ? `<span class="acct-sale-live-tag"><i class="fa-solid fa-fire"></i> SALE LIVE</span>` : '';

        return `
          <div class="acct-brand-row" id="acctRow_${brand.id}">
            ${badgeHTML}
            <div class="acct-brand-meta">
              <div class="acct-brand-title">
                <strong>${brand.name}</strong>
                ${statusBadge}
              </div>
              <span class="acct-brand-cat">${brand.category}</span>
            </div>
            <div class="acct-brand-actions">
              ${isSale ? `<button type="button" class="acct-view-deal-btn" onclick="openBrandSaleModal('${brand.id}')">View Sale</button>` : ''}
              <button type="button" class="acct-remove-alert-btn" data-brand-id="${brand.id}" data-brand-name="${brand.name}" title="Turn off sale alert">
                <i class="fa-solid fa-bell-slash"></i>
              </button>
            </div>
          </div>
        `;
      });
      listEl.innerHTML = items.join('');

      // Wire remove buttons inside modal
      listEl.querySelectorAll('.acct-remove-alert-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = e.currentTarget as HTMLElement;
          const bId = target.dataset.brandId;
          const bName = target.dataset.brandName || bId || '';
          if (bId) {
            toggleBrandNotification(bId, bName);
          }
        });
      });
    }
  }
}

export function openAuthModal(targetBrandId?: string, targetBrandName?: string) {
  ensureModalsInDOM();
  clearAuthAlerts();
  const modal = document.getElementById('bgAuthModal');
  const banner = document.getElementById('authIntentBanner');
  const brandNameSpan = document.getElementById('authIntentBrandName');

  if (targetBrandId && targetBrandName) {
    pendingNotifyBrand = { id: targetBrandId, name: targetBrandName };
    if (banner && brandNameSpan) {
      brandNameSpan.textContent = targetBrandName;
      banner.style.display = 'flex';
    }
  } else {
    pendingNotifyBrand = null;
    if (banner) banner.style.display = 'none';
  }

  modal?.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus email field
  setTimeout(() => {
    document.getElementById('authEmailInput')?.focus();
  }, 100);
}

export function closeAuthModal() {
  const modal = document.getElementById('bgAuthModal');
  modal?.classList.remove('open');
  document.body.style.overflow = '';
}

export function openAccountModal() {
  ensureModalsInDOM();
  updateAccountModalContent();
  updatePushSettingsUI();
  const modal = document.getElementById('bgAccountModal');
  modal?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeAccountModal() {
  const modal = document.getElementById('bgAccountModal');
  modal?.classList.remove('open');
  document.body.style.overflow = '';
}

// Hook into onAuthStateChanged
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    pushManager.setActiveUser(user.uid);
    listenToUserNotifications(user.uid);
  } else {
    pushManager.setActiveUser(null);
    if (notificationsUnsubscribe) {
      notificationsUnsubscribe();
      notificationsUnsubscribe = null;
    }
    followedBrands.clear();
  }
  updateAccountButtonUI();
  if (typeof (window as any).refreshNotifyButtonsUI === 'function') {
    (window as any).refreshNotifyButtonsUI();
  }
});


// Intercept Notify button clicks globally across BrandGali
export function setupNotifyInterceptors() {
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.notify-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const brandId = (btn as HTMLElement).dataset.brandId;
    if (!brandId) return;

    const allBrands: any[] = (window as any).BRANDS || [];
    const brand = allBrands.find(b => b.id === brandId);
    const brandName = brand ? brand.name : brandId;

    if (!currentUser) {
      // Prompt user to sign in / create account!
      openAuthModal(brandId, brandName);
      return;
    }

    // Authenticated user: toggle notification
    toggleBrandNotification(brandId, brandName);
  }, true); // capture phase to cleanly intercept before old handlers
}

// Global exposure
(window as any).BrandGaliAuth = {
  getCurrentUser: () => currentUser,
  getFollowedBrands: () => Array.from(followedBrands),
  isFollowing: (brandId: string) => followedBrands.has(brandId),
  toggleBrandNotification,
  openAuthModal,
  closeAuthModal,
  openAccountModal,
  closeAccountModal,
  signOut: () => signOut(auth),
  pushManager
};

// Wire homepage banner if present
function setupHomeBanner() {
  const bannerBtn = document.getElementById('webPushBannerBtn');
  if (bannerBtn) {
    bannerBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!currentUser) {
        openAuthModal();
        return;
      }
      const res = await pushManager.requestPermission(currentUser.uid);
      if (res === 'granted') {
        notifyToast('Phone push notifications active!', 'fa-solid fa-circle-check');
        await pushManager.sendTestNotification('Sapphire');
        bannerBtn.classList.add('active');
        bannerBtn.innerHTML = '<i class="fa-solid fa-check"></i> Alerts Active';
      } else {
        notifyToast('Notification permission was not enabled.', 'fa-solid fa-circle-info');
      }
    });
  }
}


// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureModalsInDOM();
    setupNotifyInterceptors();
    setupHomeBanner();
    updateAccountButtonUI();
  });
} else {
  ensureModalsInDOM();
  setupNotifyInterceptors();
  setupHomeBanner();
  updateAccountButtonUI();
}

