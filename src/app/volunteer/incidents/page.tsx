// src/app/volunteer/incidents/page.tsx
// Volunteer Incidents page — redirects or wraps the incidents management component

'use client';

import StaffIncidents from '@/app/staff/incidents/page';

export default function VolunteerIncidents() {
  return <StaffIncidents />;
}
