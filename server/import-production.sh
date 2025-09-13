#!/bin/bash
# Production MongoDB Import Script
# Generated on 2025-09-13T04:36:38.263Z

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
