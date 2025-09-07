// Import and re-export the complete data seeding functionality
import seedCompleteData from './seedCompleteData';

// Alias for backward compatibility
const seedData = seedCompleteData;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;