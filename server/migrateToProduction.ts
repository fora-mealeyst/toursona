import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Quiz from "./models/Quiz.js";
import Step from "./models/Step.js";
import Result from "./models/Result.js";
import Content from "./models/Content.js";

async function connectToDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("Please add your MongoDB URI to environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function exportProductionData() {
  try {
    console.log("🚀 Starting production data export...");

    // 1. Export the honeymoon-match quiz
    console.log("📋 Exporting honeymoon-match quiz...");

    // Debug: List all quizzes
    const allQuizzes = await Quiz.find({});
    console.log(
      "Available quizzes:",
      allQuizzes.map((q) => ({ id: q._id, title: q.title, slug: q.slug }))
    );

    let quiz = await Quiz.findOne({ slug: "honeymoon-match" });
    console.log("Quiz found by slug:", quiz ? "Yes" : "No");

    if (!quiz) {
      // Fallback: find by title if slug doesn't exist
      quiz = await Quiz.findOne({ title: "Honeymoon Match" });
      console.log("Quiz found by title:", quiz ? "Yes" : "No");
    }
    if (!quiz) {
      // Fallback: use the known quiz ID
      const mongoose = await import("mongoose");
      quiz = await Quiz.findById(
        new mongoose.Types.ObjectId("68c491a2080d55ce6a2b9a30")
      );
      console.log("Quiz found by ID:", quiz ? "Yes" : "No");
    }
    if (!quiz) {
      throw new Error("Honeymoon-match quiz not found");
    }

    const quizData = {
      _id: quiz._id,
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description,
      steps: quiz.steps,
      resultTypes: quiz.resultTypes,
      isActive: quiz.isActive,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };

    // 2. Export all steps for the honeymoon-match quiz
    console.log("📝 Exporting quiz steps...");
    const steps = await Step.find({ quizId: quiz._id }).sort({ order: 1 });
    const stepsData = steps.map((step) => ({
      _id: step._id,
      title: step.title,
      type: step.type,
      quizId: step.quizId,
      order: step.order,
      inputs: step.inputs,
      content: step.content,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
    }));

    // 3. Export all result types referenced by the quiz
    console.log("🎯 Exporting result types...");
    const resultTypes = await Result.find({ _id: { $in: quiz.resultTypes } });
    const resultsData = resultTypes.map((result) => ({
      _id: result._id,
      id: result.id,
      name: result.name,
      description: result.description,
      traits: result.traits,
      travelStyle: result.travelStyle,
      color: result.color,
      eyebrow: result.eyebrow,
      cta: result.cta,
      advisorDescription: result.advisorDescription,
      content: result.content,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }));

    // 4. Export all content referenced by the results
    console.log("📄 Exporting content...");
    const contentIds = resultTypes.flatMap((result) => result.content || []);
    const content = await Content.find({ _id: { $in: contentIds } });
    const contentData = content.map((item) => ({
      _id: item._id,
      id: item.id,
      type: item.type,
      left: item.left,
      right: item.right,
      order: item.order,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    // 5. Create the complete migration data
    const migrationData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        description:
          "Complete honeymoon-match quiz data for production deployment",
      },
      quiz: quizData,
      steps: stepsData,
      results: resultsData,
      content: contentData,
      summary: {
        quizCount: 1,
        stepsCount: stepsData.length,
        resultsCount: resultsData.length,
        contentCount: contentData.length,
      },
    };

    // 6. Write to file
    const outputPath = path.join(process.cwd(), "production-migration.json");
    fs.writeFileSync(outputPath, JSON.stringify(migrationData, null, 2));

    console.log("✅ Migration data exported successfully!");
    console.log(`📁 File saved to: ${outputPath}`);
    console.log("\n📊 Summary:");
    console.log(`   Quiz: ${migrationData.summary.quizCount}`);
    console.log(`   Steps: ${migrationData.summary.stepsCount}`);
    console.log(`   Results: ${migrationData.summary.resultsCount}`);
    console.log(`   Content: ${migrationData.summary.contentCount}`);

    // 7. Create MongoDB import script
    const importScript = `#!/bin/bash
# Production MongoDB Import Script
# Generated on ${new Date().toISOString()}

echo "🚀 Starting production data import..."

# Import Quiz
echo "📋 Importing quiz..."
mongoimport --db toursona --collection quizzes --file quiz.json --jsonArray

# Import Steps
echo "📝 Importing steps..."
mongoimport --db toursona --collection steps --file steps.json --jsonArray

# Import Results
echo "🎯 Importing results..."
mongoimport --db toursona --collection results --file results.json --jsonArray

# Import Content
echo "📄 Importing content..."
mongoimport --db toursona --collection contents --file content.json --jsonArray

echo "✅ Production data import completed!"
`;

    // 8. Create individual JSON files for easier import
    fs.writeFileSync("quiz.json", JSON.stringify([quizData], null, 2));
    fs.writeFileSync("steps.json", JSON.stringify(stepsData, null, 2));
    fs.writeFileSync("results.json", JSON.stringify(resultsData, null, 2));
    fs.writeFileSync("content.json", JSON.stringify(contentData, null, 2));
    fs.writeFileSync("import-production.sh", importScript);

    console.log("\n📦 Additional files created:");
    console.log("   - quiz.json");
    console.log("   - steps.json");
    console.log("   - results.json");
    console.log("   - content.json");
    console.log("   - import-production.sh");

    console.log("\n🔧 To import to production:");
    console.log("   1. Copy all JSON files to your production server");
    console.log("   2. Run: chmod +x import-production.sh");
    console.log("   3. Run: ./import-production.sh");
  } catch (error) {
    console.error("❌ Export failed:", error);
    throw error;
  }
}

async function main() {
  try {
    await connectToDatabase();
    await exportProductionData();
    console.log("\n🎉 Migration preparation completed successfully!");
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
  }
}

// Run the migration
main();
