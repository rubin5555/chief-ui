import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_WINDOW } from '../../DocumentCatalog.constants';
import { DOCUMENT_CATALOG_IDS } from '../../DocumentCatalog.testids';
import { ArrowButton, PageButton, PagerInner, PagerRoot } from './CatalogPager.styles';

interface CatalogPagerProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// A window of five page buttons that slides with the current page and stops
// against either end.
const pageWindow = (page: number, totalPages: number) => {
  const last = PAGE_WINDOW - 1;
  const start = Math.max(1, Math.min(page - 2, totalPages - last));
  return Array.from({ length: PAGE_WINDOW }, (_, index) => start + index).filter(
    (n) => n <= totalPages,
  );
};

export const CatalogPager = ({ page, totalPages, onPageChange }: CatalogPagerProps) => {
  const onPrev = () => onPageChange(Math.max(1, page - 1));
  const onNext = () => onPageChange(Math.min(totalPages, page + 1));
  const handlePageClick = (n: number) => () => onPageChange(n);

  return (
    <PagerRoot data-testid={DOCUMENT_CATALOG_IDS.pager}>
      <PagerInner dir="ltr">
        <ArrowButton
          type="button"
          $disabled={page === 1}
          disabled={page === 1}
          data-testid={DOCUMENT_CATALOG_IDS.pagerPrev}
          onClick={onPrev}
        >
          <ChevronLeft size={14} />
        </ArrowButton>

        {pageWindow(page, totalPages).map((n) => (
          <PageButton
            key={n}
            type="button"
            $active={page === n}
            data-testid={DOCUMENT_CATALOG_IDS.pagerPage(n)}
            onClick={handlePageClick(n)}
          >
            {n}
          </PageButton>
        ))}

        <ArrowButton
          type="button"
          $disabled={page === totalPages}
          disabled={page === totalPages}
          data-testid={DOCUMENT_CATALOG_IDS.pagerNext}
          onClick={onNext}
        >
          <ChevronRight size={14} />
        </ArrowButton>
      </PagerInner>
    </PagerRoot>
  );
};
