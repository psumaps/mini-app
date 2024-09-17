import atm from '../../../assets/amenities/atm.svg?react';
import cafe from '../../../assets/amenities/cafe.svg?react';
import information from '../../../assets/amenities/information.svg?react';
import library from '../../../assets/amenities/library.svg?react';
import toilets from '../../../assets/amenities/toilets.svg?react';
import classroom from '../../../assets/amenities/class.svg?react';
import other from '../../../assets/amenities/other.svg?react';
import vending_machine from '../../../assets/amenities/vending_machine.svg?react';

export const amenityNameList: Record<string, string> = {
  cafe: 'Кафе',
  information: 'Информация',
  vending_machine: 'Автоматы',
  atm: 'Банкоматы',
  library: 'Библиотека',
  toilets: 'Уборные',
  pharmacy: 'Аптека',
};

export const amenityImageList: Record<
  string,
  React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >
> = {
  other,
  cafe,
  atm,
  library,
  classroom,
  information,
  toilets,
  vending_machine,
};
