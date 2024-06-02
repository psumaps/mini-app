import React from 'react';
import Button from '../common/button';

const EtisCard = () => {
  return (
    <Button
      className="rounded-3xl h-12 w-full my-4 c1"
      isContrast
      onClick={() => window.open('https://ya.ru/', '_blank')}
    >
      Привязать профиль ЕТИС
    </Button>
  );
};

export default EtisCard;
