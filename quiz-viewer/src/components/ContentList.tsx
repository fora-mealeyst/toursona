import React from "react";
import { ContentRenderer } from "./ContentRenderer";
import { ContentListProps } from "../types/content";

// ContentList component to render multiple content items
export const ContentList: React.FC<ContentListProps> = ({
  content,
  className = "",
}) => {
  if (!content || content.length === 0) {
    return null;
  }

  // Sort content by order
  const sortedContent = [...content].sort((a, b) => a.order - b.order);

  return (
    <div className={`space-y-8 ${className}`}>
      {sortedContent.map((contentItem) => (
        <ContentRenderer key={contentItem.id} content={contentItem} />
      ))}
    </div>
  );
};

export default ContentList;
