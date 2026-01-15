# API Service Layer

This directory contains the unified Data Access Layer (DAL) for the SnabbaLexin application. It abstracts the underlying data sources (IndexedDB, local arrays) and provides a clean, Promise-based API for the UI components.

## Key Components

### `DataService`
The main entry point for data retrieval. Implements the `IDataService` interface.

**Usage:**
```typescript
import { DataService } from '../services/api/data-service';

const service = DataService.getInstance();

// Initialize (loads data into memory)
await service.initialize();

// Search
const results = await service.search({
    query: 'katt',
    mode: 'start',
    limit: 20
});

// Get by ID
const word = await service.getWordById(123);
```

### `schemas.ts`
Defines the TypeScript interfaces for the domain models (`Word`, `SearchResult`, etc.) and request/response structures.

## Data Flow
1.  **Initialization**: `DataService` loads data from `DictionaryDB` (IndexedDB) into memory for high-performance searching.
2.  **Search**: Queries are executed against the in-memory cache using optimized filtering logic.
3.  **Persistence**: Writes still go through `DictionaryDB` (though the current `DataService` is primarily read-heavy for this iteration).

## Performance
- **In-Memory Caching**: 100% of the dictionary is kept in memory after initial load (~5-10MB), ensuring sub-millisecond search times.
- **Lazy Loading**: UI components should use the pagination/limit features of the search API.
