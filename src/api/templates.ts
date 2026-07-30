import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export interface TemplateDto {
  id: string;
  name: string;
  department?: string;
}

export const GET_TEMPLATES_QUERY = gql`
  query GetTemplates {
    templates {
      id
      name
      department
    }
    deletedTemplates {
      id
      name
      department
    }
  }
`;

export interface GetTemplatesResult {
  templates: TemplateDto[];
  deletedTemplates: TemplateDto[];
}

export const useTemplates = () => useApiQuery<GetTemplatesResult>(GET_TEMPLATES_QUERY);

// ponytail: no backend/resolver yet — registered on stubLink with the same

export const TEMPLATES_FALLBACK: GetTemplatesResult = {
  templates: [
    { id: 't1', name: 'תבנית נוהל בטיחות', department: 'מחלקה א׳' },
    { id: 't2', name: 'תבנית הודעה כללית', department: 'מחלקה ב׳' },
    { id: 't3', name: 'תבנית דוח שבועי', department: 'מחלקה ג׳' },
  ],
  deletedTemplates: [{ id: 'td1', name: 'תבנית ישנה שנמחקה', department: 'מחלקה א׳' }],
};

registerStub('GetTemplates', (): GetTemplatesResult => TEMPLATES_FALLBACK);
