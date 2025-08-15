/**
 * Fora Toursona Personality Types
 */
export interface PersonalityType {
  id: string;
  name: string;
  description: string;
  traits: string[];
  travelStyle: string;
  color: string;
  eyebrow: string;
  cta: string;
  advisorDescription: string;
}

/**
 * Scoring result with personality type and breakdown
 */
export interface ScoringResult {
  primaryType: PersonalityType;
  secondaryType?: PersonalityType;
  isChameleon: boolean;
  scores: Record<string, number>;
  breakdown: {
    type: string;
    score: number;
    percentage: number;
  }[];
  totalQuestions: number;
  answeredQuestions: number;
}

/**
 * Available personality types for Fora Toursona
 */
export const PERSONALITY_TYPES: PersonalityType[] = [
  {
    id: 'adventurer',
    name: 'Adventurer',
    description: 'You chase adrenaline and venture where maps get fuzzy. Your passport is a collection of summits, safaris, and once-in-a-lifetime feats, answering calls to trek Patagonia or dive the Great Barrier Reef.',
    traits: ['Adrenaline-seeking', 'Explorer', 'Risk-taker', 'Thrill-chaser'],
    travelStyle: 'Summits, safaris, and once-in-a-lifetime feats',
    color: '#FF6B35',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who knows how to meet your desire for adventure with unforgettable, awe-inspiring experiences.'
  },
  {
    id: 'luxe-seeker',
    name: 'Luxe Seeker',
    description: 'You love exclusivity, premium service, and travel that feels as effortless as it looks. Your style is all about splendor without compromise: suites with skyline views, first-class flights, and private transfers.',
    traits: ['Luxury-focused', 'Premium', 'Exclusive', 'Sophisticated'],
    travelStyle: 'Suites with skyline views, first-class flights, and private transfers',
    color: '#8B5CF6',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who can unlock the upgrades, perks, and insider access that you deserve, no matter the destination.'
  },
  {
    id: 'immersive-local',
    name: 'Immersive Local',
    description: 'On your travels, you strive to connect deeply and live like you\'ve always belonged. Your best moments are found in neighborhood cafés, local festivals, and conversations that last hours.',
    traits: ['Authentic', 'Community-focused', 'Cultural', 'Connector'],
    travelStyle: 'Neighborhood cafés, local festivals, and deep conversations',
    color: '#10B981',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who can take you beyond the guidebook and into the heart of your destination.'
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'You love the story behind every stone, artifact, and landmark. You travel to walk the paths of history, explore museums, and see the art and architecture that shaped the world.',
    traits: ['Intellectual', 'History-focused', 'Art-loving', 'Knowledge-seeker'],
    travelStyle: 'Museums, historical sites, and architectural wonders',
    color: '#3B82F6',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who can curate journeys rich in cultural immersion and discovery.'
  },
  {
    id: 'nomad',
    name: 'Nomad',
    description: 'You love freedom, flexibility, and finding value in every mile. Your adventures are long, layered, and driven by curiosity. You\'re often found hopping trains or chasing budget flights to the next adventure.',
    traits: ['Free-spirited', 'Flexible', 'Value-conscious', 'Curious'],
    travelStyle: 'Long, layered adventures driven by curiosity',
    color: '#F59E0B',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who knows how to stretch your time, budget, and horizons.'
  },
  {
    id: 'gastronome',
    name: 'Gastronome',
    description: 'From street food to Michelin stars, your memories live on in flavor: a seafood market at sunrise, an incomparable afternoon sweet, and a dinner that forever changes how you think about a single ingredient.',
    traits: ['Food-obsessed', 'Flavor-seeker', 'Culinary-adventurer', 'Taste-explorer'],
    travelStyle: 'Street food to Michelin stars, markets to fine dining',
    color: '#EF4444',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who can book the tables, tours, and tastes worth traveling for.'
  },
  {
    id: 'wellness-seeker',
    name: 'Wellness Seeker',
    description: 'You love slowing down, recharging, and being present at your destination. Whether it\'s a sunrise yoga class, an afternoon in a mountain hot spring, or an uninterrupted nap in a beach hammock, you travel to restore as much as to explore.',
    traits: ['Mindful', 'Rejuvenating', 'Present', 'Balanced'],
    travelStyle: 'Sunrise yoga, mountain hot springs, and beach hammocks',
    color: '#06B6D4',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who knows the most transformative retreats and serene escapes.'
  }
];

