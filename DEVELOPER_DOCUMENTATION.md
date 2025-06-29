# Spotify Release List - Developer Documentation

## Overview

Spotify Release List is a React-based web application that helps users track new music releases from artists they follow on Spotify. The app uses the Spotify Web API to fetch artist data and displays releases in an organized, filterable interface with advanced features like label exploration and artist management.

## Architecture

### Tech Stack
- **Frontend**: React 18 with functional components and hooks
- **State Management**: Redux Toolkit with Redux Saga for side effects
- **Styling**: Bulma CSS framework with custom SCSS
- **Build Tool**: Create React App (CRA)
- **Authentication**: Spotify OAuth 2.0 with PKCE
- **Storage**: LocalForage for persistent data storage
- **Service Worker**: Workbox for PWA functionality

### Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── common/         # Reusable UI components
│   ├── filters/        # Filter-related components
│   ├── labels/         # Label Explorer components (NEW)
│   ├── modals/         # Modal dialogs
│   ├── playlist/       # Playlist creation components
│   ├── releases/       # Release display components
│   └── settings/       # Settings page components
├── sagas/              # Redux Saga files for async operations
├── state/              # Redux store configuration
│   ├── actions.js      # Action creators
│   ├── selectors.js    # State selectors
│   └── slices/         # Redux slices for different features
├── styles/             # SCSS stylesheets
├── helpers.js          # Utility functions
├── api.js              # Spotify API wrapper
├── auth.js             # Authentication logic
├── enums.js            # Constants and enums
└── types.js            # TypeScript-style JSDoc type definitions
```

## Key Concepts

### 1. Data Flow

The app follows a unidirectional data flow pattern:

1. **User Action** → Dispatches Redux action
2. **Redux Saga** → Handles async operations (API calls)
3. **Redux Store** → Updates application state
4. **React Components** → Re-render based on state changes

### 2. Authentication

The app uses Spotify's Authorization Code Flow with PKCE:

```javascript
// Example: Starting auth flow
const codeVerifier = generateCodeVerifier()
const codeChallenge = await createCodeChallenge(codeVerifier)
startAuthFlow(action, scope, codeChallenge, nonce)
```

### 3. Data Synchronization

The sync process fetches data from multiple Spotify endpoints:

1. **Artists**: From followed artists, saved tracks, or saved albums
2. **Albums**: For each artist, fetch their releases
3. **Extra Data**: Optionally fetch additional metadata (labels, popularity)

### 4. State Management

The app uses Redux with several slices:

- `sync`: Handles data fetching and user authentication
- `filters`: Manages filtering and search functionality
- `playlist`: Handles playlist creation and management
- `settings`: User preferences and configuration
- `favorites`: User's favorite albums
- `followedArtists`: Artist management functionality (NEW)
- `labelExplorer`: Label search and exploration (NEW)

## New Features (v3.7.0+)

### Label Explorer

The Label Explorer allows users to search for releases by record label and create playlists from the results.

#### Key Components:
- **LabelExplorer**: Main container component
- **LabelSearchResults**: Displays search results in a grid
- **LabelAlbum**: Individual album display for label results
- **LabelFilters**: Year and sort filtering
- **FavoriteLabels**: Manage favorite labels

#### State Management:
```javascript
// Label Explorer state slice
{
  labelSearchResults: SpotifyAlbum[] | null,
  labelSearching: boolean,
  labelFilters: { year: string | null, sortBy: 'newest' | 'oldest' },
  labelSelectedReleases: SpotifyAlbum[],
  labelPlaylistModalVisible: boolean,
  favoriteLabels: string[]
}
```

#### API Integration:
```javascript
// Search albums by label
const albums = await searchAlbumsByLabel(token, labelName, signal)
```

### Artist Management

Enhanced artist management allows users to view and manage their followed artists.

#### Key Components:
- **FollowedArtistsManager**: Main artist management interface
- **ArtistRow**: Individual artist row with selection

#### Features:
- Search and filter followed artists
- Bulk unfollow operations
- Sortable artist list
- Real-time updates

### Enhanced Filtering

New filtering options provide more granular control over displayed releases.

#### New Filters:
- **Track Count Filter**: Filter by minimum/maximum number of tracks
- **New Releases Filter**: Show only newly released albums (requires history tracking)
- **Improved Various Artists Filter**: Better detection and filtering
- **Enhanced Remix Filter**: More accurate remix detection

## Component Architecture

### Common Components

Located in `src/components/common/`, these are reusable UI building blocks:

- **Button**: Flexible button component with multiple variants
- **Input**: Styled input fields
- **Select**: Dropdown select component
- **Checkbox**: Custom checkbox with dark theme support
- **Dropdown**: Reusable dropdown component (NEW)

### Feature Components

#### Releases (`src/components/releases/`)
- **Releases**: Main container component
- **ReleaseList**: Virtualized list of releases
- **ReleaseDay**: Groups albums by release date
- **Album**: Individual album display
- **LabelDropdown**: Label interaction dropdown (NEW)

#### Filters (`src/components/filters/`)
- **Filters**: Container for all filter components
- **SearchFilter**: Text search functionality
- **DateRangeFilter**: Date range picker
- **AlbumGroupsFilter**: Filter by album type
- **TracksFilter**: Filter by track count (NEW)
- **NewFilter**: Filter for new releases (NEW)

#### Labels (`src/components/labels/`) - NEW
- **LabelExplorer**: Main label exploration interface
- **LabelSearchResults**: Grid display of label search results
- **LabelAlbum**: Individual album component for label results
- **LabelFilters**: Filtering controls for label results
- **FavoriteLabels**: Favorite labels management

#### Settings (`src/components/settings/`)
- **Settings**: Main settings container
- **GeneralSettings**: Basic app configuration
- **AppearanceSettings**: Theme and display options
- **AutomationSettings**: Auto-sync and notifications
- **FollowedArtistsManager**: Artist management interface (NEW)

## API Integration

### Spotify API Wrapper (`src/api.js`)

The API module provides a clean interface to Spotify's Web API:

```javascript
// Example: Fetching user's followed artists
const artists = await getUserFollowedArtistsPage(token, limit, after, signal)

