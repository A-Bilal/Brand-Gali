# Security Specification: BrandGali User Accounts & Notifications

## 1. Data Invariants

1. **Strict User Isolation**: A user can only access, view, create, modify, or delete their own user account document (`/users/{userId}`) and their own notification subscriptions (`/users/{userId}/notifications/{brandId}`).
2. **Identity Integrity**: All documents under `/users/{userId}` must have `uid == request.auth.uid` or `userId == request.auth.uid`. No user may forge another user's ID or access another user's alert subscriptions.
3. **No Blanket Reads**: Public or unauthenticated queries on `/users` or any user's subcollections are forbidden.
4. **Valid Brand Identifiers**: `brandId` path variable and field must strictly match `^[a-zA-Z0-9_\\-]+$` and not exceed 64 characters.
5. **No Shadow Fields**: Only whitelisted schema fields are permitted during creation and updates (`hasOnly` validation).
6. **Immutable Timestamps & Keys**: `createdAt` and identity keys cannot be modified once set.

## 2. The "Dirty Dozen" Attack Payloads

1. **Unauthenticated Read on User Profile**:
   - Request: `GET /users/user_123` with `auth: null`
   - Expected: `PERMISSION_DENIED`
2. **Cross-User Profile Read**:
   - Request: `GET /users/user_victim` with `auth.uid = "user_attacker"`
   - Expected: `PERMISSION_DENIED`
3. **Identity Spoofing Profile Create**:
   - Payload: `{ uid: "user_victim", email: "victim@example.com", displayName: "Victim", createdAt: "2026-09-22T00:00:00Z" }`
   - Request: `POST /users/user_victim` with `auth.uid = "user_attacker"`
   - Expected: `PERMISSION_DENIED`
4. **Shadow Field Injection in Profile**:
   - Payload: `{ uid: "user_123", email: "user@example.com", displayName: "User", isAdmin: true, createdAt: "2026-09-22T00:00:00Z" }`
   - Request: `POST /users/user_123` with `auth.uid = "user_123"`
   - Expected: `PERMISSION_DENIED`
5. **Cross-User Alert Subscription Creation**:
   - Payload: `{ brandId: "khaadi", brandName: "Khaadi", userId: "user_victim", enabled: true, createdAt: "2026-09-22T00:00:00Z" }`
   - Request: `POST /users/user_victim/notifications/khaadi` with `auth.uid = "user_attacker"`
   - Expected: `PERMISSION_DENIED`
6. **Path Traversal / Junk Brand ID Injection**:
   - Request: `POST /users/user_123/notifications/../../admin` with `auth.uid = "user_123"`
   - Expected: `PERMISSION_DENIED`
7. **Oversized String / Denial-of-Wallet Payload**:
   - Payload: `{ brandId: "khaadi", brandName: "A".repeat(5000), userId: "user_123", enabled: true, createdAt: "2026-09-22T00:00:00Z" }`
   - Request: `POST /users/user_123/notifications/khaadi` with `auth.uid = "user_123"`
   - Expected: `PERMISSION_DENIED`
8. **Tampering with Alert Owner ID on Update**:
   - Payload: `{ userId: "user_other" }`
   - Request: `PATCH /users/user_123/notifications/khaadi` with `auth.uid = "user_123"`
   - Expected: `PERMISSION_DENIED`
9. **Global Collection List Query Attempt**:
   - Request: `GET /users` with query `auth.uid = "user_123"`
   - Expected: `PERMISSION_DENIED`
10. **Unauthenticated Alert Modification**:
    - Request: `DELETE /users/user_123/notifications/khaadi` with `auth: null`
    - Expected: `PERMISSION_DENIED`
11. **Malicious Special Characters in Brand ID**:
    - Request: `POST /users/user_123/notifications/<script>` with `auth.uid = "user_123"`
    - Expected: `PERMISSION_DENIED`
12. **Unauthenticated List on User Alerts**:
    - Request: `GET /users/user_123/notifications` with `auth: null`
    - Expected: `PERMISSION_DENIED`
