import React from 'react';
import Button from '../common/button';

const ViewMapCard = ({ link }: { link?: string }) => {
  return (
    link && (
      <Button
        className="bg-c_border dark:bg-cd_border rounded-3xl items-center justify-center flex h-12 w-full"
        onClick={() => window.open(link, '_blank')}
      >
        <p className="text-c_sub dark:text-cd_main c3">Посмотреть на карте</p>
      </Button>
    )
  );
};

export default ViewMapCard;
