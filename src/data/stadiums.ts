// src/data/stadiums.ts
// Complete data for all 16 FIFA World Cup 2026 stadiums

import { Stadium } from '@/types/stadium';

export const stadiums: Stadium[] = [
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'East Rutherford',
    state: 'New Jersey',
    country: 'USA',
    capacity: 82500,
    coordinates: { lat: 40.8128, lng: -74.0742 },
    timezone: 'America/New_York',
    image: '/stadiums/metlife.jpg',
    description: 'Host of the FIFA World Cup 2026 Final. Located in the New York/New Jersey metropolitan area, MetLife Stadium is one of the most iconic venues in North America.',
    facilities: [
      { id: 'metlife-f1', name: 'Main First Aid Station', type: 'first-aid', location: 'Level 1, Section 124', zoneId: 'metlife-z1', accessible: true, operatingHours: 'Match Day', description: 'Full medical staff with emergency equipment' },
      { id: 'metlife-f2', name: 'Family Fan Zone', type: 'family-zone', location: 'Plaza Level East', zoneId: 'metlife-z2', accessible: true, description: 'Kid-friendly area with activities' },
      { id: 'metlife-f3', name: 'Sensory Room', type: 'sensory-room', location: 'Level 2, Suite Area', zoneId: 'metlife-z3', accessible: true, description: 'Quiet space for sensory-sensitive guests' },
      { id: 'metlife-f4', name: 'Information Desk', type: 'information', location: 'Gate A Entrance', zoneId: 'metlife-z4', accessible: true, operatingHours: 'Gates Open - 1hr Post Match' },
      { id: 'metlife-f5', name: 'FIFA Merchandise Store', type: 'merchandise', location: 'Main Concourse West', zoneId: 'metlife-z5', accessible: true },
      { id: 'metlife-f6', name: 'Food Court North', type: 'food', location: 'Level 1, North Concourse', zoneId: 'metlife-z6', accessible: true },
      { id: 'metlife-f7', name: 'Charging Station A', type: 'charging-station', location: 'Level 1, Section 110', zoneId: 'metlife-z7', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Ramp access at all entry gates', locations: ['Gate A', 'Gate B', 'Gate C', 'Gate D'] },
      { type: 'elevator', description: 'Elevators to all levels', locations: ['NE Corner', 'NW Corner', 'SE Corner', 'SW Corner'] },
      { type: 'accessible-seating', description: 'Wheelchair-accessible seating in every section', locations: ['All Levels'] },
      { type: 'accessible-restroom', description: 'ADA-compliant restrooms on every level', locations: ['Level 1', 'Level 2', 'Level 3'] },
      { type: 'hearing-loop', description: 'Hearing loop system in select areas', locations: ['Main Concourse', 'Guest Services'] },
      { type: 'sensory-room', description: 'Dedicated quiet sensory room', locations: ['Level 2 Suite Area'] },
      { type: 'service-animal-area', description: 'Service animal relief areas', locations: ['Plaza Level East', 'Plaza Level West'] },
    ],
    transportOptions: [
      { type: 'train', name: 'NJ Transit Rail', description: 'Meadowlands Rail Line from Secaucus Junction', estimatedTime: '15 min from Secaucus', cost: '$5', ecoFriendly: true, accessible: true },
      { type: 'bus', name: 'NJ Transit Bus 160/165', description: 'Direct bus service from Port Authority NYC', estimatedTime: '30-45 min', cost: '$4.50', ecoFriendly: true, accessible: true },
      { type: 'shuttle', name: 'FIFA Fan Shuttle', description: 'Dedicated match day shuttles from Manhattan', estimatedTime: '20-30 min', cost: 'Free with ticket', ecoFriendly: true, accessible: true },
      { type: 'rideshare', name: 'Uber/Lyft Drop-off', description: 'Rideshare drop-off at Lot J', estimatedTime: 'Varies', cost: '$25-50 from NYC', ecoFriendly: false, accessible: true },
      { type: 'parking', name: 'MetLife Parking', description: 'On-site parking lots A-K', cost: '$30-75', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'metlife-gate-a', name: 'Gate A', type: 'gate', level: 0, capacity: 5000, currentOccupancy: 0, status: 'open', coordinates: { lat: 40.8138, lng: -74.0752 }, facilities: ['Information', 'Security Check'], accessibleEntry: true, exits: ['East Plaza'] },
      { id: 'metlife-gate-b', name: 'Gate B', type: 'gate', level: 0, capacity: 5000, currentOccupancy: 0, status: 'open', coordinates: { lat: 40.8118, lng: -74.0752 }, facilities: ['Information'], accessibleEntry: true, exits: ['West Plaza'] },
      { id: 'metlife-lower-100', name: 'Lower Level (100s)', type: 'seating', level: 1, section: '100', capacity: 28000, currentOccupancy: 0, status: 'open', coordinates: { lat: 40.8128, lng: -74.0742 }, facilities: ['Restrooms', 'Concessions'], accessibleEntry: true, exits: ['Concourse 1'] },
      { id: 'metlife-mezzanine-200', name: 'Mezzanine (200s)', type: 'seating', level: 2, section: '200', capacity: 25000, currentOccupancy: 0, status: 'open', coordinates: { lat: 40.8128, lng: -74.0742 }, facilities: ['Restrooms', 'Concessions'], accessibleEntry: true, exits: ['Concourse 2'] },
      { id: 'metlife-upper-300', name: 'Upper Level (300s)', type: 'seating', level: 3, section: '300', capacity: 29500, currentOccupancy: 0, status: 'open', coordinates: { lat: 40.8128, lng: -74.0742 }, facilities: ['Restrooms', 'Concessions'], accessibleEntry: true, exits: ['Concourse 3'] },
      { id: 'metlife-concourse-1', name: 'Main Concourse', type: 'concourse', level: 1, capacity: 15000, currentOccupancy: 0, status: 'open', coordinates: { lat: 40.8130, lng: -74.0745 }, facilities: ['Food', 'Beverages', 'Restrooms', 'Merchandise'], accessibleEntry: true, exits: ['Gate A', 'Gate B'] },
      { id: 'metlife-vip', name: 'VIP Suites', type: 'vip', level: 2, capacity: 3000, currentOccupancy: 0, status: 'restricted', coordinates: { lat: 40.8126, lng: -74.0740 }, facilities: ['Premium Dining', 'Private Restrooms'], accessibleEntry: true, exits: ['VIP Elevator'] },
      { id: 'metlife-medical', name: 'Medical Center', type: 'medical', level: 1, capacity: 50, currentOccupancy: 0, status: 'open', coordinates: { lat: 40.8125, lng: -74.0748 }, facilities: ['First Aid', 'AED', 'Emergency Equipment'], accessibleEntry: true, exits: ['Emergency Corridor'] },
    ],
  },
  {
    id: 'at-and-t',
    name: 'AT&T Stadium',
    city: 'Arlington',
    state: 'Texas',
    country: 'USA',
    capacity: 92967,
    coordinates: { lat: 32.7473, lng: -97.0945 },
    timezone: 'America/Chicago',
    image: '/stadiums/att.jpg',
    description: 'One of the largest stadiums in the NFL, AT&T Stadium features a retractable roof and the world\'s largest column-free interior.',
    facilities: [
      { id: 'att-f1', name: 'First Aid Station', type: 'first-aid', location: 'Level 1, Section 101', zoneId: 'att-z1', accessible: true },
      { id: 'att-f2', name: 'Fan Experience Zone', type: 'family-zone', location: 'East Plaza', zoneId: 'att-z2', accessible: true },
      { id: 'att-f3', name: 'Information Center', type: 'information', location: 'Main Entrance', zoneId: 'att-z3', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Full wheelchair accessibility', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevators at all corners', locations: ['NE', 'NW', 'SE', 'SW'] },
      { type: 'accessible-seating', description: 'ADA seating throughout', locations: ['All Levels'] },
    ],
    transportOptions: [
      { type: 'shuttle', name: 'TRE CentrePort Shuttle', description: 'Shuttle from CentrePort TRE Station', estimatedTime: '15 min', cost: '$5', ecoFriendly: true, accessible: true },
      { type: 'parking', name: 'AT&T Stadium Parking', description: 'Multiple lots surrounding stadium', cost: '$20-75', ecoFriendly: false, accessible: true },
      { type: 'rideshare', name: 'Rideshare Drop-off', description: 'Designated rideshare zone on Collins St', estimatedTime: 'Varies', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'att-gate-main', name: 'Main Entrance', type: 'gate', level: 0, capacity: 8000, currentOccupancy: 0, status: 'open', coordinates: { lat: 32.7480, lng: -97.0945 }, facilities: ['Security', 'Information'], accessibleEntry: true, exits: ['East Plaza'] },
      { id: 'att-lower', name: 'Lower Bowl', type: 'seating', level: 1, section: '100', capacity: 40000, currentOccupancy: 0, status: 'open', coordinates: { lat: 32.7473, lng: -97.0945 }, facilities: ['Restrooms', 'Concessions'], accessibleEntry: true, exits: ['Main Concourse'] },
      { id: 'att-upper', name: 'Upper Concourse', type: 'seating', level: 3, section: '400', capacity: 35000, currentOccupancy: 0, status: 'open', coordinates: { lat: 32.7473, lng: -97.0945 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Upper Exits'] },
      { id: 'att-concourse', name: 'Main Concourse', type: 'concourse', level: 1, capacity: 20000, currentOccupancy: 0, status: 'open', coordinates: { lat: 32.7475, lng: -97.0948 }, facilities: ['Food', 'Drinks', 'Merchandise'], accessibleEntry: true, exits: ['All Gates'] },
    ],
  },
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Inglewood',
    state: 'California',
    country: 'USA',
    capacity: 70240,
    coordinates: { lat: 33.9535, lng: -118.3392 },
    timezone: 'America/Los_Angeles',
    image: '/stadiums/sofi.jpg',
    description: 'A state-of-the-art indoor/outdoor stadium featuring a translucent ETFE roof and the massive Infinity Screen display.',
    facilities: [
      { id: 'sofi-f1', name: 'Medical Station', type: 'first-aid', location: 'Level 1', zoneId: 'sofi-z1', accessible: true },
      { id: 'sofi-f2', name: 'Family Zone', type: 'family-zone', location: 'American Airlines Plaza', zoneId: 'sofi-z2', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Comprehensive wheelchair access', locations: ['All Entrances'] },
      { type: 'elevator', description: 'Multiple elevator banks', locations: ['All Corners'] },
      { type: 'sensory-room', description: 'Sensory-inclusive room', locations: ['Level 2'] },
    ],
    transportOptions: [
      { type: 'metro', name: 'LA Metro K Line', description: 'Direct Metro connection at Downtown Inglewood station', estimatedTime: '10 min walk from station', cost: '$1.75', ecoFriendly: true, accessible: true },
      { type: 'shuttle', name: 'FIFA Express Shuttle', description: 'Shuttles from LAX and Downtown LA', estimatedTime: '20-40 min', cost: 'Free with ticket', ecoFriendly: true, accessible: true },
      { type: 'parking', name: 'SoFi Parking', description: 'Hollywood Park parking structures', cost: '$30-100', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'sofi-gate-a', name: 'Gate A - North', type: 'gate', level: 0, capacity: 6000, currentOccupancy: 0, status: 'open', coordinates: { lat: 33.9545, lng: -118.3392 }, facilities: ['Security', 'Info'], accessibleEntry: true, exits: ['North Plaza'] },
      { id: 'sofi-lower', name: 'Lower Bowl', type: 'seating', level: 1, capacity: 30000, currentOccupancy: 0, status: 'open', coordinates: { lat: 33.9535, lng: -118.3392 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'sofi-upper', name: 'Upper Deck', type: 'seating', level: 3, capacity: 25000, currentOccupancy: 0, status: 'open', coordinates: { lat: 33.9535, lng: -118.3392 }, facilities: ['Restrooms', 'Concessions'], accessibleEntry: true, exits: ['Upper Concourse'] },
      { id: 'sofi-concourse', name: 'Main Concourse', type: 'concourse', level: 1, capacity: 15000, currentOccupancy: 0, status: 'open', coordinates: { lat: 33.9537, lng: -118.3395 }, facilities: ['Food', 'Beverages', 'Shops'], accessibleEntry: true, exits: ['All Gates'] },
    ],
  },
  {
    id: 'hard-rock',
    name: 'Hard Rock Stadium',
    city: 'Miami Gardens',
    state: 'Florida',
    country: 'USA',
    capacity: 64767,
    coordinates: { lat: 25.9580, lng: -80.2389 },
    timezone: 'America/New_York',
    image: '/stadiums/hardrock.jpg',
    description: 'Home of the Miami Dolphins, Hard Rock Stadium features a striking canopy roof and subtropical setting.',
    facilities: [
      { id: 'hr-f1', name: 'Medical Center', type: 'first-aid', location: 'Section 154', zoneId: 'hr-z1', accessible: true },
      { id: 'hr-f2', name: 'Fan Fest Plaza', type: 'family-zone', location: 'North Plaza', zoneId: 'hr-z2', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Ramps at all gates', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevators available', locations: ['SE', 'NW', 'NE', 'SW'] },
      { type: 'accessible-seating', description: 'ADA compliant seating', locations: ['All Levels'] },
    ],
    transportOptions: [
      { type: 'shuttle', name: 'FIFA Match Day Shuttle', description: 'From downtown Miami', estimatedTime: '30 min', cost: 'Free', ecoFriendly: true, accessible: true },
      { type: 'rideshare', name: 'Ride Share Zone', description: 'Dedicated drop-off areas', estimatedTime: 'Varies', ecoFriendly: false, accessible: true },
      { type: 'parking', name: 'Stadium Parking', description: 'Surrounding lots', cost: '$25-60', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'hr-gate-1', name: 'Gate 1 - North', type: 'gate', level: 0, capacity: 5000, currentOccupancy: 0, status: 'open', coordinates: { lat: 25.9590, lng: -80.2389 }, facilities: ['Security'], accessibleEntry: true, exits: ['North Lot'] },
      { id: 'hr-lower', name: 'Lower Level', type: 'seating', level: 1, capacity: 30000, currentOccupancy: 0, status: 'open', coordinates: { lat: 25.9580, lng: -80.2389 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'hr-upper', name: 'Upper Level', type: 'seating', level: 2, capacity: 25000, currentOccupancy: 0, status: 'open', coordinates: { lat: 25.9580, lng: -80.2389 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'nrg',
    name: 'NRG Stadium',
    city: 'Houston',
    state: 'Texas',
    country: 'USA',
    capacity: 72220,
    coordinates: { lat: 29.6847, lng: -95.4107 },
    timezone: 'America/Chicago',
    image: '/stadiums/nrg.jpg',
    description: 'One of the first retractable roof stadiums in the NFL, NRG Stadium offers world-class facilities in the heart of Houston.',
    facilities: [
      { id: 'nrg-f1', name: 'Medical Station', type: 'first-aid', location: 'Section 100', zoneId: 'nrg-z1', accessible: true },
      { id: 'nrg-f2', name: 'Information Booth', type: 'information', location: 'Main Gate', zoneId: 'nrg-z2', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Accessible entry points', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevator access', locations: ['Corners'] },
    ],
    transportOptions: [
      { type: 'metro', name: 'METRORail', description: 'Red Line to NRG Park/Fannin South', estimatedTime: '20 min from downtown', cost: '$1.25', ecoFriendly: true, accessible: true },
      { type: 'parking', name: 'NRG Parking', description: 'On-site parking', cost: '$20-50', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'nrg-gate-main', name: 'Main Gate', type: 'gate', level: 0, capacity: 6000, currentOccupancy: 0, status: 'open', coordinates: { lat: 29.6857, lng: -95.4107 }, facilities: ['Security', 'Info'], accessibleEntry: true, exits: ['NRG Parkway'] },
      { id: 'nrg-lower', name: 'Lower Bowl', type: 'seating', level: 1, capacity: 35000, currentOccupancy: 0, status: 'open', coordinates: { lat: 29.6847, lng: -95.4107 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'nrg-upper', name: 'Upper Deck', type: 'seating', level: 3, capacity: 30000, currentOccupancy: 0, status: 'open', coordinates: { lat: 29.6847, lng: -95.4107 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'lincoln-financial',
    name: 'Lincoln Financial Field',
    city: 'Philadelphia',
    state: 'Pennsylvania',
    country: 'USA',
    capacity: 69796,
    coordinates: { lat: 39.9008, lng: -75.1675 },
    timezone: 'America/New_York',
    image: '/stadiums/lincoln.jpg',
    description: 'Home of the Philadelphia Eagles, Lincoln Financial Field is one of the greenest stadiums in professional sports.',
    facilities: [
      { id: 'lff-f1', name: 'First Aid', type: 'first-aid', location: 'Section 117', zoneId: 'lff-z1', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Accessible ramps', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevator service', locations: ['All Corners'] },
    ],
    transportOptions: [
      { type: 'metro', name: 'SEPTA Broad Street Line', description: 'Direct subway to AT&T Station', estimatedTime: '15 min from Center City', cost: '$2.50', ecoFriendly: true, accessible: true },
      { type: 'parking', name: 'Stadium Parking', description: 'Sports Complex lots', cost: '$25-50', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'lff-gate-main', name: 'Main Gate', type: 'gate', level: 0, capacity: 5000, currentOccupancy: 0, status: 'open', coordinates: { lat: 39.9015, lng: -75.1675 }, facilities: ['Security'], accessibleEntry: true, exits: ['Pattison Ave'] },
      { id: 'lff-lower', name: 'Lower Level', type: 'seating', level: 1, capacity: 35000, currentOccupancy: 0, status: 'open', coordinates: { lat: 39.9008, lng: -75.1675 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'lff-upper', name: 'Upper Level', type: 'seating', level: 3, capacity: 25000, currentOccupancy: 0, status: 'open', coordinates: { lat: 39.9008, lng: -75.1675 }, facilities: ['Restrooms'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'levis',
    name: 'Levi\'s Stadium',
    city: 'Santa Clara',
    state: 'California',
    country: 'USA',
    capacity: 68500,
    coordinates: { lat: 37.4033, lng: -121.9694 },
    timezone: 'America/Los_Angeles',
    image: '/stadiums/levis.jpg',
    description: 'A LEED Gold certified stadium, Levi\'s Stadium is a model of sustainability with its green roof and solar panels.',
    facilities: [
      { id: 'lev-f1', name: 'Medical', type: 'first-aid', location: 'Section 101', zoneId: 'lev-z1', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'ADA-compliant access', locations: ['All Entrances'] },
      { type: 'elevator', description: 'Elevator access', locations: ['All Tower Entries'] },
    ],
    transportOptions: [
      { type: 'train', name: 'VTA Light Rail', description: 'Great America Station directly adjacent', estimatedTime: '2 min walk', cost: '$2.50', ecoFriendly: true, accessible: true },
      { type: 'bicycle', name: 'Bike Parking', description: 'Free bike valet on match days', cost: 'Free', ecoFriendly: true, accessible: false },
      { type: 'parking', name: 'Stadium Lots', description: 'Adjacent parking', cost: '$40-80', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'lev-gate-main', name: 'Main Gate', type: 'gate', level: 0, capacity: 5000, currentOccupancy: 0, status: 'open', coordinates: { lat: 37.4040, lng: -121.9694 }, facilities: ['Security', 'Info'], accessibleEntry: true, exits: ['Tasman Dr'] },
      { id: 'lev-lower', name: 'Lower Level', type: 'seating', level: 1, capacity: 30000, currentOccupancy: 0, status: 'open', coordinates: { lat: 37.4033, lng: -121.9694 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'lev-upper', name: 'Upper Level', type: 'seating', level: 3, capacity: 28000, currentOccupancy: 0, status: 'open', coordinates: { lat: 37.4033, lng: -121.9694 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    state: 'Georgia',
    country: 'USA',
    capacity: 71000,
    coordinates: { lat: 33.7553, lng: -84.4006 },
    timezone: 'America/New_York',
    image: '/stadiums/mercedes.jpg',
    description: 'Known for its unique retractable roof resembling a camera aperture and its commitment to sustainability.',
    facilities: [
      { id: 'mb-f1', name: 'Medical Center', type: 'first-aid', location: 'Section 120', zoneId: 'mb-z1', accessible: true },
      { id: 'mb-f2', name: 'Prayer Room', type: 'prayer-room', location: 'Level 200', zoneId: 'mb-z2', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Full wheelchair accessibility', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevators throughout', locations: ['All Sections'] },
      { type: 'sensory-room', description: 'Sensory-inclusive suite', locations: ['Level 200'] },
    ],
    transportOptions: [
      { type: 'metro', name: 'MARTA Rail', description: 'Vine City or GWCC/Philips Arena stations', estimatedTime: '5 min walk', cost: '$2.50', ecoFriendly: true, accessible: true },
      { type: 'shuttle', name: 'Fan Shuttle', description: 'From downtown hotels', estimatedTime: '10 min', cost: 'Free', ecoFriendly: true, accessible: true },
    ],
    zones: [
      { id: 'mb-gate-main', name: 'Main Entry', type: 'gate', level: 0, capacity: 7000, currentOccupancy: 0, status: 'open', coordinates: { lat: 33.7560, lng: -84.4006 }, facilities: ['Security'], accessibleEntry: true, exits: ['GWCC Blvd'] },
      { id: 'mb-lower', name: 'Lower Bowl', type: 'seating', level: 1, capacity: 35000, currentOccupancy: 0, status: 'open', coordinates: { lat: 33.7553, lng: -84.4006 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse 100'] },
      { id: 'mb-upper', name: 'Upper Bowl', type: 'seating', level: 3, capacity: 28000, currentOccupancy: 0, status: 'open', coordinates: { lat: 33.7553, lng: -84.4006 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse 300'] },
    ],
  },
  {
    id: 'centurylink',
    name: 'Lumen Field',
    city: 'Seattle',
    state: 'Washington',
    country: 'USA',
    capacity: 69000,
    coordinates: { lat: 47.5952, lng: -122.3316 },
    timezone: 'America/Los_Angeles',
    image: '/stadiums/lumen.jpg',
    description: 'One of the loudest stadiums in the world, Lumen Field offers stunning views of the Seattle skyline.',
    facilities: [
      { id: 'lf-f1', name: 'First Aid', type: 'first-aid', location: 'Section 100', zoneId: 'lf-z1', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Accessible entry', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevator service', locations: ['N & S Towers'] },
    ],
    transportOptions: [
      { type: 'train', name: 'Link Light Rail', description: 'Stadium Station directly adjacent', estimatedTime: '1 min walk', cost: '$2.75', ecoFriendly: true, accessible: true },
      { type: 'bus', name: 'King County Metro', description: 'Multiple routes to stadium', estimatedTime: 'Varies', cost: '$2.75', ecoFriendly: true, accessible: true },
    ],
    zones: [
      { id: 'lf-gate-n', name: 'North Gate', type: 'gate', level: 0, capacity: 5000, currentOccupancy: 0, status: 'open', coordinates: { lat: 47.5960, lng: -122.3316 }, facilities: ['Security'], accessibleEntry: true, exits: ['Occidental Ave'] },
      { id: 'lf-lower', name: 'Lower Bowl', type: 'seating', level: 1, capacity: 35000, currentOccupancy: 0, status: 'open', coordinates: { lat: 47.5952, lng: -122.3316 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'lf-upper', name: 'Upper Deck', type: 'seating', level: 3, capacity: 25000, currentOccupancy: 0, status: 'open', coordinates: { lat: 47.5952, lng: -122.3316 }, facilities: ['Restrooms'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'arrowhead',
    name: 'GEHA Field at Arrowhead Stadium',
    city: 'Kansas City',
    state: 'Missouri',
    country: 'USA',
    capacity: 76416,
    coordinates: { lat: 39.0489, lng: -94.4839 },
    timezone: 'America/Chicago',
    image: '/stadiums/arrowhead.jpg',
    description: 'The legendary home of the Kansas City Chiefs, known for its iconic rolling roof design and passionate fans.',
    facilities: [
      { id: 'ah-f1', name: 'Medical', type: 'first-aid', location: 'Section 101', zoneId: 'ah-z1', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Accessible gates', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevator access', locations: ['All Corners'] },
    ],
    transportOptions: [
      { type: 'shuttle', name: 'KC Match Day Express', description: 'From Union Station downtown', estimatedTime: '20 min', cost: '$5', ecoFriendly: true, accessible: true },
      { type: 'parking', name: 'Arrowhead Lots', description: 'Surrounding parking areas', cost: '$25-60', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'ah-gate-main', name: 'Main Gate', type: 'gate', level: 0, capacity: 6000, currentOccupancy: 0, status: 'open', coordinates: { lat: 39.0496, lng: -94.4839 }, facilities: ['Security'], accessibleEntry: true, exits: ['Red Lot'] },
      { id: 'ah-lower', name: 'Lower Level', type: 'seating', level: 1, capacity: 40000, currentOccupancy: 0, status: 'open', coordinates: { lat: 39.0489, lng: -94.4839 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'ah-upper', name: 'Upper Level', type: 'seating', level: 3, capacity: 30000, currentOccupancy: 0, status: 'open', coordinates: { lat: 39.0489, lng: -94.4839 }, facilities: ['Restrooms'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'gillette',
    name: 'Gillette Stadium',
    city: 'Foxborough',
    state: 'Massachusetts',
    country: 'USA',
    capacity: 65878,
    coordinates: { lat: 42.0909, lng: -71.2643 },
    timezone: 'America/New_York',
    image: '/stadiums/gillette.jpg',
    description: 'Home of the New England Patriots and Revolution, Gillette Stadium is the centerpiece of Patriot Place.',
    facilities: [
      { id: 'gs-f1', name: 'Medical Station', type: 'first-aid', location: 'Section 105', zoneId: 'gs-z1', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Accessible entry', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevators available', locations: ['NW', 'SE'] },
    ],
    transportOptions: [
      { type: 'train', name: 'MBTA Commuter Rail', description: 'Special event trains from Boston South Station', estimatedTime: '45 min', cost: '$12', ecoFriendly: true, accessible: true },
      { type: 'parking', name: 'Patriot Place Lots', description: 'Extensive parking facilities', cost: '$30-60', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'gs-gate-main', name: 'Main Gate', type: 'gate', level: 0, capacity: 5000, currentOccupancy: 0, status: 'open', coordinates: { lat: 42.0916, lng: -71.2643 }, facilities: ['Security'], accessibleEntry: true, exits: ['Patriot Place'] },
      { id: 'gs-lower', name: 'Lower Bowl', type: 'seating', level: 1, capacity: 32000, currentOccupancy: 0, status: 'open', coordinates: { lat: 42.0909, lng: -71.2643 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'gs-upper', name: 'Upper Level', type: 'seating', level: 3, capacity: 25000, currentOccupancy: 0, status: 'open', coordinates: { lat: 42.0909, lng: -71.2643 }, facilities: ['Restrooms'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'estadio-azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    state: 'CDMX',
    country: 'Mexico',
    capacity: 87523,
    coordinates: { lat: 19.3029, lng: -99.1505 },
    timezone: 'America/Mexico_City',
    image: '/stadiums/azteca.jpg',
    description: 'The legendary Estadio Azteca — the only stadium to host two FIFA World Cup Finals (1970, 1986). A cathedral of football.',
    facilities: [
      { id: 'az-f1', name: 'Centro Médico', type: 'first-aid', location: 'Sección 100', zoneId: 'az-z1', accessible: true },
      { id: 'az-f2', name: 'Centro de Información', type: 'information', location: 'Entrada Principal', zoneId: 'az-z2', accessible: true },
      { id: 'az-f3', name: 'Sala de Oración', type: 'prayer-room', location: 'Nivel 2', zoneId: 'az-z3', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Rampas de acceso', locations: ['Puerta 1', 'Puerta 15'] },
      { type: 'elevator', description: 'Elevadores', locations: ['Torre Norte', 'Torre Sur'] },
      { type: 'accessible-seating', description: 'Asientos accesibles', locations: ['Nivel Inferior'] },
    ],
    transportOptions: [
      { type: 'metro', name: 'Metro CDMX Línea 2', description: 'Estación Estadio Azteca, adjacent to venue', estimatedTime: '2 min walk', cost: '$5 MXN', ecoFriendly: true, accessible: true },
      { type: 'bus', name: 'Metrobús Línea 1', description: 'Estación Estadio Azteca', estimatedTime: '5 min walk', cost: '$6 MXN', ecoFriendly: true, accessible: true },
      { type: 'rideshare', name: 'Uber/DiDi', description: 'Zona de descenso designada', estimatedTime: 'Varies', ecoFriendly: false, accessible: true },
    ],
    zones: [
      { id: 'az-puerta-1', name: 'Puerta 1 (Gate 1)', type: 'gate', level: 0, capacity: 8000, currentOccupancy: 0, status: 'open', coordinates: { lat: 19.3035, lng: -99.1505 }, facilities: ['Seguridad', 'Información'], accessibleEntry: true, exits: ['Calzada de Tlalpan'] },
      { id: 'az-lower', name: 'Nivel Inferior (Lower)', type: 'seating', level: 1, capacity: 40000, currentOccupancy: 0, status: 'open', coordinates: { lat: 19.3029, lng: -99.1505 }, facilities: ['Baños', 'Comida'], accessibleEntry: true, exits: ['Pasillo Principal'] },
      { id: 'az-upper', name: 'Nivel Superior (Upper)', type: 'seating', level: 3, capacity: 35000, currentOccupancy: 0, status: 'open', coordinates: { lat: 19.3029, lng: -99.1505 }, facilities: ['Baños', 'Comida'], accessibleEntry: true, exits: ['Salidas Superiores'] },
    ],
  },
  {
    id: 'estadio-akron',
    name: 'Estadio Akron',
    city: 'Guadalajara',
    state: 'Jalisco',
    country: 'Mexico',
    capacity: 49850,
    coordinates: { lat: 20.6810, lng: -103.4624 },
    timezone: 'America/Mexico_City',
    image: '/stadiums/akron.jpg',
    description: 'A volcano-inspired architectural marvel, Estadio Akron (Chivas Stadium) is one of Mexico\'s most modern venues.',
    facilities: [
      { id: 'ak-f1', name: 'Centro Médico', type: 'first-aid', location: 'Nivel 1', zoneId: 'ak-z1', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Rampas accesibles', locations: ['Todas las Puertas'] },
      { type: 'elevator', description: 'Elevadores', locations: ['Torre Principal'] },
    ],
    transportOptions: [
      { type: 'bus', name: 'Macrobús Línea 1', description: 'Servicio directo', estimatedTime: '30 min from centro', cost: '$9.50 MXN', ecoFriendly: true, accessible: true },
      { type: 'shuttle', name: 'FIFA Shuttle', description: 'From hotels zone', estimatedTime: '20 min', cost: 'Gratis', ecoFriendly: true, accessible: true },
    ],
    zones: [
      { id: 'ak-gate-main', name: 'Entrada Principal', type: 'gate', level: 0, capacity: 4000, currentOccupancy: 0, status: 'open', coordinates: { lat: 20.6817, lng: -103.4624 }, facilities: ['Seguridad'], accessibleEntry: true, exits: ['Estacionamiento'] },
      { id: 'ak-lower', name: 'Nivel Bajo', type: 'seating', level: 1, capacity: 25000, currentOccupancy: 0, status: 'open', coordinates: { lat: 20.6810, lng: -103.4624 }, facilities: ['Baños', 'Comida'], accessibleEntry: true, exits: ['Pasillo'] },
      { id: 'ak-upper', name: 'Nivel Alto', type: 'seating', level: 2, capacity: 20000, currentOccupancy: 0, status: 'open', coordinates: { lat: 20.6810, lng: -103.4624 }, facilities: ['Baños'], accessibleEntry: true, exits: ['Salidas'] },
    ],
  },
  {
    id: 'estadio-bbva',
    name: 'Estadio BBVA',
    city: 'Monterrey',
    state: 'Nuevo León',
    country: 'Mexico',
    capacity: 53500,
    coordinates: { lat: 25.6700, lng: -100.2440 },
    timezone: 'America/Monterrey',
    image: '/stadiums/bbva.jpg',
    description: 'Known for its stunning mountain backdrop of Cerro de la Silla, Estadio BBVA is one of the most scenic football venues in the world.',
    facilities: [
      { id: 'bbva-f1', name: 'Centro Médico', type: 'first-aid', location: 'Sección A', zoneId: 'bbva-z1', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Acceso para sillas de ruedas', locations: ['Todas las Entradas'] },
      { type: 'elevator', description: 'Servicio de elevador', locations: ['Torre Norte', 'Torre Sur'] },
    ],
    transportOptions: [
      { type: 'metro', name: 'Metrorrey Línea 1', description: 'Estación Parque Fundidora', estimatedTime: '10 min walk', cost: '$4.50 MXN', ecoFriendly: true, accessible: true },
      { type: 'shuttle', name: 'FIFA Shuttle MTY', description: 'From Macroplaza', estimatedTime: '15 min', cost: 'Gratis', ecoFriendly: true, accessible: true },
    ],
    zones: [
      { id: 'bbva-gate-main', name: 'Puerta Principal', type: 'gate', level: 0, capacity: 4000, currentOccupancy: 0, status: 'open', coordinates: { lat: 25.6707, lng: -100.2440 }, facilities: ['Seguridad'], accessibleEntry: true, exits: ['Av. Pablo Livas'] },
      { id: 'bbva-lower', name: 'Nivel Inferior', type: 'seating', level: 1, capacity: 28000, currentOccupancy: 0, status: 'open', coordinates: { lat: 25.6700, lng: -100.2440 }, facilities: ['Baños', 'Comida'], accessibleEntry: true, exits: ['Pasillo'] },
      { id: 'bbva-upper', name: 'Nivel Superior', type: 'seating', level: 2, capacity: 20000, currentOccupancy: 0, status: 'open', coordinates: { lat: 25.6700, lng: -100.2440 }, facilities: ['Baños'], accessibleEntry: true, exits: ['Salidas'] },
    ],
  },
  {
    id: 'bmo-field',
    name: 'BMO Field',
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    capacity: 45736,
    coordinates: { lat: 43.6332, lng: -79.4186 },
    timezone: 'America/Toronto',
    image: '/stadiums/bmo.jpg',
    description: 'Canada\'s premier soccer-specific stadium, located on the scenic Exhibition Place grounds along Toronto\'s waterfront.',
    facilities: [
      { id: 'bmo-f1', name: 'Medical Station', type: 'first-aid', location: 'Section 105', zoneId: 'bmo-z1', accessible: true },
      { id: 'bmo-f2', name: 'Information Desk', type: 'information', location: 'Gate 1', zoneId: 'bmo-z2', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Accessible entrances', locations: ['Gate 1', 'Gate 3'] },
      { type: 'elevator', description: 'Elevator access', locations: ['West Stand', 'East Stand'] },
      { type: 'accessible-seating', description: 'Wheelchair platforms', locations: ['All Levels'] },
    ],
    transportOptions: [
      { type: 'train', name: 'GO Transit/UP Express', description: 'Exhibition GO Station nearby', estimatedTime: '5 min walk', cost: '$3.70 CAD', ecoFriendly: true, accessible: true },
      { type: 'bus', name: 'TTC Streetcar 509/511', description: 'Exhibition Loop stop', estimatedTime: '2 min walk', cost: '$3.35 CAD', ecoFriendly: true, accessible: true },
      { type: 'bicycle', name: 'Bike Share Toronto', description: 'Bike Share stations nearby', cost: '$3.25 CAD', ecoFriendly: true, accessible: false },
    ],
    zones: [
      { id: 'bmo-gate-1', name: 'Gate 1 - South', type: 'gate', level: 0, capacity: 3000, currentOccupancy: 0, status: 'open', coordinates: { lat: 43.6325, lng: -79.4186 }, facilities: ['Security', 'Info'], accessibleEntry: true, exits: ['Manitoba Dr'] },
      { id: 'bmo-lower', name: 'Lower Bowl', type: 'seating', level: 1, capacity: 22000, currentOccupancy: 0, status: 'open', coordinates: { lat: 43.6332, lng: -79.4186 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'bmo-upper', name: 'Upper Deck', type: 'seating', level: 2, capacity: 18000, currentOccupancy: 0, status: 'open', coordinates: { lat: 43.6332, lng: -79.4186 }, facilities: ['Restrooms'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
  {
    id: 'bc-place',
    name: 'BC Place',
    city: 'Vancouver',
    state: 'British Columbia',
    country: 'Canada',
    capacity: 54500,
    coordinates: { lat: 49.2768, lng: -123.1118 },
    timezone: 'America/Vancouver',
    image: '/stadiums/bcplace.jpg',
    description: 'Canada\'s largest retractable roof stadium, BC Place anchors Vancouver\'s stunning False Creek waterfront.',
    facilities: [
      { id: 'bc-f1', name: 'Medical Center', type: 'first-aid', location: 'Section 201', zoneId: 'bc-z1', accessible: true },
      { id: 'bc-f2', name: 'Guest Services', type: 'information', location: 'Gate A', zoneId: 'bc-z2', accessible: true },
    ],
    accessibilityFeatures: [
      { type: 'wheelchair-ramp', description: 'Full wheelchair access', locations: ['All Gates'] },
      { type: 'elevator', description: 'Elevators at all entry points', locations: ['Gates A-H'] },
      { type: 'hearing-loop', description: 'Hearing assistance', locations: ['Guest Services', 'Lower Bowl'] },
    ],
    transportOptions: [
      { type: 'train', name: 'SkyTrain', description: 'Stadium-Chinatown Station directly adjacent', estimatedTime: '1 min walk', cost: '$3.15 CAD', ecoFriendly: true, accessible: true },
      { type: 'bus', name: 'TransLink Bus', description: 'Multiple routes nearby', estimatedTime: '5 min walk', cost: '$3.15 CAD', ecoFriendly: true, accessible: true },
      { type: 'bicycle', name: 'Mobi Bike Share', description: 'Stations at False Creek', cost: '$2.50 CAD', ecoFriendly: true, accessible: false },
    ],
    zones: [
      { id: 'bc-gate-a', name: 'Gate A - East', type: 'gate', level: 0, capacity: 4000, currentOccupancy: 0, status: 'open', coordinates: { lat: 49.2775, lng: -123.1110 }, facilities: ['Security', 'Info'], accessibleEntry: true, exits: ['Terry Fox Way'] },
      { id: 'bc-lower', name: 'Lower Bowl', type: 'seating', level: 1, capacity: 27000, currentOccupancy: 0, status: 'open', coordinates: { lat: 49.2768, lng: -123.1118 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Concourse'] },
      { id: 'bc-upper', name: 'Upper Bowl', type: 'seating', level: 3, capacity: 22000, currentOccupancy: 0, status: 'open', coordinates: { lat: 49.2768, lng: -123.1118 }, facilities: ['Restrooms', 'Food'], accessibleEntry: true, exits: ['Upper Exits'] },
    ],
  },
];

/**
 * Get a stadium by its ID.
 */
export function getStadiumById(id: string): Stadium | undefined {
  return stadiums.find((s) => s.id === id);
}

/**
 * Get stadiums by country.
 */
export function getStadiumsByCountry(country: 'USA' | 'Mexico' | 'Canada'): Stadium[] {
  return stadiums.filter((s) => s.country === country);
}

/**
 * Get all stadium IDs.
 */
export function getStadiumIds(): string[] {
  return stadiums.map((s) => s.id);
}
