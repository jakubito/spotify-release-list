# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.7.0] - 2024-12-XX

### Added
- **Label Explorer**: New feature to search and explore releases by record label
  - Search for albums by label name
  - Filter results by year and sort order
  - Create playlists from selected label releases
  - Save favorite labels for quick access
- **Artist Management**: Enhanced followed artists management
  - View all followed artists in a searchable, sortable list
  - Bulk unfollow artists functionality
  - Real-time search and filtering
- **Enhanced Filtering**: New filtering options for releases
  - Track count filter (minimum and maximum tracks)
  - New releases filter (shows newly released albums since last sync)
  - Improved Various Artists detection and filtering
  - Enhanced remix detection and filtering
- **UI Improvements**:
  - New dropdown component for better user interactions
  - Label dropdown on albums for quick label actions
  - Improved modal management with consistent behavior
  - Better responsive design for mobile devices

### Changed
- Updated Redux state structure to accommodate new features
- Improved API error handling with better retry logic
- Enhanced CSS architecture with new component styles
- Updated documentation with comprehensive developer guide

### Fixed
- Fixed ESLint warnings for unused imports
- Improved Redux Saga error handling
- Better handling of API rate limits
- Fixed various UI inconsistencies

### Technical
- Added new Redux slices for label explorer and artist management
- Implemented new API endpoints for label search and artist management
- Enhanced state persistence with new data structures
- Improved component organization and reusability

## [3.6.0] - Previous Release

### Added
- Album history tracking
- Favorites system
- Enhanced filtering options
- PWA improvements

### Changed
- Updated to React 18
- Improved performance optimizations
- Better error handling

### Fixed
- Various bug fixes and improvements

---

## Development Notes

### Breaking Changes
- None in this release

### Migration Guide
- No migration required for existing users
- New features are opt-in and don't affect existing functionality

### Dependencies
- All dependencies updated to latest compatible versions
- No new major dependencies added
- Maintained compatibility with existing build tools

### Performance
- Improved bundle size through better code splitting
- Enhanced memory usage with optimized state management
- Better caching strategies for API requests