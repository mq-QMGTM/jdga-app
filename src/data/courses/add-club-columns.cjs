/**
 * Script to add clubId and clubName columns to us_courses.csv
 *
 * This script identifies multi-course clubs and assigns them club IDs,
 * then updates the CSV with the new columns.
 */

const fs = require('fs');
const path = require('path');

// Define the club mappings based on our analysis
const MULTI_COURSE_CLUBS = {
  'winged-foot-gc': {
    name: 'Winged Foot Golf Club',
    courses: ['Winged Foot Golf Club: West', 'Winged Foot Golf Club: East']
  },
  'baltusrol-gc': {
    name: 'Baltusrol Golf Club',
    courses: ['Baltusrol Golf Club: Lower', 'Baltusrol Golf Club: Upper']
  },
  'monterey-peninsula-cc': {
    name: 'Monterey Peninsula Country Club',
    courses: ['Monterey Peninsula Country Club: Shore', 'Monterey Peninsula Country Club: Dunes']
  },
  'bandon-dunes-resort': {
    name: 'Bandon Dunes Resort',
    courses: ['Pacific Dunes', 'Bandon Dunes', 'Bandon Trails', 'Old Macdonald']
  },
  'oakland-hills-cc': {
    name: 'Oakland Hills Country Club',
    courses: ['Oakland Hills Country Club: South Course']
  },
  'oak-hill-cc': {
    name: 'Oak Hill Country Club',
    courses: ['Oak Hill Country Club: East']
  },
  'merion-gc': {
    name: 'Merion Golf Club',
    courses: ['Merion Golf Club: East']
  },
  'olympic-club': {
    name: 'The Olympic Club',
    courses: ['The Olympic Club: Lake']
  },
  'bethpage-state-park': {
    name: 'Bethpage State Park',
    courses: ['Bethpage State Park: Black']
  },
  'whistling-straits': {
    name: 'Whistling Straits',
    courses: ['Whistling Straits: Straits Course']
  },
  'kiawah-island-resort': {
    name: 'Kiawah Island Golf Resort',
    courses: ['Kiawah Island Golf Resort: The Ocean Course']
  },
  'tpc-sawgrass': {
    name: 'TPC Sawgrass',
    courses: ['TPC Sawgrass: Stadium']
  },
  'congressional-cc': {
    name: 'Congressional Country Club',
    courses: ['Congressional Country Club: Blue']
  },
  'medinah-cc': {
    name: 'Medinah Country Club',
    courses: ['Medinah Country Club: No. 3']
  },
  'sand-valley': {
    name: 'Sand Valley',
    courses: ['Sand Valley: The Lido']
  },
  'streamsong-resort': {
    name: 'Streamsong Resort',
    courses: ['Streamsong Resort: Blue']
  },
  'the-country-club': {
    name: 'The Country Club',
    courses: ['The Country Club: The Main Course']
  },
  'los-angeles-cc': {
    name: 'Los Angeles Country Club',
    courses: ['Los Angeles Country Club: North']
  }
};

function findClubIdForCourse(courseName) {
  for (const [clubId, clubData] of Object.entries(MULTI_COURSE_CLUBS)) {
    if (clubData.courses.includes(courseName)) {
      return { clubId, clubName: clubData.name };
    }
  }
  return { clubId: '', clubName: '' };
}

function processCSV() {
  const csvPath = path.join(__dirname, 'us_courses.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');

  // Process header
  const headerParts = lines[0].split(',');
  // Insert clubId and clubName after rank fields (after index 1)
  headerParts.splice(2, 0, 'clubId', 'clubName');
  const newHeader = headerParts.join(',');

  const newLines = [newHeader];

  // Process data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handling quoted fields with commas)
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current); // Push last field

    // Extract course name (field index 2 in original CSV)
    const courseName = fields[2];

    // Find club info
    const { clubId, clubName } = findClubIdForCourse(courseName);

    // Insert clubId and clubName after previousRank (index 1)
    fields.splice(2, 0, clubId, clubName);

    // Rejoin the fields
    newLines.push(fields.join(','));
  }

  // Write updated CSV
  const newContent = newLines.join('\n');
  fs.writeFileSync(csvPath, newContent, 'utf-8');

  console.log('✅ CSV updated with clubId and clubName columns');
  console.log(`Processed ${newLines.length - 1} courses`);

  // Print summary of multi-course clubs found
  const clubCounts = {};
  for (let i = 1; i < newLines.length; i++) {
    const fields = newLines[i].split(',');
    const clubId = fields[2];
    if (clubId) {
      clubCounts[clubId] = (clubCounts[clubId] || 0) + 1;
    }
  }

  console.log('\nMulti-course clubs found:');
  for (const [clubId, count] of Object.entries(clubCounts)) {
    console.log(`  ${clubId}: ${count} courses`);
  }
}

// Run the script
try {
  processCSV();
} catch (error) {
  console.error('Error processing CSV:', error);
  process.exit(1);
}
