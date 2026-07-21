"use client";

import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

type ListPaginationProps = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const ListPagination = ({ page, pages, onPageChange }: ListPaginationProps) => {
  return (
    <Pagination className="justify-between">
      <span className="text-sm text-muted-foreground">
        Page {page} of {pages || 1}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </Pagination>
  );
};

export default ListPagination;
