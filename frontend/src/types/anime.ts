export type Anime = {
  id: number;
  url: string;
  title: string;
  englishTitle: string;
  japaneseTitle: string;
  season: string;
  rating: string;
  year: number;
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
};

type Genre = {
  mal_id: number;
  name: string;
  url: string;
};

export type Images = {
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

export type TopAnimesResponse = {
  data: Anime[];
  pagination: Pagination;
};
