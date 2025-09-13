import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  id: string;
  type: "side-by-side";
  left: ISideContent;
  right: ISideContent;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentComponent {
  type: "location" | "where-to-stay";
  title: string;
  description: string;
}

export interface ISideContent {
  type?: "image"; // For images
  src?: string; // For images
  alt?: string; // For images
  content?: IContentComponent[]; // For content arrays
}

const ContentComponentSchema = new Schema<IContentComponent>(
  {
    type: {
      type: String,
      enum: ["location", "where-to-stay"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const SideContentSchema = new Schema<ISideContent>(
  {
    type: {
      type: String,
      enum: ["image"],
    },
    src: {
      type: String,
    },
    alt: {
      type: String,
    },
    content: [ContentComponentSchema],
  },
  {
    _id: false,
  }
);

const ContentSchema = new Schema<IContent>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["side-by-side"],
      required: true,
      default: "side-by-side",
    },
    left: {
      type: SideContentSchema,
      required: true,
    },
    right: {
      type: SideContentSchema,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
ContentSchema.index({ type: 1, isActive: 1 });
ContentSchema.index({ order: 1 });

const Content = mongoose.model<IContent>("Content", ContentSchema);

export default Content;