/**
 * Map quiz score keys to personality type IDs
 */
function mapScoreKeyToTypeId(scoreKey: string): string {
  const mapping: Record<string, string> = {
    'Adventurer': 'adventurer',
    'Luxe Seeker': 'luxe-seeker',
    'Immersive Local': 'immersive-local',
    'Scholar': 'scholar',
    'Nomad': 'nomad',
    'Gastronome': 'gastronome',
    'Wellness Seeker': 'wellness-seeker'
  };
  return mapping[scoreKey] || scoreKey;
}

/**
 * Calculate personality scores based on quiz answers
 */
export function calculateScores(
  quizData: any,
  answers: Record<string, any>
): ScoringResult {
  const typeScores: Record<string, number> = {};
  let totalQuestions = 0;
  let answeredQuestions = 0;

  // Initialize scores for all personality types
  PERSONALITY_TYPES.forEach(type => {
    typeScores[type.id] = 0;
  });

  console.log('Starting score calculation with answers:', answers);
  console.log('Quiz data steps:', quizData.steps?.length);
  
  // Process each step and its answers
  Object.entries(answers).forEach(([stepIndex, stepAnswers]) => {
    const step = quizData.steps[parseInt(stepIndex)];
    if (!step) {
      console.log(`Step ${stepIndex} not found in quiz data`);
      return;
    }

    console.log(`Processing step ${stepIndex}:`, stepAnswers);
    console.log(`Step has ${step.inputs.length} inputs`);

    step.inputs.forEach((input: any) => {
      totalQuestions++;
      const answer = stepAnswers[input.name];
      console.log(`Input ${input.name}: answer = "${answer}"`);
      
      if (!answer) {
        console.log(`No answer for ${input.name}`);
        return;
      }

      answeredQuestions++;

      // Find the selected option
      const selectedOption = input.options?.find((option: any) => {
        if (typeof option === 'string') {
          return option === answer;
        }
        return option.label === answer || option.value === answer;
      });

      console.log(`Selected option for ${input.name}:`, selectedOption);

      if (selectedOption && typeof selectedOption === 'object' && selectedOption.scores) {
        // Add scores from the selected option
        Object.entries(selectedOption.scores).forEach(([scoreKey, score]) => {
          if (typeof score === 'number') {
            const typeId = mapScoreKeyToTypeId(scoreKey);
            console.log(`Adding score: ${scoreKey} -> ${typeId} = ${score}`);
            typeScores[typeId] = (typeScores[typeId] || 0) + score;
          }
        });
      } else {
        console.log(`No scores found for selected option`);
      }
    });
  });

  // Calculate percentages and find primary/secondary types
  const breakdown = PERSONALITY_TYPES.map(type => {
    const score = typeScores[type.id] || 0;
    const percentage = answeredQuestions > 0 ? (score / answeredQuestions) * 100 : 0;
    return {
      type: type.id,
      score,
      percentage: Math.round(percentage * 10) / 10
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const primaryType = PERSONALITY_TYPES.find(type => type.id === breakdown[0]?.type);
  const secondaryType = breakdown[1]?.percentage > 70 ? 
    PERSONALITY_TYPES.find(type => type.id === breakdown[1]?.type) : undefined;

  // Check if user is a Chameleon (has multiple high scores)
  const highScores = breakdown.filter(item => item.percentage > 30);
  const isChameleon = highScores.length >= 3 && 
    breakdown[0]?.percentage < 40 && 
    breakdown[1]?.percentage > 25;

  if (!primaryType) {
    throw new Error('Unable to determine personality type');
  }

  return {
    primaryType,
    secondaryType,
    isChameleon,
    scores: typeScores,
    breakdown,
    totalQuestions,
    answeredQuestions
  };
}

/**
 * Get personality type by ID
 */
export function getPersonalityType(id: string): PersonalityType | undefined {
  return PERSONALITY_TYPES.find(type => type.id === id);
}

/**
 * Get all personality types
 */
export function getAllPersonalityTypes(): PersonalityType[] {
  return PERSONALITY_TYPES;
}
