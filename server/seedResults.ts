import 'dotenv/config';
import mongoose from 'mongoose';
import Result from './models/Result.js';
import connectToDatabase from './database/connection.js';

const personalityTypes = [
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
  },
  {
    id: 'chameleon',
    name: 'Chameleon',
    description: 'You\'re beautifully complex and don\'t fit neatly into one travel style. Your personality shifts with your mood, destination, and travel companions. One day you\'re scaling mountains, the next you\'re savoring a 12-course tasting menu, and the day after you\'re finding the perfect beach hammock.',
    traits: ['Adaptable', 'Versatile', 'Multi-faceted', 'Dynamic'],
    travelStyle: 'Ever-changing adventures that match your mood and moment',
    color: '#8B5A2B',
    eyebrow: 'Meet your Fora Toursona',
    cta: 'Match an advisor',
    advisorDescription: 'Find an advisor who can curate experiences that adapt to your ever-changing travel desires and create the perfect blend of adventure, luxury, culture, and relaxation.'
  }
];

async function seedResults() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Clear existing results
    await Result.deleteMany({});
    console.log('Cleared existing results');

    // Insert new results
    const results = await Result.insertMany(personalityTypes);
    console.log(`Inserted ${results.length} personality types`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding results:', error);
    process.exit(1);
  }
}

seedResults();
