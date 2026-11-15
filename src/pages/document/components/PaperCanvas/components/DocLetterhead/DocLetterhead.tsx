import { useState } from 'react';
import orgLogo from '@/assets/orgLogo.svg';
import { DocLetterheadField } from './components/DocLetterheadField';
import { LETTERHEAD_FIELDS, LETTERHEAD_INITIAL_VALUES } from './DocLetterhead.constants';
import {
  Divider,
  FieldColumn,
  LetterheadRoot,
  Logo,
  LogoBox,
  Spacer,
} from './DocLetterhead.styles';
import { DOC_LETTERHEAD_IDS } from './DocLetterhead.testids';

export interface DocLetterheadProps {
  readOnly: boolean;
}

export const DocLetterhead = ({ readOnly }: DocLetterheadProps) => {
  const [values, setValues] = useState<Record<string, string>>(LETTERHEAD_INITIAL_VALUES);

  const handleChange = (id: string) => (value: string) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  return (
    <LetterheadRoot dir="rtl" data-testid={DOC_LETTERHEAD_IDS.root}>
      <LogoBox>
        <Logo src={orgLogo} alt="סמל הארגון" data-testid={DOC_LETTERHEAD_IDS.logo} />
      </LogoBox>

      <Spacer />
      <Divider />

      <FieldColumn>
        {LETTERHEAD_FIELDS.map((field) => (
          <DocLetterheadField
            key={field.id}
            id={field.id}
            label={field.label}
            value={values[field.id] ?? ''}
            placeholder={field.placeholder}
            readOnly={readOnly}
            onChange={handleChange(field.id)}
          />
        ))}
      </FieldColumn>
    </LetterheadRoot>
  );
};
