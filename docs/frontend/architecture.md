# Frontend Architecture

The Todo app frontend is built with modern React patterns and TypeScript for type safety.

## Tech Stack

- **React 19**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript with enhanced developer experience
- **Vite**: Fast build tool and development server
- **Vitest**: Testing framework with great TypeScript support
- **Testing Library**: React testing utilities

## Project Structure

```
frontend/src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── services/         # API communication
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── styles/           # CSS and styling
└── __tests__/        # Test files
```

## Component Architecture

### Core Components

- **`TodoList`**: Main container for displaying todos
- **`TodoItem`**: Individual todo item with actions
- **`NewTodo`**: Form for creating new todos
- **`Controls`**: Filter and search controls
- **`Modal`**: Reusable modal component

### Design Patterns

1. **Container/Presentation Pattern**: Logic separated from UI
2. **Custom Hooks**: Reusable stateful logic
3. **Service Layer**: API calls abstracted from components
4. **Type-First**: TypeScript types define data contracts

## State Management

The app uses React's built-in state management:

- **`useState`**: Local component state
- **`useEffect`**: Side effects and lifecycle
- **Custom Hooks**: Shared state logic
- **Context**: (when needed for deeply nested props)

## Key Features

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Performance
- Component memoization where appropriate
- Efficient re-rendering patterns
- Lazy loading for large lists

### Testing Strategy
- Unit tests for components
- Integration tests for user flows
- Accessibility testing
- Visual regression testing
