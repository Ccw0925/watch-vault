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
}

const CustomPagination = ({
  currentPage,
  totalPages,
  additionalParams = {},
}: PaginationProps) => {
  if (!totalPages) {
    return <Skeleton className="w-[400px] h-8 mx-auto" />;
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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              currentPage > 1 ? buildQueryString(currentPage - 1) : undefined
            }
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={
                  typeof page === "number" ? buildQueryString(page) : undefined
                }
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages
                ? buildQueryString(currentPage + 1)
                : undefined
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
