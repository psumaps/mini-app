import { DefinedQueryObserverResult } from '@tanstack/react-query';
import Faculty from '../../../network/models/psu-tools/faculty';
import GroupResponse from '../../../network/models/psu-tools/groupResponse';

export const GROUP_INFO_KEY = 'group-info';

export type Choices = 'faculties' | 'groups';

export interface SelectProps {
  choosingTag: Choices;
  btnText: string;
  title: string;
  query: DefinedQueryObserverResult<Faculty[] | GroupResponse[], Error> | null;
  onSelect: (optionValue: string) => void;
  dataItem: number | null;
  fallbackName?: string;
  choosing: Choices | null;
  setChoosing: (choosing: Choices | null) => void;
}

export interface GroupData {
  facultyId: number | null;
  groupId: number | null;
  groupName: string | null;
}
