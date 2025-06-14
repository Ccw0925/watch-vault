import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AnimeGridView, { AnimeSkeleton } from "@/components/anime/AnimeGridView";
import CustomPagination from "@/components/CustomPagination";
import { TypographyH3 } from "@/components/ui/typography";
import { Anime } from "@/types/anime";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

type Props = {
  animes?: Anime[];
  isLoading: boolean;
  pageInt: number;
  totalPages?: number;
  orderBy: string;
  sort: string;
  setOrderBy: (orderBy: string) => void;
  setSort: (sort: string) => void;
};

const sortOptions = {
  popularity: "Popularity",
  mal_id: "ID",
  title: "Title",
  start_date: "Start Date",
  end_date: "End Date",
  episodes: "Episodes",
  score: "Score",
  scored_by: "Scored By",
  rank: "Rank",
  members: "Members",
  favorites: "Favorites",
};

const AnimeGridGroup = ({
  animes,
  isLoading,
  pageInt,
  totalPages,
  orderBy,
  sort,
  setOrderBy,
  setSort,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOrderByChange = (newOrderBy: string) => {
    setOrderBy(newOrderBy);
    params.set("orderBy", newOrderBy);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const Pagination = () => (
    <CustomPagination
      currentPage={pageInt}
      totalPages={totalPages}
      additionalParams={{ orderBy, sort }}
    />
  );

  return (
    <>
      <Pagination />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 mt-5 mb-5 lg:mt-0 lg:mb-5">
          <AnimeSkeleton />
        </div>
      ) : animes && animes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,550px)] justify-center gap-5 mt-5 mb-5 lg:mt-0 lg:mb-5">
          <SortByControl
            orderBy={orderBy}
            sort={sort}
            handleOrderByChange={handleOrderByChange}
            handleSortChange={handleSortChange}
          />

          {animes.map(({ id, ...anime }) => (
            <AnimeGridView key={id} id={id} {...anime} />
          ))}
        </div>
      ) : (
        <TypographyH3 className="text-muted-foreground text-center">
          No animes found
        </TypographyH3>
      )}

      {animes && animes.length > 0 && (
        <p className="font-inter text-center text-muted-foreground mb-5">
          Data provided by Jikan API.
        </p>
      )}

      <Pagination />
    </>
  );
};

const SortByControl = ({
  sort,
  orderBy,
  handleOrderByChange,
  handleSortChange,
}: Pick<Props, "orderBy" | "sort"> & {
  handleOrderByChange: (newSort: string) => void;
  handleSortChange: (newOrderBy: string) => void;
}) => (
  <div className="col-span-full">
    <div className="flex lg:justify-end justify-center gap-3">
      <Button
        variant="ghost"
        className="cursor-pointer gap-1 font-inter"
        onClick={() => handleSortChange(sort === "asc" ? "desc" : "asc")}
      >
        {sort === "asc" ? (
          <>
            <ArrowUpNarrowWide /> Ascending
          </>
        ) : (
          <>
            <ArrowDownWideNarrow /> Descending
          </>
        )}
      </Button>

      <Select value={orderBy} onValueChange={handleOrderByChange}>
        <SelectTrigger className="w-[180px] font-inter">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            {Object.entries(sortOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default React.memo(AnimeGridGroup);
