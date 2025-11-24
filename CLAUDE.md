# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**The JDGA Official App** is a comprehensive golf course tracking and management app for serious recreational golfers. Built for players who have played thousands of rounds across top-ranked courses in the US and internationally.

### Target User Profile

- Plays 100-200 rounds per year
- Can name the top 25 US courses off the top of their head
- Plays across the top 250 US courses over multiple years
- Collects scoring pencils from top courses played
- Recalls best scores at virtually every course played
- Member at one or more private clubs
- Travels specifically for golf

### Key Features

1. **Course Database** - Top 200 world-ranked courses (US and international)
2. **Course Tracking** - Mark courses as played, track times played, best scores
3. **Scorecards** - Manual entry or OCR camera import
4. **Golf Buddies** - Contact management for playing partners
5. **Membership Tracking** - Who you know that's a member, who knows someone
6. **Favorites** - Favorite holes (per course and global ranking), drinks, menu items
7. **Merch Wishlist** - Apparel/souvenirs to buy at each clubhouse
8. **Travel Info** - Airports, hotels, restaurants near each course
9. **Tournament History** - Major championship hosts and results
10. **Trip Planning** - Weather-based course suggestions

---

## Development Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
```

**Note**: No `type-check` script exists - use `npx tsc --noEmit` directly.

---

## Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router v7** for navigation
- **Tailwind CSS v4** (but currently using inline styles due to rendering issues)
- **local-db-storage** (IndexedDB wrapper) for persistence
- **Lucide React** for icons
- **Sonner** for toast notifications

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── PageHeader.tsx      # Standard and LargeHeader components
│   └── courses/
│       └── CourseCard.tsx      # Course list item component
├── pages/
│   ├── courses/
│   │   ├── CoursesHomePage.tsx     # Main courses navigation
│   │   ├── TopUSCoursesPage.tsx    # Filterable US courses list
│   │   └── CourseDetailPage.tsx    # Individual course view
│   ├── scorecards/
│   │   ├── ScorecardsPage.tsx      # Scorecard list with stats
│   │   └── AddScorecardPage.tsx    # Two-step: select course, then entry method
│   ├── buddies/
│   │   └── BuddiesPage.tsx         # Golf contacts management
│   ├── trips/
│   │   └── TripsPage.tsx           # Trip planning
│   └── profile/
│       └── ProfilePage.tsx         # User profile and settings
├── lib/
│   └── storage/
│       ├── db.ts                   # IndexedDB wrapper utilities
│       ├── courseStorage.ts        # Course CRUD operations
│       ├── contactStorage.ts       # Contact CRUD operations
│       ├── scorecardStorage.ts     # Scorecard CRUD operations
│       └── index.ts                # Re-exports all storage functions
├── types/
│   ├── course.ts                   # Course, UserCourseRecord, etc.
│   ├── contact.ts                  # GolfContact type
│   ├── scorecard.ts                # Scorecard type
│   └── index.ts                    # Re-exports all types
└── data/
    └── courses/
        ├── topUSCourses.ts         # Seed data (currently 15 courses)
        ├── courses.csv             # CSV template (partial data)
        ├── us_courses.csv          # US courses CSV template
        └── international_courses.csv # International courses CSV template
```

---

## Path Alias

Use `@/` to import from `src/`:

```typescript
import { Button } from '@/components/ui/button';
import { getAllCourses } from '@/lib/storage';
import type { Course } from '@/types';
```

---

## Core Data Models

### Course

```typescript
interface Course {
  id: string;
  name: string;
  clubName: string;
  city: string;
  state: string;
  country: string;
  continent: 'North America' | 'Europe' | 'Asia' | 'Oceania' | 'Africa' | 'South America';

  // Rankings
  usRanking?: number;           // Top 100/250 US ranking
  worldRanking?: number;        // World ranking (Golf Digest)
  rankingSource?: string;
  rankingYear?: number;

  // Course Details
  courseType: 'Public' | 'Private' | 'Resort' | 'Semi-Private';
  numberOfCourses: number;
  courseNames: string[];
  designer: string;
  coDesigners?: string[];
  yearOpened: number;

  // Technical
  teeBoxes: TeeBox[];
  par: number;
  holes: HoleInfo[];

  // Tournament History
  majorTournaments: TournamentHosting[];

  // Contact & Location
  address: string;
  phone: string;
  website?: string;

  // Travel
  closestPublicAirport?: AirportInfo;
  closestPrivateAirport?: AirportInfo;
  nearbyHotels: Hotel[];
  nearbyRestaurants: Restaurant[];

  // Weather
  optimalMonths: number[];      // 1-12
}
```

### UserCourseRecord

User's personal data for each course:

