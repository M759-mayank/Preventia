# Preventia Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants

1. **Strict Tenant & PII Isolation**: Every document under `/users/{userId}` and all of its subcollections (`logins`, `vitals`, `vaccinations`, `medications`, `appointments`, `medicalRecords`, `consultMessages`) belongs exclusively to `request.auth.uid == userId` with verified email identity (`request.auth.token.email_verified == true` or authenticated password credential).
2. **Master Gate Relational Sync**: Subcollection writes and reads require that the parent `/users/{userId}` document exists (`exists(/databases/$(database)/documents/users/$(userId))`).
3. **Immutable Ownership & Temporal Integrity**: `uid`, `userId`, `email`, and `createdAt` are strictly immutable across all updates. `createdAt` on `create` and `updatedAt` on `create`/`update` must equal `request.time`. Login records in `/users/{userId}/logins/{loginId}` are append-only audit entries.
4. **Terminal State Locking**: Appointments in terminal states (`Completed` or `Cancelled`) cannot be updated further.
5. **Strict Key & Size Bounds**: Every string field enforces exact maximum length bounds matching `firebase-blueprint.json` (including `contactNumber` and `PersonalDoctor.contactPhone` matching `^[0-9+\-\s]{10,20}$`, `email` format up to 160 chars), and `hasAll`/`hasOnly` prevents shadow fields.

## 2. The "Dirty Dozen" Payloads

1. **Unverified Email Write**: Authenticated user with `email_verified: false` creating `/users/{userId}`. -> `PERMISSION_DENIED`
2. **Cross-Tenant PII Read**: User `user_A` reading `/users/user_B` or `/users/user_B/logins`. -> `PERMISSION_DENIED`
3. **Shadow Field Injection**: Creating `/users/{userId}` with extra field `"isAdmin": true`. -> `PERMISSION_DENIED`
4. **Orphaned Subcollection Write**: Creating `/users/{userId}/vitals/v1` or `/users/{userId}/logins/l1` when `/users/{userId}` does not exist. -> `PERMISSION_DENIED`
5. **Identity Spoofing in Payload**: User `user_A` creating `/users/user_A/vitals/v1` with `userId: "user_B"`. -> `PERMISSION_DENIED`
6. **Spoofed Client Timestamp**: Creating `/users/user_A/medications/m1` with a past `createdAt` timestamp instead of `request.time`. -> `PERMISSION_DENIED`
7. **Immutable Field Mutation**: Updating `createdAt` or `userId` on `/users/user_A/appointments/a1`. -> `PERMISSION_DENIED`
8. **Terminal State Bypass**: Updating an Appointment whose existing `status` is `'Completed'` back to `'Scheduled'`. -> `PERMISSION_DENIED`
9. **Oversized String Denial-of-Wallet**: Creating an `EncryptedMedicalRecord` with `encryptedPayload` > 4000 chars. -> `PERMISSION_DENIED`
10. **Path ID Poisoning**: Creating `/users/user_A/vitals/invalid$id!@#` failing `^[a-zA-Z0-9_\-]+$`. -> `PERMISSION_DENIED`
11. **Invalid Enum Value**: Setting `preferredLanguage` to `'fr'` instead of `['en', 'hi', 'mr']`. -> `PERMISSION_DENIED`
12. **Unauthorized Partial Update Keys**: Updating `medicineName` on `medications` when only `takenToday` and `updatedAt` are allowed in the toggle action. -> `PERMISSION_DENIED`

## 3. Test Runner Specification (`firestore.rules.test.ts`)

All 12 Dirty Dozen payloads are tested against the ruleset to guarantee `PERMISSION_DENIED`.
