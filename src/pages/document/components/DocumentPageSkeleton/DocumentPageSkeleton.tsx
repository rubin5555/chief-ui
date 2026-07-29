import { SkeletonBar } from '@/components/ui/SkeletonBar';
import { BAR_WIDTH } from '../../document.measurements';
import { BarRow, BodyRow } from '../components.shared.styles';
import {
  LETTERHEAD_FIELD_WIDTHS,
  OUTLINE_ROWS,
  PAPER_SUBJECTS,
} from './DocumentPageSkeleton.constants';
import {
  Centered,
  Crest,
  EditorColumn,
  HeadingRow,
  Letterhead,
  LetterheadFields,
  PaperSheet,
  ProgressRow,
  SectionBlock,
  SidebarColumn,
  SidebarDivider,
  StatusBlock,
  SubjectBlock,
  TreeRow,
  TreeRows,
} from './DocumentPageSkeleton.styles';
import { DOCUMENT_PAGE_SKELETON_IDS } from './DocumentPageSkeleton.testids';

/**
 * What the document page looks like before its document arrives: the metadata
 * bar over a sidebar and an A4 sheet.
 *
 * It replaces `ui/PanelLoading`, which draws a toolbar, a tab row and five list
 * rows in a card — the shape of the profile page's panels, and of nothing on
 * this page. A skeleton's whole job is to hold the place its content will take,
 * so one showing the wrong furniture is worse than none: the page visibly
 * rearranges itself the moment it loads.
 *
 * Geometry comes from `document.measurements`, the same constants the real
 * sheet and sidebar read, so the sheet doesn't move when it is filled in.
 */
export const DocumentPageSkeleton = () => (
  <div role="status" aria-label="טוען מסמך" data-testid={DOCUMENT_PAGE_SKELETON_IDS.root}>
    <BarRow>
      <SkeletonBar $width={BAR_WIDTH} $height="34px" />
    </BarRow>

    <BodyRow>
      <SidebarColumn data-testid={DOCUMENT_PAGE_SKELETON_IDS.sidebar}>
        <StatusBlock>
          <SkeletonBar $width="60%" $height="16px" />
          {/* Two progress bars: a label over its track. */}
          {['preparing', 'approved'].map((id) => (
            <ProgressRow key={id}>
              <SkeletonBar $width="45%" $height="10px" />
              <SkeletonBar $width="100%" $height="6px" />
            </ProgressRow>
          ))}
        </StatusBlock>

        <SkeletonBar $width="100%" $height="32px" />

        <TreeRows>
          <SidebarDivider />
          {OUTLINE_ROWS.map((row) => (
            <TreeRow key={row.id} $indented={row.indented}>
              <SkeletonBar $width="10px" $height="10px" $round />
              <SkeletonBar $width={row.width} $height="12px" />
            </TreeRow>
          ))}
        </TreeRows>
      </SidebarColumn>

      <EditorColumn>
        <Centered>
          <PaperSheet data-testid={DOCUMENT_PAGE_SKELETON_IDS.paper}>
            <Letterhead>
              <Crest />
              <LetterheadFields>
                {LETTERHEAD_FIELD_WIDTHS.map((width) => (
                  <SkeletonBar key={width} $width={width} $height="10px" />
                ))}
              </LetterheadFields>
            </Letterhead>

            {PAPER_SUBJECTS.map((subject) => (
              <SubjectBlock key={subject.id}>
                <HeadingRow>
                  <SkeletonBar $width="18px" $height="16px" />
                  <SkeletonBar $width={subject.titleWidth} $height="16px" />
                </HeadingRow>

                {subject.sections.map((section) => (
                  <SectionBlock key={section.id}>
                    <HeadingRow>
                      <SkeletonBar $width="24px" $height="13px" />
                      <SkeletonBar $width={section.titleWidth} $height="13px" />
                    </HeadingRow>
                    {section.lines.map((line) => (
                      <SkeletonBar key={line.id} $width={line.width} $height="10px" />
                    ))}
                  </SectionBlock>
                ))}
              </SubjectBlock>
            ))}
          </PaperSheet>
        </Centered>
      </EditorColumn>
    </BodyRow>
  </div>
);