```typescript
interface UserCourseRecord {
  id: string;
  courseId: string;
  hasPlayed: boolean;
  status?: 'played' | 'planning' | 'wishlist' | 'not-interested' | 'none';
  timesPlayed: number;
  estimatedTimesPlayed: boolean;
  desiredFrequency: 'multiple_per_year' | 'yearly' | 'every_2_years' | 'every_5_years' | 'bucket_list' | 'none';
  bestScore?: number;
  firstPlayedDate?: string;
  lastPlayedDate?: string;

  // Contacts
  playingPartners: string[];    // Contact IDs
  knownMembers: string[];       // Contact IDs
  knowsSomeoneWhoKnowsMember?: string;

  // Favorites
  favoriteHoleNumbers: number[];
  favoriteDrink?: string;
  favoriteMenuItem?: string;
  merchWishlist: MerchItem[];

  personalNotes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### GolfContact

```typescript
interface GolfContact {
  id: string;
  name: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;

  // Golf-specific
  membershipClubs: string[];    // Course IDs
  skillLevel: 'low' | 'mid' | 'high';
  playFrequency: 'low' | 'mid' | 'high';
  approximateAge?: number;

  // Relationship
  howMet?: string;
  coursesPlayedTogether: string[];

  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Scorecard

```typescript
interface Scorecard {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  teeBox?: string;

  // Scores
  scores: number[];             // 18 holes
  totalScore: number;
  scoreToPar: number;

  // Optional details
  playingPartners?: string[];
  weather?: string;
  notes?: string;
  imageUrl?: string;            // OCR source image

  createdAt: string;
  updatedAt: string;
}
```

---

## UI Guidelines

### Styling Approach

**IMPORTANT**: Tailwind CSS v4 classes are not rendering correctly in this project. Use **inline styles** for all styling:

```typescript
const styles = {
  page: {
    paddingBottom: 'env(safe-area-inset-bottom)',
    backgroundColor: '#000',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased' as const,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: '14px',
    padding: '16px 18px',
  },
  // etc.
};
```

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#000` | Page background |
| Card Background | `#1c1c1e` | Cards, sections |
| Primary Green | `#22c55e` | Buttons, played badges |
| Gold | `#d4a634` | Rankings, featured items |
| Muted Text | `#6b7280` | Labels, secondary text |
| Border | `rgba(255,255,255,0.06)` | Dividers |
| Card Radius | `14px` | Standard card radius |
| Horizontal Margin | `20px` | Page content padding |

### Component Patterns

**LargeHeader** - iOS-style large title for section pages:
```typescript
<LargeHeader title="Scorecards" subtitle="Track your rounds">
  <button className="btn-primary">Add Scorecard</button>
</LargeHeader>
```

**PageHeader** - Standard navigation header with back button:
```typescript
<PageHeader title="Course Details" showBack />
```

**Filter Chips** - Use green gradient for selected state:
```typescript
background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
```

---

## Storage Layer

Uses `local-db-storage` (IndexedDB wrapper).

### Storage Keys

- `jdga_courses` - Master course database
- `jdga_userCourses` - User's course records
- `jdga_contacts` - Golf buddies
- `jdga_scorecards` - Scorecard history
- `jdga_favoriteHoles` - Global favorite holes ranking
- `jdga_settings` - User preferences

### Key Functions

```typescript
// Courses
getAllCourses(): Promise<Course[]>
getCourseById(id: string): Promise<Course | null>
getTopUSCourses(limit?: number): Promise<Course[]>
initializeCourses(courses: Course[]): Promise<void>

// User Records
getUserCourseRecord(courseId: string): Promise<UserCourseRecord | null>
markCourseAsPlayed(courseId: string): Promise<UserCourseRecord>
updateBestScore(courseId: string, score: number): Promise<void>

// Contacts
getAllContacts(): Promise<GolfContact[]>
addContact(contact: Omit<GolfContact, 'id'>): Promise<GolfContact>

// Scorecards
getAllScorecards(): Promise<Scorecard[]>
addScorecard(scorecard: Omit<Scorecard, 'id'>): Promise<Scorecard>
```

---

## Course Data

### Current State

The app currently has only **15 courses** seeded in `src/data/courses/topUSCourses.ts`.

### Data Source

Golf Digest World's Greatest Golf Courses ranking (200 courses total):
- Mix of US and international courses
- US courses appear in **ALL CAPS/BOLD** in the source
- Includes: name, designer, co-designers, year opened, city, state/region, country

### CSV Structure

Two separate CSV files are planned:

**us_courses.csv**:
```
usRanking,worldRanking,name,clubName,city,state,designer,coDesigners,yearOpened,courseType,par,address,phone,website
```

**international_courses.csv**:
```
worldRanking,name,clubName,city,region,country,continent,designer,coDesigners,yearOpened,courseType,par,address,phone,website
```

### Loading Course Data

Course data needs a loader to import from CSV into IndexedDB. Currently uses TypeScript seed data.

---

## Routing

```
/                           # Home (not implemented yet)
/courses                    # Courses home - navigation hub
/courses/top-us             # Top US courses (filterable list)
/courses/:id                # Course detail page
/scorecards                 # Scorecard list with stats
/scorecards/add             # Add scorecard (step 1: select course)
/scorecards/add/:courseId   # Add scorecard (step 2: entry method)
/scorecards/:id             # Scorecard detail
/buddies                    # Golf contacts list
/buddies/:id                # Contact detail
/trips                      # Trip planning
/profile                    # User profile
```

---

## Filter System (Top US Courses)

Three filter categories:

1. **Ranking**: All, Top 25, Top 50, Top 100
2. **Type**: All, Public, Private
3. **Status**: All, I've Played, Actively Planning, Wishlist, Not Interested

Filters are collapsible. When collapsed, shows summary chips.

---

## Known Issues

1. **Tailwind CSS v4** classes don't render - use inline styles
2. **Course database** only has 15 courses - needs expansion to 200+
3. **OCR scorecard import** not implemented yet
4. **Weather-based suggestions** not implemented yet

---

## Original Vision

(Preserved below for reference)

---

i'd like to build a new app for golf enthusiasts in the United States. Players of golf, not just fans. Players that have played thousands of rounds, on many of the top public and private courses in the US, as well as a handful internationally. Players who could name the top 25 rated courses in America right off the top of their head, but may play at other top 250 rated courses over the span of one or multiple years. Players that log in roughly 100-200 rounds a year. Players that have a collage of the scoring pencil they've used at any of the top 50 courses they've played. Players that could easily recall what their top score was at almost any course they every played. My first test-user will be one specific close friend of mine. I know a little about golf, but he knows 50x what i know. I want the app to allow him to do many things: refer to the list of top courses in the US and the top courses across different continents outside of north america. The app will let him quickly check off which of those courses he's played at. It will let him record his top score and even let him optionally manually fill out an entire scorecard for one or many rounds at that course, OR use embedded camera function and OCR technology to import a scorecard. The app will let him create contact entries of anyone he remembers having played a round with at that course, whether close friend or one-time playing mate. App will let him create/mark who he knows that is a member of the club. For the course/club that he is a member at, he can record who he plays with, guests he invites to play with him, guests that he invites to use his name to be able to have permission to play without him present that day (this is a common practice in the private golf club community). He could rank his favorite holes at any course, both within the context of that course, as well as a running list of his favorite holes at ANY course. He could record his favorite drink or menu item at any clubhouse. Could mark clubs that if he plays there, what apparel/souvenir items he knows he'll want to purchase in the clubhouse, for himself or as a gift to anyone else he knows who'd like it. The app will have a historical list of all clubs that have hosted any US major tournament and what year, and any of the confirmed future major tournement host-courses. There will of course be info such as date course opened, name of the designer of the course, founders and/or current ownership company of the course. Number of courses at the club and the names of those courses. The length of the course respective to the different teeboxes. Info that i'm not an expert of such as official course "rating" "grading" things like that. It will list the top 3 or so finishers of every US Major tournement each year. It will list the closest public airport and closes private airport to each club. It will list the average flight time from his home airport to those airports. It will list ground transport distance from those airports to the course. It will list highest rated hotels that are in the vicinity of the course. It will list 5 of the highest rated restaurants in the vicinity of the course. App will allow user to identify how many times they have played a course, or estimate, as well as make note of how often they would ideally LIKE to play that course (once a year, once every X years, X times per year). The app will be named "The JDGA Official App". I am not a very experienced dev of apps but have used Claude Code to generate over 40k lines of code across several apps in the last month. I have a Max $200/month plan. Don't skimp on the effort/tokens/cost/detail of this app. I don't know a ton about stack, but I do like the results I've been getting when dev'ing Contacts-Quiz and Circles-Sandbox that you can find locally in dir swdevprojects>nikki-matt-projects. The app will run completely staticly on user's device and not capture user's data or have connectivity to other users -- YET. App shall have weather incorporated so that if user selects any month of the year, then the optimal courses to play that month will be different from the/any list that assumes ideal conditions. If user has a non-golf trip planned to any city, app shall suggest courses, depending on month and even week of the year to account for whether. Users of this app will at times happily play public golf courses but only very good ones. For now, the app need not include direct online tee-time booking options for every course, but should include an address and direct phone number. App shall allow user to record in the app a person they know who knows a member, if they themselves do not directly know a member. There will be a well-rounded Golf Buddies component of the app that performs as an address book ONLY consisting of contacts they have that they already have played golf with or know to play golf and WOULD play with them if given the chance. User shall be able to enter in Name, City, where they are a member (if known) and rate how frequently that person is known to the user to play golf and how good their are. Probably 3 tiers for each (low/mid/high frequency, low/mid/high skill). Probably good to allow user to enter in approx age of the contact. As it's own component of the app, the contacts component will allow user to seemlessly assign those contacts to clubs and make those contacts with a recorded home-city be suggested playing partners for user at any clubs/courses in or near the city of that contact (of course in addition to the club(s) that contact is a member of. Mind you that many highly skilled recreational golfers are members at clubs in cities they either live in only part of the year, or don't even live in at all but justify membership by the quality of their time spent at that club rather than the quantity. The appearance of the app should be top-notch professional b2c app quality, classic with a hint of modern. You are in planning mode. start making an absolutely fantastic plan. Deadline to complet the MVP of this app is 30 days from now. We have time. Accuracy IS Speed. But let's make it high functioning and beautiful very soon, and spend the rest of the time perfecting it.
