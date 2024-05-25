import React from 'react';

import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

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
            <PaginationLink className="flex ">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 320 512"
                height="0.6rem"
                width="0.6rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
              </svg>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 320 512"
                className="-translate-x-1/2"
                height="0.6rem"
                width="0.6rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
              </svg>
            </PaginationLink>
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
            <PaginationLink className="flex ">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 320 512"
                height="0.6rem"
                width="0.6rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
              </svg>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 320 512"
                className="-translate-x-1/2"
                height="0.6rem"
                width="0.6rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
              </svg>
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComp;