// Example: Getting artist's albums
const albums = await getArtistAlbums(token, artistId, groups, signal)

// NEW: Search albums by label
const albums = await searchAlbumsByLabel(token, labelName, signal)

// NEW: Unfollow artists
await unfollowArtists(token, artistIds, signal)
```

Key features:
- **Rate limiting**: Automatic retry with exponential backoff
- **Error handling**: Consistent error types and messages
- **Cancellation**: AbortSignal support for request cancellation
- **Batch operations**: Support for bulk operations (NEW)

### Request Management (`src/sagas/request.js`)

For handling multiple concurrent requests efficiently:

```javascript
// Setup worker pool for concurrent requests
const { workers, requestChannel, responseChannel } = setupWorkers(10)

// Process requests concurrently
const results = yield call(getAllPaged, requestFn, requestChannel, responseChannel, workersCount)
```

## State Management Deep Dive

### Selectors (`src/state/selectors.js`)

Selectors compute derived state and are memoized for performance:

```javascript
// Example: Get filtered releases
export const getReleases = createSelector(
  [getFiltersApplied, getFilteredReleases, getOriginalReleases],
  (filtersApplied, filtered, original) => (filtersApplied ? filtered : original)
)

// NEW: Get label search results
export const getLabelSearchResults = (state) => state.labelSearchResults

// NEW: Get followed artists
export const getFollowedArtists = (state) => state.followedArtists
```

### Sagas (`src/sagas/`)

Redux Sagas handle complex async flows:

- **sync.js**: Main data synchronization
- **auth.js**: Authentication flows
- **playlist.js**: Playlist creation and management
- **automation.js**: Background auto-sync
- **artistManagement.js**: Artist management operations (NEW)
- **labelExplorer.js**: Label search and playlist creation (NEW)

Example saga pattern:
```javascript
function* syncSaga(action) {
  try {
    yield put(syncStart())
    const data = yield call(fetchData)
    yield put(syncFinished(data))
  } catch (error) {
    yield put(syncError(error))
  }
}
```

## Styling System

### Theme Architecture

The app uses a modular SCSS architecture:

```scss
// Theme mixins for conditional styling
@mixin theme($names...) {
  $selector: '';
  @for $i from 0 to length($names) {
    $selector: '#{$selector}.theme-#{nth($names, $i + 1)}';
  }
  html#{$selector} & {
    @content;
  }
}

// Usage
.Album {
  margin: 25px 0 0 20px;
  
  @include theme(compact) {
    margin-top: 20px;
  }
}
```

### Color System

Consistent color variables defined in `src/styles/variables.scss`:

```scss
$primary: #1cb954;        // Spotify green
$darkest: #212121;        // Dark backgrounds
$grey-light: #b5b5b5;     // Secondary text
```

### New Component Styles

New components have dedicated SCSS files:

- `LabelExplorer.scss`: Label exploration interface
- `LabelSearchResults.scss`: Search results grid
- `LabelAlbum.scss`: Individual label album display
- `FollowedArtistsManager.scss`: Artist management interface
- `TracksFilter.scss`: Track count filtering

## Data Persistence

### LocalForage Integration

The app uses LocalForage for client-side storage:

```javascript
// Album history tracking
export const albumsNew = new AlbumSet('albums:new')
export const albumsHistory = new AlbumSet('albums:history')

// Efficient binary storage for album IDs
class AlbumSet {
  async persist() {
    const byteArray = new Uint8Array(this.size)
    // Convert album IDs to binary format
    await localForage.setItem(this.key, byteArray)
  }
}
```

### Redux Persist

State persistence configuration in `src/state/store.js`:

```javascript
const persistConfig = {
  key: 'root',
  storage: localForage,
  whitelist: [
    'albums', 'user', 'settings', 'filters', 'favorites',
    'followedArtists', 'favoriteLabels' // NEW
  ],
  migrate: createMigrate(migrations)
}
```

## Performance Optimizations

### 1. Virtualization

Large lists use intersection observer for lazy loading:

```javascript
function usePaginate(releases, pageSize) {
  const [cursor, setCursor] = useState(nextCursor)
  const slice = releases.slice(0, cursor)
  const next = cursor < releases.length ? () => setCursor(nextCursor) : null
  
  return { cursor, slice, next, reset }
}
```

### 2. Memoization

Components use React.memo and useMemo for expensive calculations:

```javascript
const ReleaseDay = memo(({ date, albums }) => {
  // Component only re-renders when props change
})

