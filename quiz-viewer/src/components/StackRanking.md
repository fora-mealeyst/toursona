# StackRanking Component

A React component that allows users to drag and drop items to rank them in order of importance or preference.

## Features

- **Drag and Drop**: Intuitive drag and drop interface using `react-dnd`
- **Visual Feedback**: Hover effects and drag indicators
- **Ranking Display**: Shows current ranking order
- **Reset Functionality**: Button to reset to original order
- **Customizable**: Configurable title, description, and styling
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Installation

The component requires `react-dnd` and `react-dnd-html5-backend`:

```bash
npm install react-dnd react-dnd-html5-backend
```

## Usage

### Basic Usage

```tsx
import { StackRanking } from './components/StackRanking';

const items = [
  { id: '1', text: 'Option A' },
  { id: '2', text: 'Option B' },
  { id: '3', text: 'Option C' },
];

function MyComponent() {
  const handleRankingChange = (rankedItems) => {
    console.log('New ranking:', rankedItems);
  };

  return (
    <StackRanking
      items={items}
      onRankingChange={handleRankingChange}
    />
  );
}
```

### Advanced Usage

```tsx
<StackRanking
  items={items}
  onRankingChange={handleRankingChange}
  title="Rank your preferences"
  description="Drag items to reorder from most preferred to least preferred"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `RankableItem[]` | Yes | - | Array of items to rank |
| `onRankingChange` | `(items: RankableItem[]) => void` | No | - | Callback when ranking changes |
| `title` | `string` | No | "Rank the following items" | Title displayed above the ranking |
| `description` | `string` | No | "Drag and drop to reorder..." | Description text |

## Types

```typescript
interface RankableItem {
  id: string;
  text: string;
  rank?: number; // Automatically assigned based on position
}
```

## Styling

The component uses Tailwind CSS classes and includes:

- Responsive design
- Hover effects
- Drag state indicators
- Modern card-based layout
- Color-coded ranking numbers

## Demo

See `StackRankingDemo.tsx` for a complete example of how to use the component.

## Integration with Quiz System

To integrate with the existing quiz system, you can:

1. Add a new field type `'stack-ranking'` to the `QuizField` interface
2. Create a corresponding field component that uses `StackRanking`
3. Handle the ranking data in the quiz submission logic

Example integration:

```tsx
// In your quiz step component
{field.type === 'stack-ranking' && (
  <StackRanking
    items={field.options?.map((opt, idx) => ({ id: String(idx), text: opt })) || []}
    onRankingChange={(ranked) => handleChange(field.name, JSON.stringify(ranked))}
    title={field.label}
  />
)}
```
