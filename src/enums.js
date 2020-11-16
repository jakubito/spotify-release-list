/** @enum {string} */
export const Scope = {
  USER_FOLLOW_READ: 'user-follow-read',
  PLAYLIST_MODIFY_PRIVATE: 'playlist-modify-private',
  PLAYLIST_MODIFY_PUBLIC: 'playlist-modify-public',
}

/** @enum {string} */
export const SpotifyEntity = {
  ALBUM: 'album',
  ARTIST: 'artist',
  PLAYLIST: 'playlist',
  TRACK: 'track',
}

/** @enum {string} */
export const MomentFormat = {
  ISO_DATE: 'YYYY-MM-DD',
  MONTH_NAME: 'MMMM',
}

/** @enum {string} */
export const AlbumGroup = {
  ALBUM: 'album',
  SINGLE: 'single',
  COMPILATION: 'compilation',
  APPEARS_ON: 'appears_on',
}

/** @type {[group: AlbumGroup, label: string][]} */
export const AlbumGroupLabels = [
  [AlbumGroup.ALBUM, 'Albums'],
  [AlbumGroup.SINGLE, 'Singles'],
  [AlbumGroup.COMPILATION, 'Compilations'],
  [AlbumGroup.APPEARS_ON, 'Appearances'],
]

/** @enum {string} */
export const Theme = {
  COMPACT: 'theme-compact',
  SINGLE_COLUMN: 'theme-single-column',
}

/** @enum {string} */
export const Market = {
  DZ: 'Algeria',
  AD: 'Andorra',
  AR: 'Argentina',
  AU: 'Australia',
  AT: 'Austria',
  BH: 'Bahrain',
  BE: 'Belgium',
  BO: 'Bolivia',
  BR: 'Brazil',
  BG: 'Bulgaria',
  CA: 'Canada',
  CL: 'Chile',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  EE: 'Estonia',
  FI: 'Finland',
  FR: 'France',
  DE: 'Germany',
  GR: 'Greece',
  GT: 'Guatemala',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IE: 'Ireland',
  IL: 'Israel',
  IT: 'Italy',
  JP: 'Japan',
  JO: 'Jordan',
  KW: 'Kuwait',
  LV: 'Latvia',
  LB: 'Lebanon',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MY: 'Malaysia',
  MT: 'Malta',
  MX: 'Mexico',
  MC: 'Monaco',
  MA: 'Morocco',
  NL: 'Netherlands',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NO: 'Norway',
  OM: 'Oman',
  PS: 'Palestine',
  PA: 'Panama',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PL: 'Poland',
  PT: 'Portugal',
  QA: 'Qatar',
  RO: 'Romania',
  SA: 'Saudi Arabia',
  SG: 'Singapore',
  SK: 'Slovakia',
  ZA: 'South Africa',
  ES: 'Spain',
  SE: 'Sweden',
  CH: 'Switzerland',
  TW: 'Taiwan',
  TH: 'Thailand',
  TN: 'Tunisia',
  TR: 'Turkey',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UY: 'Uruguay',
  VN: 'Vietnam',
}
