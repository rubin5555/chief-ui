import { ItemListCard, ItemListScroll } from '@/components/ui/ItemList/ItemList.styles';
import { SkeletonBar } from '@/components/ui/SkeletonBar';
import {
  LoadingRoot,
  SkeletonRow,
  SkeletonRowActions,
  SkeletonRowLeft,
  SkeletonTabsRow,
  SkeletonToolbar,
} from './PanelLoading.styles';

const ROW_WIDTHS = ['55%', '40%', '65%', '48%', '58%'];

export const PanelLoading = () => (
  <LoadingRoot>
    <SkeletonToolbar>
      <SkeletonBar $width="110px" $height="36px" />
      <SkeletonBar $width="0" $height="36px" $flex />
    </SkeletonToolbar>

    <SkeletonTabsRow>
      <SkeletonBar $width="64px" $height="14px" />
      <SkeletonBar $width="72px" $height="14px" />
    </SkeletonTabsRow>

    <ItemListCard>
      <ItemListScroll>
        {ROW_WIDTHS.map((width) => (
          <SkeletonRow key={width}>
            <SkeletonRowLeft>
              <SkeletonBar $width="24px" $height="24px" $round />
              <SkeletonBar $width={width} />
            </SkeletonRowLeft>
            <SkeletonRowActions>
              <SkeletonBar $width="24px" $height="24px" $round />
              <SkeletonBar $width="24px" $height="24px" $round />
            </SkeletonRowActions>
          </SkeletonRow>
        ))}
      </ItemListScroll>
    </ItemListCard>
  </LoadingRoot>
);
