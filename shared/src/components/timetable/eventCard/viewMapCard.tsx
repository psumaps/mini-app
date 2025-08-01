import React, { useContext } from 'react';
import Button from '../../common/button';
import { NavigatorContext } from '../../../models/navigator';

const ViewMapCard = ({ placeId }: { placeId?: string }) => {
  const navigator = useContext(NavigatorContext);

  return (
    <Button
      className="bg-c_border dark:bg-cd_border rounded-3xl items-center justify-center flex h-12 w-full"
      onClick={() => navigator?.navigate?.(`/#i=${placeId}`)}
    >
      <p className="text-c_sub dark:text-cd_sub c3">Посмотреть на карте</p>
    </Button>
  );
};

export default ViewMapCard;
