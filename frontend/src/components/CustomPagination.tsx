import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "./ui/skeleton";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  additionalParams?: Record<string, string>;
  setPage?: (page: number) => void;
  useRouter?: boolean;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  additionalParams = {},
  setPage,
  useRouter = true,
}: PaginationProps) => {
  if (!totalPages) {
    return <Skeleton className="w-[400px] max-w-full h-8 mx-auto" />;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 4) {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
      pages.push("...");
      for (let i = totalPages - 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage >= totalPages - 3) {
      for (let i = 1; i <= 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buildQueryString = (page: number) => {
    const params = new URLSearchParams({
      ...additionalParams,
      page: page.toString(),
    });
    return `?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (setPage && !useRouter) {
      setPage(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              useRouter && currentPage > 1
                ? buildQueryString(currentPage - 1)
                : undefined
            }
            onClick={() =>
              !useRouter &&
              currentPage > 1 &&
              setPage &&
              handlePageChange(currentPage - 1)
            }
            className={`cursor-pointer ${
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={
                  useRouter && typeof page === "number"
                    ? buildQueryString(page)
                    : undefined
                }
                onClick={() =>
                  !useRouter &&
                  typeof page === "number" &&
                  setPage &&
                  handlePageChange(page)
                }
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={
              useRouter && currentPage < totalPages
                ? buildQueryString(currentPage + 1)
                : undefined
            }
            onClick={() =>
              !useRouter &&
              currentPage < totalPages &&
              setPage &&
              handlePageChange(currentPage + 1)
            }
            className={`cursor-pointer ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