const pageSize = useMemo(() => 
  calculatePageSize(clientWidth, clientHeight), []
)
```

### 3. Code Splitting

Dynamic imports for non-critical features:

```javascript
// Service worker registration only in production
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  serviceWorkerRegistration.register()
}
```

## Development Workflow

### Getting Started

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Add your Spotify Client ID and other configuration
   ```

3. **Start development server**:
   ```bash
   yarn start
   ```

### Available Scripts

- `yarn start`: Development server with hot reload
- `yarn build`: Production build
- `yarn test`: Run test suite
- `yarn prettify`: Format code with Prettier
- `yarn analyze`: Bundle size analysis

### Code Style

The project uses Prettier for consistent formatting:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "useTabs": false,
  "tabWidth": 2,
  "semi": false
}
```

### ESLint Configuration

The project includes ESLint rules with some customizations:

```javascript
// Disabled for .js files to allow flexible hook dependencies
"react-hooks/exhaustive-deps": "off"
```

## Testing

### Test Structure

Tests are located in `src/__tests__/` with fixtures for mock data:

```javascript
// Example test
describe('helpers', () => {
  it('calculates playlist name correctly', () => {
    const start = moment('2020-01-15')
    const end = moment('2020-02-08')
    const actual = playlistName(start, end)
    expect(actual).toEqual('Jan 15 - Feb 8 Releases')
  })
})
```

### Mock Data

Test fixtures provide realistic state objects:

```javascript
// src/__tests__/fixtures/state.js
const state = {
  albums: { /* mock album data */ },
  user: { /* mock user data */ },
  settings: { /* mock settings */ }
}
```

## Common Patterns

### 1. Async Action Pattern

```javascript
// Action creator
export const sync = createAction('sync')

// Saga
function* syncSaga(action) {
  try {
    yield put(syncStart())
    const result = yield call(apiCall)
    yield put(syncFinished(result))
  } catch (error) {
    yield put(syncError(error))
  }
}

// Component
const dispatch = useDispatch()
const syncing = useSelector(getSyncing)

const handleSync = () => dispatch(sync())
```

### 2. Form Handling

```javascript
// Using react-hook-form
const { register, handleSubmit, formState } = useForm()

const onSubmit = (data) => {
  dispatch(createPlaylist(data))
}

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('name', { required: true })} />
    {formState.errors.name && <span>Name is required</span>}
  </form>
)
```

### 3. Conditional Rendering

```javascript
// Loading states
if (syncing) return <Loading />
if (!releases.length) return <EmptyState />
return <ReleaseList releases={releases} />
```

### 4. Modal Management (NEW)

```javascript
// Modal hook for consistent behavior
function useModal(closeModal) {
  useHotkeys('esc', closeModal, { enableOnFormTags: ['input'] })
  
  useEffect(() => {
    document.documentElement.classList.add('is-modal-open')
    return () => {
      document.documentElement.classList.remove('is-modal-open')
    }
  }, [])
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check Spotify app configuration and redirect URIs
2. **API Rate Limits**: The app handles these automatically with retry logic
3. **Storage Quota**: Large datasets may hit browser storage limits
4. **CORS Issues**: Ensure proper Spotify app domain configuration
5. **Build Warnings**: CSS autoprefixer warnings about `end` values are non-breaking
6. **ESLint Warnings**: Some unused imports may appear during development

### Debug Tools

- Redux DevTools for state inspection
- React Developer Tools for component debugging
- Network tab for API request monitoring
- Console logs with Sentry error tracking

### Performance Monitoring

- Bundle analyzer for size optimization
- React Profiler for component performance
- Lighthouse for PWA and performance audits

## Contributing

### Adding New Features

1. **Create action creators** in `src/state/actions.js`
2. **Add reducer logic** in appropriate slice
3. **Create saga** for async operations
4. **Build components** following existing patterns
5. **Add styles** using the established theme system
6. **Write tests** for new functionality
7. **Update documentation** as needed

### Code Organization

- Keep components small and focused
- Use custom hooks for reusable logic
- Follow the established file naming conventions
- Add JSDoc comments for complex functions
- Update type definitions in `types.js`
- Maintain consistent styling patterns

### Best Practices

- Use TypeScript-style JSDoc comments for better IDE support
- Implement proper error boundaries for robust error handling
- Follow the established Redux patterns for state management
- Use memoization appropriately to prevent unnecessary re-renders
- Maintain accessibility standards (ARIA labels, keyboard navigation)
- Test across different browsers and devices

This documentation should help developers understand the codebase structure, new features, and common patterns used throughout the application.