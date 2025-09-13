import "dotenv/config";
import mongoose from "mongoose";
import Quiz from "./models/Quiz.js";
import Step from "./models/Step.js";
import Result from "./models/Result.js";
import connectToDatabase from "./database/connection.js";
import { IInput, IOption, IResultScore } from "./types/index.js";

const personalityTypes = [
  {
    id: "adventurer",
    name: "Adventurer",
    description:
      "You chase adrenaline and venture where maps get fuzzy. Your passport is a collection of summits, safaris, and once-in-a-lifetime feats, answering calls to trek Patagonia or dive the Great Barrier Reef.",
    traits: ["Adrenaline-seeking", "Explorer", "Risk-taker", "Thrill-chaser"],
    travelStyle: "Summits, safaris, and once-in-a-lifetime feats",
    color: "#FF6B35",
    eyebrow: "Meet your Fora Toursona",
    cta: "Match an advisor",
    advisorDescription:
      "Find an advisor who knows how to meet your desire for adventure with unforgettable, awe-inspiring experiences.",
  },
  {
    id: "luxe-seeker",
    name: "Luxe Seeker",
    description:
      "You love exclusivity, premium service, and travel that feels as effortless as it looks. Your style is all about splendor without compromise: suites with skyline views, first-class flights, and private transfers.",
    traits: ["Luxury-focused", "Premium", "Exclusive", "Sophisticated"],
    travelStyle:
      "Suites with skyline views, first-class flights, and private transfers",
    color: "#8B5CF6",
    eyebrow: "Meet your Fora Toursona",
    cta: "Match an advisor",
    advisorDescription:
      "Find an advisor who can unlock the upgrades, perks, and insider access that you deserve, no matter the destination.",
  },
  {
    id: "immersive-local",
    name: "Immersive Local",
    description:
      "You crave authentic experiences and meaningful connections. Your travel style is about diving deep into local culture, learning languages, and building relationships that last beyond your trip.",
    traits: [
      "Culture-focused",
      "Authentic",
      "Community-minded",
      "Experiential",
    ],
    travelStyle:
      "Local experiences, cultural immersion, and authentic connections",
    color: "#10B981",
    eyebrow: "Meet your Fora Toursona",
    cta: "Match an advisor",
    advisorDescription:
      "Find an advisor who can connect you with local experiences and authentic cultural opportunities.",
  },
  {
    id: "scholar",
    name: "Scholar",
    description:
      "You travel to learn and discover. Your journeys are driven by curiosity about history, art, architecture, and the stories that shaped our world. Every destination is a classroom.",
    traits: ["Knowledge-seeking", "Curious", "Analytical", "Thoughtful"],
    travelStyle: "Museums, historical sites, and educational experiences",
    color: "#3B82F6",
    eyebrow: "Meet your Fora Toursona",
    cta: "Match an advisor",
    advisorDescription:
      "Find an advisor who can curate educational experiences and connect you with local experts and historians.",
  },
  {
    id: "nomad",
    name: "Nomad",
    description:
      "You embrace the journey as much as the destination. Your travel style is flexible, spontaneous, and focused on the freedom to explore without rigid plans or timelines.",
    traits: ["Flexible", "Spontaneous", "Independent", "Adaptable"],
    travelStyle:
      "Flexible itineraries, spontaneous discoveries, and journey-focused travel",
    color: "#F59E0B",
    eyebrow: "Meet your Fora Toursona",
    cta: "Match an advisor",
    advisorDescription:
      "Find an advisor who can help you create flexible, adaptable travel experiences that embrace spontaneity.",
  },
  {
    id: "gastronome",
    name: "Gastronome",
    description:
      "You travel for the flavors, aromas, and culinary stories of each destination. Your journeys are planned around markets, restaurants, cooking classes, and the people who create memorable meals.",
    traits: [
      "Food-focused",
      "Culinary-curious",
      "Taste-driven",
      "Experiential",
    ],
    travelStyle:
      "Culinary experiences, food markets, and gastronomic adventures",
    color: "#EF4444",
    eyebrow: "Meet your Fora Toursona",
    cta: "Match an advisor",
    advisorDescription:
      "Find an advisor who can connect you with the best culinary experiences, local chefs, and food-focused adventures.",
  },
  {
    id: "chameleon",
    name: "Chameleon",
    description:
      "You adapt to any travel style and embrace the full spectrum of experiences. Your travel personality is fluid, allowing you to enjoy luxury one day and adventure the next.",
    traits: ["Adaptable", "Versatile", "Open-minded", "Balanced"],
    travelStyle:
      "Mixed experiences that adapt to mood, destination, and opportunity",
    color: "#8B5CF6",
    eyebrow: "Meet your Fora Toursona",
    cta: "Match an advisor",
    advisorDescription:
      "Find an advisor who can create diverse, adaptable experiences that match your ever-changing travel mood.",
  },
];

