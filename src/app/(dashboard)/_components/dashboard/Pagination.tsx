import React from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Props = {
  totalPages: number;
  onPaginationClick: (page: number) => void;
  currentPage: number;
};

const PaginationComp = ({ currentPage, totalPages, onPaginationClick }: Props) => {
  const startIndex = Math.max(0, currentPage - 1);
  const endIndex = Math.min(totalPages, startIndex + 3);

  const handlePaginationClick = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPaginationClick(page);
    }
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem
            className={`cursor-pointer ${
              currentPage === 0 ? 'bg-gray-300 text-gray-400 cursor-not-allowed ' : 'bg-transparent'
            }`}
            onClick={() => handlePaginationClick(currentPage - 1)}
          >
            <PaginationPrevious />
          </PaginationItem>
          {Array.from({ length: endIndex - startIndex }, (_, index) => {
            const pageNumber = startIndex + index + 1;
            return (
              <PaginationItem
                key={pageNumber}
                className={currentPage === pageNumber - 1 ? 'bg-gray-500 rounded-sm' : ''}
                onClick={() => handlePaginationClick(pageNumber - 1)}
              >
                <PaginationLink href="#">{pageNumber}</PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem
            className={`cursor-pointer ${
              currentPage === totalPages - 1
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed '
                : 'bg-transparent'
            }`}
            onClick={() => handlePaginationClick(currentPage + 1)}
          >
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComp;
