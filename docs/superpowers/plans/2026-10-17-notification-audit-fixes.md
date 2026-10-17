# Implementation Plan: Notification Audit & Logic Fixes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 identified notification anomalies: Clock-in verification results notification to reporter, peer report publication notification upon full approval, tag detection on comment edits, real-time like count aggregation, special schedule integration for daily reminders, server action polling optimization, and deep-link scroll navigation.

**Architecture:** Next.js 15 App Router, Feature-Driven & Clean Architecture (Repositories -> Use Cases -> Server Actions / Components).

**Tech Stack:** Next.js 15, TypeScript, Prisma ORM, PostgreSQL (Supabase), Tailwind CSS.

---

### Task 1: Clock-in Verification Result & Peer Report Publication Notifications

**Files:**
- Modify: `src/modules/notifications/types/notification.types.ts`
- Modify: `src/modules/approvals/use-cases/respond-approval.use-case.ts`
- Modify: `src/modules/notifications/components/notification-dropdown.tsx`
- Test: `test-task1-clockin-notif.ts`

- [ ] **Step 1: Write the failing test for clock-in verification approval/rejection notifications**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `APPROVAL_RESULT` notification handling and trigger peer report notification on PUBLISHED**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Verify dropdown UI icons and colors for `APPROVAL_RESULT`**

---

### Task 2: Mention Tag Detection on Comment Update

**Files:**
- Modify: `src/modules/feed/use-cases/update-comment.use-case.ts`
- Test: `test-task2-comment-edit-mention.ts`

- [ ] **Step 1: Write the failing test for mention notification when comment is edited**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement mention trigger in `UpdateCommentUseCase`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 3: Real Database Count for Like Aggregation

**Files:**
- Modify: `src/modules/notifications/use-cases/create-appreciation-notification.use-case.ts`
- Test: `test-task3-like-count.ts`

- [ ] **Step 1: Write test verifying like count accurately reflects database count after unlike/re-like**
- [ ] **Step 2: Run test to verify it fails/passes**
- [ ] **Step 3: Implement database `count` in `CreateAppreciationNotificationUseCase`**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 5: Daily Reminder SpecialSchedule & WIB Timezone Precision

**Files:**
- Modify: `src/modules/notifications/use-cases/check-daily-reminder.use-case.ts`
- Test: `test-task4-daily-reminder.ts`

- [ ] **Step 1: Write test for reminder with special schedule and WIB timezone start of day**
- [ ] **Step 2: Run test to verify behavior**
- [ ] **Step 3: Implement special schedule check and UTC-accurate WIB start of day**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 5: Polling Optimization & Deep Link Navigation

**Files:**
- Modify: `src/modules/notifications/actions/get-notifications.action.ts`
- Modify: `src/modules/notifications/components/notification-dropdown.tsx`
- Modify: `src/modules/feed/components/feed-card.tsx`
- Modify: `src/modules/notifications/use-cases/create-appreciation-notification.use-case.ts`
- Modify: `src/modules/notifications/use-cases/create-comment-mention-notification.use-case.ts`
- Modify: `src/modules/notifications/use-cases/create-peer-report-notification.use-case.ts`

- [ ] **Step 1: Embed `checkDailyReminderUseCase` inside `getNotificationsAction` and remove redundant poll in dropdown**
- [ ] **Step 2: Add `id="report-${report.id}"` to `FeedCard` and update notification links to `/feed#report-${report.id}`**
- [ ] **Step 3: Add smooth scroll handler when clicking notification on `/feed`**
- [ ] **Step 4: Verify build with `npm run build`**