const quizSteps = [
  {
    title: "Discover your travelsona",
    type: "info",
    order: 0,
    description: [
      {
        type: "p",
        content: "Welcome to the Quiz",
      },
    ],
  },
  {
    title: "Travel Personality Assessment",
    type: "question",
    order: 1,
    inputs: [
      {
        label: "1. It's more meaningful to me when…",
        type: "single_choice",
        name: "q1",
        required: true,
        options: [
          {
            label: "I summit a challenging hike or outdoor trek",
            value: "q1_a",
            tags: ["Adventurer"],
            personalityScores: [
              { personalityId: "ADVENTURER_ID_PLACEHOLDER", score: 1 },
            ],
          },
          {
            label: "I check into a breathtaking luxury suite",
            value: "q1_b",
            tags: ["Luxe Seeker"],
            personalityScores: [
              { personalityId: "LUXE_SEEKER_ID_PLACEHOLDER", score: 1 },
            ],
          },
          {
            label: "I share a home-cooked meal with locals",
            value: "q1_c",
            tags: ["Immersive Local"],
            personalityScores: [
              { personalityId: "IMMERSIVE_LOCAL_ID_PLACEHOLDER", score: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Travel Personality Assessment",
    type: "question",
    order: 2,
    inputs: [
      {
        label: "2. I get the most energy from…",
        type: "single_choice",
        name: "q2",
        required: true,
        options: [
          {
            label: "Attending a captivating historical lecture or talk",
            value: "q2_a",
            tags: ["Scholar"],
            personalityScores: [
              { personalityId: "SCHOLAR_ID_PLACEHOLDER", score: 1 },
            ],
          },
          {
            label: "Booking a spontaneous rail trip across borders",
            value: "q2_b",
            tags: ["Nomad"],
            personalityScores: [
              { personalityId: "NOMAD_ID_PLACEHOLDER", score: 1 },
            ],
          },
          {
            label: "Eating the best version of a dish I've only read about",
            value: "q2_c",
            tags: ["Gastronome"],
            personalityScores: [
              { personalityId: "GASTRONOME_ID_PLACEHOLDER", score: 1 },
            ],
          },
        ],
      },
    ],
  },
];

async function seedQuizWithSteps() {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Create a new quiz
    const quiz = new Quiz({
      title: "Discover your travelsona",
      description:
        "Find out what type of traveler you are with our personality quiz",
      isActive: true,
    });
    await quiz.save();
    console.log(`Created quiz: ${quiz.title} (${quiz._id})`);

    // Create result types for this quiz
    const createdResultTypes = [];
    for (const resultData of personalityTypes) {
      const result = new Result(resultData);
      await result.save();
      createdResultTypes.push(result);
      console.log(`Created result type: ${resultData.name}`);
    }

    // Update quiz with result type references
    quiz.resultTypes = createdResultTypes.map((p) => p._id);
    await quiz.save();

    // Create a mapping of result type IDs by their id field
    const resultTypeIdMap: Record<string, string> = {};
    createdResultTypes.forEach((resultType) => {
      resultTypeIdMap[resultType.id] = resultType._id.toString();
    });

    // Create steps for this quiz, replacing personality ID placeholders
    const createdSteps = [];
    for (const stepData of quizSteps) {
      // Deep clone the step data to avoid modifying the original
      const stepDataCopy = JSON.parse(JSON.stringify(stepData));

      // Replace personality ID placeholders in options
      if (stepDataCopy.inputs) {
        stepDataCopy.inputs.forEach((input: IInput) => {
          if (input.options) {
            input.options.forEach((option: IOption) => {
              if (option.resultScores) {
                option.resultScores.forEach((score: IResultScore) => {
                  // Extract the result type from the placeholder (e.g., "ADVENTURER_ID_PLACEHOLDER" -> "adventurer")
                  const resultType = score.resultId
                    .replace("_ID_PLACEHOLDER", "")
                    .toLowerCase();
                  const resultId = resultTypeIdMap[resultType];
                  if (resultId) {
                    score.resultId = resultId;
                  }
                });
              }
            });
          }
        });
      }

      const step = new Step({
        ...stepDataCopy,
        quizId: quiz._id,
      });
      await step.save();
      createdSteps.push(step);
      console.log(`Created step: ${stepData.title} (order: ${stepData.order})`);
    }

    // Update quiz with step references
    quiz.steps = createdSteps.map((s) => s._id);
    await quiz.save();

    console.log("Quiz with steps and result types created successfully!");
    console.log(`Quiz ID: ${quiz._id}`);
    console.log(`Result Types: ${createdResultTypes.length}`);
    console.log(`Steps: ${createdSteps.length}`);
  } catch (error) {
    console.error("Error seeding quiz:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

// Run the seeding function
seedQuizWithSteps();
