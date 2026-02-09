// server/seed.js - Create test data for development
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with test data...\n');

  // 1. Create test user (with hashed password)
  const hashedPassword = await bcrypt.hash('Test123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@student.hutech.edu.vn' },
    update: {},
    create: {
      id: 'demo-user-1',
      email: 'test@student.hutech.edu.vn',
      password: hashedPassword,
      name: 'Xuân Thực (Test)',
      emailVerified: true
    },
  });
  console.log('✅ Created test user:', user.email);

  // 2. Create test subject
  const subject = await prisma.subject.upsert({
    where: { id: 'test-subject-1' },
    update: {},
    create: {
      id: 'test-subject-1',
      name: 'Data Structures & Algorithms',
      description: 'Learn fundamental data structures and algorithms',
      userId: user.id
    }
  });
  console.log('✅ Created test subject:', subject.name);

  // 3. Create test document
  const document = await prisma.document.upsert({
    where: { id: 'test-doc-1' },
    update: {},
    create: {
      id: 'test-doc-1',
      title: 'DSA Basics',
      filePath: '/uploads/dsa-basics.pdf',
      fileSize: 2048,
      subjectId: subject.id
    }
  });
  console.log('✅ Created test document:', document.title);

  // 4. Create test concepts with dependencies
  const concepts = await Promise.all([
    prisma.concept.create({
      data: {
        id: 'concept-1',
        term: 'Array',
        definition: 'A collection of elements stored contiguously in memory',
        example: '[1, 2, 3, 4, 5]',
        pageNumber: 5,
        documentId: document.id
      }
    }),
    prisma.concept.create({
      data: {
        id: 'concept-2',
        term: 'Linked List',
        definition: 'A linear data structure where elements are linked via pointers',
        example: '1 -> 2 -> 3 -> null',
        pageNumber: 15,
        documentId: document.id
      }
    }),
    prisma.concept.create({
      data: {
        id: 'concept-3',
        term: 'Time Complexity',
        definition: 'Measure of how long an algorithm takes to run',
        example: 'O(n), O(n²), O(log n)',
        pageNumber: 20,
        documentId: document.id
      }
    }),
    prisma.concept.create({
      data: {
        id: 'concept-4',
        term: 'Binary Search',
        definition: 'An efficient search algorithm for sorted arrays',
        example: 'Find 7 in [1, 3, 5, 7, 9]',
        pageNumber: 30,
        documentId: document.id
      }
    }),
    prisma.concept.create({
      data: {
        id: 'concept-5',
        term: 'Sorting Algorithms',
        definition: 'Algorithms that arrange data in a specific order',
        example: 'Bubble sort, Quick sort, Merge sort',
        pageNumber: 40,
        documentId: document.id
      }
    })
  ]);
  console.log(`✅ Created ${concepts.length} test concepts`);

  // 5. Create concept relations (dependencies)
  await Promise.all([
    // Array is prerequisite for Binary Search
    prisma.relation.create({
      data: {
        id: 'rel-1',
        sourceId: 'concept-4',  // Binary Search
        targetId: 'concept-1',  // Array (prerequisite)
        type: 'requires'
      }
    }),
    // Time Complexity is prerequisite for Binary Search
    prisma.relation.create({
      data: {
        id: 'rel-2',
        sourceId: 'concept-4',  // Binary Search
        targetId: 'concept-3',  // Time Complexity (prerequisite)
        type: 'requires'
      }
    }),
    // Array is prerequisite for Sorting
    prisma.relation.create({
      data: {
        id: 'rel-3',
        sourceId: 'concept-5',  // Sorting Algorithms
        targetId: 'concept-1',  // Array (prerequisite)
        type: 'requires'
      }
    }),
    // Time Complexity is prerequisite for Sorting
    prisma.relation.create({
      data: {
        id: 'rel-4',
        sourceId: 'concept-5',  // Sorting Algorithms
        targetId: 'concept-3',  // Time Complexity (prerequisite)
        type: 'requires'
      }
    })
  ]);
  console.log('✅ Created concept relations (dependencies)');

  // 6. Create quiz results to simulate learning progress
  await Promise.all([
    prisma.quizResult.create({
      data: {
        id: 'quiz-1',
        userId: user.id,
        subjectId: subject.id,
        score: 70,
        total: 100,
        percentage: 70,
        passed: true,
        timeSpent: 1200,
        wrongAnswers: []
      }
    }),
    prisma.quizResult.create({
      data: {
        id: 'quiz-2',
        userId: user.id,
        subjectId: subject.id,
        score: 50,
        total: 100,
        percentage: 50,
        passed: false,
        timeSpent: 1500,
        wrongAnswers: []
      }
    })
  ]);
  console.log('✅ Created quiz results for learning progress');

  console.log('\n✨ Seeding completed successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: test@student.hutech.edu.vn');
  console.log('  Password: Test123!');
  console.log('\nTest Subject ID: test-subject-1');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());