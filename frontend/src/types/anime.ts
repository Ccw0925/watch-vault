import { WatchStatus } from "./watchlist";

export type Anime = {
  id: number;
  url: string;
  title: string;
  englishTitle: string;
  japaneseTitle: string;
  season: string;
  rating: string;
  year: number;
  type: string;
  genres: Genre[];
  rank: number;
  score: number;
  scoredBy: number;
  episodes: number;
  status: string;
  synopsis: string;
  images: Images;
  aired: Aired;
  duration: string;
  members: number;
  favourites: number;
  studios: Studio[];
  producers: Producer[];
  themes: Theme[];
  demographics: DemoGraphic[];
  relations?: Relation[];
  trailer: Trailer;
  inWatchlist?: boolean;
  watchlistStatus?: WatchStatus;
  watchlistProgress?: number;
};

type Genre = {
  mal_id: number;
  name: string;
  url: string;
};

type Images = {
  webp: { large_image_url: string };
};

type Aired = {
  string: string;
};

type Studio = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Producer = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Theme = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type DemoGraphic = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

type Relation = {
  relation: string;
  entry: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
};

type Trailer = {
  youtube_id: string;
};

type Pagination = {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
};

type Episode = {
  mal_id: number;
  url: string;
  title: string;
  aired: string;
  score: number;
  filler: boolean;
  recap: boolean;
  forumUrl: string;
};

export type Season = {
  year: number;
  season: string;
};

export type EpisodesResponse = {
  data: Episode[];
  pagination: Pick<Pagination, "last_visible_page" | "has_next_page">;
  totalCount?: number;
};

export interface AnimesResponse {
  data: Anime[];
  pagination: Pagination;
}

export interface SeasonalAnimesResponse extends AnimesResponse {
  previousSeasons: Season[];
  upcomingSeasons: Season[];
}

type Character = {
  mal_id: number;
  name: string;
  url: string;
  images: {
    webp: {
      image_url: string;
    };
  };
};

type VoiceActor = {
  person: {
    mal_id: number;
    name: string;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  language: string;
};

export type AnimeCharacter = {
  character: Character;
  role: string;
  favorites: number;
  voice_actors: VoiceActor[];
};

enum AnimeType {
  TV = "tv",
  Movie = "movie",
  OVA = "ova",
  Special = "special",
  ONA = "ona",
  Music = "music",
  CM = "cm",
  PV = "pv",
  TVSpecial = "tv_special",
}

export type AnimeTypeQueryParam =
  | "tv"
  | "movie"
  | "ova"
  | "special"
  | "ona"
  | "music"
  | "cm"
  | "pv"
  | "tv_special";

const animeTypeDisplayMap: Record<AnimeTypeQueryParam, string> = {
  [AnimeType.TV]: "TV",
  [AnimeType.Movie]: "Movie",
  [AnimeType.OVA]: "OVA",
  [AnimeType.Special]: "Special",
  [AnimeType.ONA]: "ONA",
  [AnimeType.Music]: "Music",
  [AnimeType.CM]: "CM",
  [AnimeType.PV]: "PV",
  [AnimeType.TVSpecial]: "TV Special",
};

export const getDisplayName = (queryValue: AnimeTypeQueryParam): string => {
  return animeTypeDisplayMap[queryValue];
};

export const getQueryParam = (
  displayName: string
): AnimeTypeQueryParam | undefined => {
  const entry = Object.entries(animeTypeDisplayMap).find(
    ([, value]) => value === displayName
  );
  return entry?.[0] as AnimeTypeQueryParam | undefined;
};
