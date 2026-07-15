// src/app/security/crowd/page.tsx
// Security Crowd flow heatmap page — mounts the crowd flow component in the security route context
'use client';

import StaffCrowd from '@/app/staff/crowd/page';

export default function SecurityCrowd() {
  return <StaffCrowd />;
}
