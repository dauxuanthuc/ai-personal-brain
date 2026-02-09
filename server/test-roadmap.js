/**
 * Test RoadmapService and RoadmapController
 */
const { getContainer } = require('./src/config/DIContainer');
const jwt = require('jsonwebtoken');

async function test() {
  console.log('🧪 Testing Roadmap Feature...\n');

  try {
    const container = getContainer();
    const roadmapService = container.getRoadmapService();
    
    console.log('📝 Test Parameters:');
    console.log('  userId: demo-user-1');
    console.log('  subjectId: test-subject-1\n');
    
    console.log('⏳ Generating roadmap...\n');
    const roadmap = await roadmapService.generateRoadmap('demo-user-1', 'test-subject-1');
    
    console.log('✅ Roadmap Generated Successfully!\n');
    console.log('📊 Roadmap Summary:');
    console.log(`  Total Concepts: ${roadmap.totalConcepts}`);
    console.log(`  Foundational Concepts: ${roadmap.foundationalConcepts.join(', ')}`);
    console.log(`  Estimated Weeks: ${roadmap.estimatedWeeks}`);
    console.log(`  Generated At: ${roadmap.generatedAt.toISOString()}\n`);
    
    console.log('📚 Learning Path (first 5):');
    roadmap.learningPath.slice(0, 5).forEach((concept, i) => {
      console.log(`  ${i+1}. ${concept.title} [${concept.priority}] Score: ${concept.score}`);
    });
    
    console.log('\n📅 Weekly Schedule:');
    roadmap.weeklySchedule.forEach(week => {
      console.log(`\n  ${week.title}`);
      console.log(`    Focus: ${week.focus}`);
      console.log(`    Estimated Hours: ${week.estimatedHours}h`);
      console.log(`    Concepts:`);
      week.concepts.forEach(c => {
        console.log(`      - ${c.title} (${c.priority}) Score: ${c.score}`);
      });
    });
    
    console.log('\n\n✨ Test Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Test Failed:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

test();
