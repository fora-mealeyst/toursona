import mongoose from "mongoose";
import Quiz from "./models/Quiz.js";
import Step from "./models/Step.js";
import Result from "./models/Result.js";

/**
 * Migration script to convert from embedded personality types to Result model references
 */
async function migrateToResultModel() {
  try {
    console.log("Starting migration to Result model...");

    // Connect to database using local MongoDB
    await mongoose.connect("mongodb://localhost:27017/toursona");
    console.log("Connected to database");

    // Get all quizzes that have embedded result types
    const quizzes = await Quiz.find({
      "resultTypes.0": { $exists: true, $type: "object" },
    });
    console.log(
      `Found ${quizzes.length} quizzes with embedded personality types to migrate`
    );

    for (const quiz of quizzes) {
      console.log(`\nMigrating quiz: ${quiz.title} (${quiz._id})`);

      // Check if resultTypes contains embedded objects (old format)
      const hasEmbeddedResultTypes = quiz.resultTypes.some(
        (pt: any) => typeof pt === "object" && pt.id
      );

      if (!hasEmbeddedResultTypes) {
        console.log(`  Quiz already migrated, skipping...`);
        continue;
      }

      const embeddedResultTypes = quiz.resultTypes.filter(
        (pt: any) => typeof pt === "object" && pt.id
      );
      console.log(
        `  Found ${embeddedResultTypes.length} embedded result types`
      );

      // Create Result documents for each embedded result type
      const resultIds = [];
      for (const resultType of embeddedResultTypes) {
        // Check if Result already exists with this ID
        let result = await Result.findOne({ id: resultType.id });

        if (!result) {
          // Create new Result
          result = new Result({
            id: resultType.id,
            name: resultType.name,
            description: resultType.description,
            traits: resultType.traits,
            travelStyle: resultType.travelStyle,
            color: resultType.color,
            eyebrow: resultType.eyebrow,
            cta: resultType.cta,
            advisorDescription: resultType.advisorDescription,
          });
          await result.save();
          console.log(`    Created Result: ${resultType.name}`);
        } else {
          console.log(`    Result already exists: ${resultType.name}`);
        }

        resultIds.push(result._id);
      }

      // Update quiz to reference Result IDs instead of embedded objects
      await Quiz.findByIdAndUpdate(quiz._id, {
        resultTypes: resultIds,
      });
      console.log(`  Updated quiz with ${resultIds.length} Result references`);

      // Update steps to use Result IDs instead of resultType strings
      const steps = await Step.find({ quizId: quiz._id });
      console.log(`  Found ${steps.length} steps to update`);

      for (const step of steps) {
        let stepUpdated = false;

        if (step.inputs) {
          for (const input of step.inputs) {
            if (input.options) {
              for (const option of input.options) {
                if (option.resultScores) {
                  for (const score of option.resultScores) {
                    // If it's a string (old format), convert to Result ID
                    if (typeof score.resultType === "string") {
                      const result = await Result.findOne({
                        id: score.resultType,
                      });
                      if (result) {
                        score.resultId = result._id;
                        delete score.resultType;
                        stepUpdated = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (stepUpdated) {
          await step.save();
          console.log(`    Updated step: ${step.title}`);
        }
      }
    }

    console.log("\nMigration completed successfully!");
    console.log("All personality data has been moved to the Result model.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToResultModel();
}

export default migrateToResultModel;
