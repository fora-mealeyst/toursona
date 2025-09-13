// Content component interface
export interface ContentComponent {
  type: "location" | "where-to-stay";
  title: string;
  description: string;
}

// Side content interface (left or right)
export interface SideContent {
  type?: "image"; // For images
  src?: string; // For images
  alt?: string; // For images
  content?: ContentComponent[]; // For content arrays
}

// Content interface matching the exact adventure.json structure
export interface Content {
  id: string;
  type: "side-by-side";
  left: SideContent;
  right: SideContent;
  order: number;
  isActive: boolean;
}

// Props for the ContentRenderer
export interface ContentRendererProps {
  content: Content;
}

// Props for the ContentList
export interface ContentListProps {
  content: Content[];
  className?: string;
}
