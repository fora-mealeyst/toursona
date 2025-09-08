import mongoose, { Schema } from 'mongoose';

export interface IResult extends Document {
  id: string;
  name: string;
  description: string;
  traits: string[];
  travelStyle: string;
  color: string;
  eyebrow: string;
  cta: string;
  advisorDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Unique identifier (e.g., 'adventurer')
  name: { 
    type: String, 
    required: true 
  }, // Display name (e.g., 'Adventurer')
  description: { 
    type: String, 
    required: true 
  }, // Full description of the personality type
  traits: [{ 
    type: String, 
    required: true 
  }], // Array of trait keywords
  travelStyle: { 
    type: String, 
    required: true 
  }, // Travel style description
  color: { 
    type: String, 
    required: true 
  }, // Hex color code for UI
  eyebrow: { 
    type: String, 
    required: true 
  }, // Eyebrow text for results page
  cta: { 
    type: String, 
    required: true 
  }, // Call-to-action text
  advisorDescription: { 
    type: String, 
    required: true 
  } // Description for advisor matching
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

export default mongoose.model<IResult>('Result', ResultSchema);
