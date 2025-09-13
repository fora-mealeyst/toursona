import React from "react";
import { SideBySide } from "./SideBySide";
import {
  SideContent,
  ContentComponent,
  ContentRendererProps,
} from "../types/content";

// Component to render location content
const LocationComponent: React.FC<{ component: ContentComponent }> = ({
  component,
}) => {
  return (
    <div className="flex flex-col align-start mt-[36px] mx-[40px]">
      <h3 className="text-[#241E1B] font-[Blanco] text-[27px] italic font-normal leading-[110%] mb-[30px]">
        {component.title}
      </h3>
      <p className="text-[#241E1B] font-[Public_Sans] text-[16px] font-normal leading-[150%] mb-[16px]">
        {component.description}
      </p>
    </div>
  );
};

// Component to render where-to-stay content
const WhereToStayComponent: React.FC<{ component: ContentComponent }> = ({
  component,
}) => {
  return (
    <div className="flex flex-col justify-end mx-[40px] mb-[58px]">
      <h4 className="text-[#241E1B] font-[Blanco] text-[27px] italic font-normal leading-[110%] mb-[9px]">
        Where we think you should stay
      </h4>
      <h5 className="text-[#241E1B] font-[Public_Sans] text-[16px] font-bold leading-[150%] mb-[9px]">
        {component.title}
      </h5>
      <p className="text-[#241E1B] font-[Public_Sans] text-[16px] font-normal leading-[150%] mb-[16px]">
        {component.description}
      </p>
      <h6 className="text-[#241E1B] font-[Public_Sans] text-[16px] font-normal leading-[150%] uppercase mb-[16px]">
        Travel Perks
      </h6>
      <p>
        Book with Fora and get perks like upgrades, spa credits and VIP
        treatment—benefits you won't get on your own.
      </p>
    </div>
  );
};

// Component to render content components
const ContentComponentRenderer: React.FC<{
  components: ContentComponent[];
}> = ({ components }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      {components.map((component, index) => {
        switch (component.type) {
          case "location":
            return <LocationComponent key={index} component={component} />;
          case "where-to-stay":
            return <WhereToStayComponent key={index} component={component} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

// Component to render side content (left or right)
const SideContentRenderer: React.FC<{ sideContent: SideContent }> = ({
  sideContent,
}) => {
  // If it has a type property, it's an image
  if (sideContent.type === "image") {
    return (
      <div className="w-full">
        <img
          src={sideContent.src}
          alt={sideContent.alt || ""}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    );
  }

  // If it has a content array, render the content components
  if (sideContent.content) {
    return <ContentComponentRenderer components={sideContent.content} />;
  }

  return null;
};

// Main ContentRenderer component
export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
}) => {
  // Render different content types based on the type field
  switch (content.type) {
    case "side-by-side":
      return (
        <SideBySide
          left={<SideContentRenderer sideContent={content.left} />}
          right={<SideContentRenderer sideContent={content.right} />}
        />
      );

    // Add more content types here in the future
    // case 'carousel':
    //   return <CarouselRenderer content={content} />;
    // case 'grid':
    //   return <GridRenderer content={content} />;

    default:
      console.warn(`Unknown content type: ${content.type}`);
      return null;
  }
};

export default ContentRenderer;
