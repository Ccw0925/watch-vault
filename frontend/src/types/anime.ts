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
