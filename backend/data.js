
// backend/data.js

// These are initialized with data similar to your frontend constants.
// In a real app, this would come from a database.

let MOCK_TEACHERS_DB = [
  {
    id: 'teacher_jane_doe', name: 'Jane Doe', email: 'jane@example.com',
    bio: "Hi! I'm Jane, a certified early childhood educator with 5 years of experience. I love making math and science fun for little ones! My classes are interactive and full of exciting experiments and games.",
    avatarUrl: 'https://picsum.photos/seed/janedoe/100/100',
    ratingAverage: 4.8, ratingCount: 25, isVerified: true, verificationStatus: 'Verified',
    certificates: ["Early Childhood Education Degree", "Advanced Child Psychology Certificate"],
    subjects: ["Math", "Science", "Early Learning"], coursesOfferedIds: ['course_math_101', 'course_science_101'],
    reviews: [
        { id:'review1', parentId:'parent_1', parentName:'Sarah M.', teacherId:'teacher_jane_doe', courseId:'course_math_101', rating:5, comment:"Jane is fantastic! My son (4) loves her math class and is always excited for it.", timestamp: Date.now() - 100000000 },
        { id:'review2', parentId:'parent_2', parentName:'Tom B.', teacherId:'teacher_jane_doe', courseId:'course_science_101', rating:4, comment:"Great science experiments, very engaging.", timestamp: Date.now() - 200000000 },
    ]
  },
  {
    id: 'teacher_john_smith', name: 'John Smith', email: 'john@example.com',
    bio: "Hello! I'm John, an artist and storyteller. I believe every child has a unique creative voice. In my classes, we explore different art forms and weave magical tales together.",
    avatarUrl: 'https://picsum.photos/seed/johnsmith/100/100',
    ratingAverage: 4.5, ratingCount: 15, isVerified: true, verificationStatus: 'Verified',
    certificates: ["Fine Arts Degree", "Storytelling Masterclass"],
    subjects: ["Art", "Storytelling", "Creative Writing"], coursesOfferedIds: ['course_art_101'],
    reviews: [
        { id:'review3', parentId:'parent_3', parentName:'Linda K.', teacherId:'teacher_john_smith', courseId:'course_art_101', rating:5, comment:"John's art class is amazing. My daughter has learned so much and her creativity has blossomed!", timestamp: Date.now() - 50000000 },
    ]
  },
  {
    id: 'teacher_pending_approval', name: 'Alex Pending', email: 'alex@example.com',
    bio: "Aspiring coding instructor for young kids. Excited to share the world of programming!",
    avatarUrl: 'https://picsum.photos/seed/alexpending/100/100',
    ratingAverage: 0, ratingCount: 0, isVerified: false, verificationStatus: 'Pending',
    subjects: ["Coding"], coursesOfferedIds: ['course_coding_101'],
  }
];

let MOCK_COURSES_DB = [
  {
    id: 'course_math_101', title: 'Fun with Numbers (Level 1)',
    description: "An exciting introduction to numbers, counting, and basic shapes for young learners. We'll play games, sing songs, and explore math in everyday objects!",
    teacherId: 'teacher_jane_doe', subject: 'Math', ageGroups: ['2-4', '5-7'],
    durationWeeks: 4, sessionsPerWeek: 2, isLiveFocused: true,
    priceOneTime: 20, status: 'Active', // Using string for ActivityStatus
    imageUrl: 'https://picsum.photos/seed/mathcourse/300/200',
    ratingAverage: 4.8, ratingCount: 10, enrollmentCount: 15,
    lessons: [ /* lesson data */ ]
  },
  {
    id: 'course_art_101', title: 'Creative Colors & Crafts',
    description: "Let's explore the wonderful world of colors! We'll paint, draw, and make fun crafts. Unleash your inner artist!",
    teacherId: 'teacher_john_smith', subject: 'Art', ageGroups: ['5-7'],
    durationWeeks: 6, sessionsPerWeek: 1, isLiveFocused: false, 
    priceMonthly: 15, status: 'Active',
    imageUrl: 'https://picsum.photos/seed/artcourse/300/200',
    ratingAverage: 4.5, ratingCount: 8, enrollmentCount: 12,
    lessons: [ /* lesson data */ ]
  },
  {
    id: 'course_science_101', title: 'My First Science Lab',
    description: "Become a junior scientist! We'll do simple and safe experiments at home to learn about the world around us.",
    teacherId: 'teacher_jane_doe', subject: 'Science', ageGroups: ['5-7', '8-10'],
    durationWeeks: 4, sessionsPerWeek: 1, isLiveFocused: true,
    priceOneTime: 25, status: 'Active',
    imageUrl: 'https://picsum.photos/seed/sciencecourse/300/200',
    enrollmentCount: 20,
    lessons: [ /* lesson data */ ]
  },
  {
    id: 'course_coding_101', title: 'Coding for Kiddos: Block Basics',
    description: "Learn the basics of coding using fun block-based visual programming. Create your own simple games and animations!",
    teacherId: 'teacher_pending_approval', subject: 'Coding', ageGroups: ['8-10'],
    durationWeeks: 8, sessionsPerWeek: 1, isLiveFocused: true,
    priceOneTime: 50, status: 'Pending', 
    imageUrl: 'https://picsum.photos/seed/codingcourse/300/200',
    lessons: [ /* lesson data */ ]
  }
];

// Populated MOCK_ACTIVITIES_DB
// Icon names are strings. View names are strings. Enums are strings.
// Activity.category values here must match those in frontend/src/types.ts -> Activity['category']
const createActivitiesForBackend = (category, baseName, iconName, color, count, viewName, contentType) => {
  const activities = [];
  for (let i = 1; i <= count; i++) {
    activities.push({
      id: `${category.toString().toLowerCase()}_${baseName.toLowerCase().replace(/\s+/g, '_')}_${i}`,
      name: `${baseName} ${i}`,
      category, // e.g., "Numbers", "Alphabet", "Science"
      iconName, // Store icon name as string
      color,
      view: viewName, // Store view name as string
      ageGroups: ['2-4', '5-7', '8-10'],
      contentType,
      creatorType: 'System',
      difficulty: i % 3 === 0 ? 'Hard' : (i % 2 === 0 ? 'Medium' : 'Easy'),
      status: 'Approved',
      activityContent: { title: `${baseName} ${i}`, description: `A fun ${baseName.toLowerCase()} activity for kids.` }
    });
  }
  return activities;
};

let MOCK_ACTIVITIES_DB = [
  // --- ABC CATEGORY (Alphabet) ---
  ...createActivitiesForBackend('Alphabet', 'Letter Match', 'AcademicCapIcon', 'bg-rose-400', 3, 'LetterSoundsScreen', 'LetterSound'),
  ...createActivitiesForBackend('Alphabet', 'Phonics Fun', 'MusicalNoteIcon', 'bg-rose-400', 2, 'ActivityPlaceholder', 'Game'),
  ...createActivitiesForBackend('Alphabet', 'Trace the Letter', 'PencilIcon', 'bg-rose-400', 3, 'TraceAnimalScreen', 'DrawingChallenge'),

  // --- NUMBERS CATEGORY (Numbers & Counting) ---
  { 
    id: 'counting_game_1', name: 'Count the Stars', category: 'Numbers', iconName: 'CalculatorIcon', color: 'bg-orange-400', 
    view: 'CountingGameScreen', ageGroups: ['2-4', '5-7'], contentType: 'Game',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Count the Stars", description: "How many twinkling stars can you count?" }
  },
  ...createActivitiesForBackend('Numbers', 'Number Recognition', 'MagnifyingGlassIcon', 'bg-orange-400', 3, 'ActivityPlaceholder', 'NumberRecognition'),
  ...createActivitiesForBackend('Numbers', 'Shape Counting', 'CubeIcon', 'bg-orange-400', 2, 'ActivityPlaceholder', 'Game'), 
  ...createActivitiesForBackend('Numbers', 'Number Tracing', 'PencilIcon', 'bg-orange-400', 2, 'TraceAnimalScreen', 'DrawingChallenge'),

  // --- MATH PUZZLES CATEGORY (Use category: 'MathPuzzles') ---
  { 
    id: 'simple_addition_1', name: 'Easy Addition', category: 'MathPuzzles', iconName: 'LightBulbIcon', color: 'bg-sky-500', 
    view: 'ActivityPlaceholder', ageGroups: ['5-7'], contentType: 'SimpleAddition',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "1 + 1 = ?", description: "Solve simple addition problems like 1+1 and 2+2." }
  },
  ...createActivitiesForBackend('MathPuzzles', 'Number Patterns', 'LightBulbIcon', 'bg-sky-500', 3, 'ActivityPlaceholder', 'PatternCompletion'),
  ...createActivitiesForBackend('MathPuzzles', 'Math Logic', 'AdjustmentsHorizontalIcon', 'bg-sky-500', 2, 'ActivityPlaceholder', 'Puzzle'),


  // --- READING CATEGORY (Reading & Stories) ---
  { 
    id: 'fairytale_reader_1', name: 'Fox Learns to Read', category: 'Reading', iconName: 'BookOpenIcon', color: 'bg-lime-500', 
    view: 'FairytaleReaderScreen', ageGroups: ['2-4', '5-7'], contentType: 'Story',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Fox Learns to Read", storyText: "Finley the fox wanted to read all the books in the forest library..." }
  },
  { 
    id: 'letter_sounds_1_adv', name: 'Letter Sounds Fun (Advanced)', category: 'Reading', iconName: 'MusicalNoteIcon', color: 'bg-lime-500', // Changed ID to avoid conflict with Alphabet one if any
    view: 'LetterSoundsScreen', ageGroups: ['5-7'], contentType: 'LetterSound',
    creatorType: 'System', difficulty: 'Medium', status: 'Approved',
    activityContent: { title: "Digraph Sounds", description: "Learn sounds like SH, CH, TH." }
  },
  ...createActivitiesForBackend('Reading', 'Sight Words', 'EyeIcon', 'bg-lime-500', 3, 'ActivityPlaceholder', 'Game'),
  ...createActivitiesForBackend('Reading', 'Story Sequencing', 'BuildingLibraryIcon', 'bg-lime-500', 2, 'ActivityPlaceholder', 'Story'),
  ...createActivitiesForBackend('Reading', 'Rhyming Words', 'ChatBubbleLeftRightIcon', 'bg-lime-500', 2, 'ActivityPlaceholder', 'Game'),

  // --- PUZZLES CATEGORY (General Puzzles & Logic) ---
  { 
    id: 'shape_puzzle_1', name: 'Shape Sorter', category: 'Puzzles', iconName: 'PuzzlePieceIcon', color: 'bg-green-500', 
    view: 'ShapePuzzleScreen', ageGroups: ['2-4'], contentType: 'Puzzle',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Match the Shapes", description: "Drag the shapes to their correct outlines." }
  },
  { 
    id: 'jigsaw_puzzle_1', name: 'Animal Jigsaw', category: 'Puzzles', iconName: 'PuzzlePieceIcon', color: 'bg-green-500', 
    view: 'JigsawPuzzleScreen', ageGroups: ['2-4', '5-7'], contentType: 'Puzzle',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Friendly Lion Jigsaw", description: "Put the pieces together to see the lion." }
  },
   { 
    id: 'spot_difference_1', name: 'Spot Differences', category: 'Puzzles', iconName: 'EyeIcon', color: 'bg-green-500', 
    view: 'SpotTheDifferenceScreen', ageGroups: ['5-7', '8-10'], contentType: 'SpotDifference',
    creatorType: 'System', difficulty: 'Medium', status: 'Approved',
    activityContent: { title: "Find 5 Differences", description: "Look closely at the two pictures and find what's different." }
  },
  { 
    id: 'memory_match_1', name: 'Memory Cards', category: 'Puzzles', iconName: 'Squares2X2Icon', color: 'bg-green-500', 
    view: 'MemoryMatchScreen', ageGroups: ['2-4', '5-7', '8-10'], contentType: 'MemoryGame',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Animal Memory Match", description: "Flip the cards and find the matching pairs." }
  },
  ...createActivitiesForBackend('Puzzles', 'Odd One Out', 'QuestionMarkCircleIcon', 'bg-green-500', 2, 'ActivityPlaceholder', 'Puzzle'),
  ...createActivitiesForBackend('Puzzles', 'Logic Grid General', 'ReceiptPercentIcon', 'bg-green-500', 2, 'ActivityPlaceholder', 'Puzzle'), 
  ...createActivitiesForBackend('Puzzles', 'Connect the Dots', 'LinkIcon', 'bg-green-500', 2, 'ActivityPlaceholder', 'DrawingChallenge'),
  ...createActivitiesForBackend('Puzzles', 'Mazes', 'MapIcon', 'bg-green-500', 2, 'ActivityPlaceholder', 'Puzzle'),

  // --- DRAWING CATEGORY (Drawing & Art) ---
  { 
    id: 'draw_tell_ai_1', name: 'AI Story Doodle', category: 'Drawing', iconName: 'SparklesIcon', color: 'bg-purple-500', 
    view: 'DrawAndTell', ageGroups: ['5-7', '8-10'], contentType: 'DrawingChallenge', 
    creatorType: 'System', difficulty: 'Medium', status: 'Approved',
    activityContent: { description: "Draw something amazing and let AI weave a tale about it!" }
  },
  { 
    id: 'trace_animal_1', name: 'Trace a Cat', category: 'Drawing', iconName: 'PencilIcon', color: 'bg-purple-500', 
    view: 'TraceAnimalScreen', ageGroups: ['2-4', '5-7'], contentType: 'DrawingChallenge',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Trace the Cute Cat", description: "Follow the lines to draw a friendly cat." }
  },
  { 
    id: 'color_by_number_1', name: 'Rainbow Color Fun', category: 'Drawing', iconName: 'PaintBrushIcon', color: 'bg-purple-500', 
    view: 'ColorByNumberScreen', ageGroups: ['2-4', '5-7'], contentType: 'DrawingChallenge',
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Color a Rainbow by Number", description: "Match the numbers to colors and bring the rainbow to life!" }
  },
   { 
    id: 'free_draw_1', name: 'My Masterpiece', category: 'Drawing', iconName: 'PaintBrushIcon', color: 'bg-purple-500', 
    view: 'FreeDrawScreen', ageGroups: ['2-4', '5-7', '8-10'], contentType: 'FreeDraw',
    creatorType: 'System', difficulty: 'AllLevels', status: 'Approved',
    activityContent: { title: "Free Drawing Canvas", description: "Draw whatever your imagination desires!" }
  },
  ...createActivitiesForBackend('Drawing', 'Finish the Picture', 'LightBulbIcon', 'bg-purple-500', 2, 'ActivityPlaceholder', 'DrawingChallenge'),
  ...createActivitiesForBackend('Drawing', 'Doodle Prompts', 'SparklesIcon', 'bg-purple-500', 2, 'ActivityPlaceholder', 'DrawingChallenge'),
  ...createActivitiesForBackend('Drawing', 'Pixel Art', 'CubeIcon', 'bg-purple-500', 2, 'ActivityPlaceholder', 'DrawingChallenge'),
  ...createActivitiesForBackend('Drawing', 'Symmetry Draw', 'SunIcon', 'bg-purple-500', 2, 'ActivityPlaceholder', 'DrawingChallenge'),
  ...createActivitiesForBackend('Drawing', 'Mandala Color', 'MoonIcon', 'bg-purple-500', 2, 'ActivityPlaceholder', 'DrawingChallenge'),
  
  // --- SCIENCE CATEGORY ---
  { 
    id: 'simple_experiments_1', name: 'Kitchen Science', category: 'Science', iconName: 'BeakerIcon', color: 'bg-teal-400', 
    view: 'SimpleExperimentsScreen', ageGroups: ['5-7', '8-10'], contentType: 'ScienceExperiment', 
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Float or Sink?", description: "Discover what floats and what sinks!" }
  },
  ...createActivitiesForBackend('Science', 'Nature Hunt', 'MagnifyingGlassIcon', 'bg-teal-400', 2, 'ActivityPlaceholder', 'Game'),
  ...createActivitiesForBackend('Science', 'Weather Watch', 'CloudIcon', 'bg-teal-400', 2, 'ActivityPlaceholder', 'TextArticle'),

  // --- SPACE CATEGORY ---
  ...createActivitiesForBackend('Space', 'Planet Match', 'GlobeAltIcon', 'bg-indigo-500', 3, 'MemoryMatchScreen', 'MemoryGame'),
  ...createActivitiesForBackend('Space', 'Draw an Alien', 'SparklesIcon', 'bg-indigo-500', 2, 'DrawAndTell', 'DrawingChallenge'),
  ...createActivitiesForBackend('Space', 'Star Constellations', 'SunIcon', 'bg-indigo-500', 2, 'ActivityPlaceholder', 'TextArticle'),
  
  // --- TECH CATEGORY ---
  ...createActivitiesForBackend('Tech', 'Computer Parts', 'CpuChipIcon', 'bg-slate-500', 2, 'ActivityPlaceholder', 'InteractiveQuiz'),
  ...createActivitiesForBackend('Tech', 'Build a Robot Puzzle', 'PuzzlePieceIcon', 'bg-slate-500', 2, 'JigsawPuzzleScreen', 'Puzzle'),
  ...createActivitiesForBackend('Tech', 'Simple Coding Logic', 'CodeBracketIcon', 'bg-slate-500', 2, 'ActivityPlaceholder', 'CodingActivity'),
  
  // --- GENERAL / OTHER ACTIVITIES ---
  { 
    id: 'whyzone_1', name: 'Ask a Question!', category: 'General', iconName: 'QuestionMarkCircleIcon', color: 'bg-yellow-400', 
    view: 'WhyZone', ageGroups: ['2-4', '5-7', '8-10'], contentType: 'InteractiveQuiz', 
    creatorType: 'System', difficulty: 'AllLevels', status: 'Approved',
    activityContent: { title: "Ask Anything!", description: "Curious about something? Let's find out!" }
  },
  { 
    id: 'emotional_learning_1', name: 'My Feelings', category: 'General', iconName: 'HeartIcon', color: 'bg-pink-400', 
    view: 'EmotionalLearning', ageGroups: ['2-4', '5-7'], contentType: 'Game', 
    creatorType: 'System', difficulty: 'Easy', status: 'Approved',
    activityContent: { title: "Explore Your Feelings", description: "Learn about different emotions." }
  },
];


module.exports = {
  MOCK_TEACHERS_DB,
  MOCK_COURSES_DB,
  MOCK_ACTIVITIES_DB,
};
