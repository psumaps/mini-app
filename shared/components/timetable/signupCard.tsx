import React from 'react';
import Button from '../common/button';

const SignUpCard = ({ link }: { link?: string }) => {
  if (!link) return <div className="mt-7" />;
  return (
    <Button
      className="mt-7 rounded-3xl items-center justify-center flex h-12 w-full my-4"
      onClick={() => window.open(link, '_blank')}
      isContrast
    >
      <div className="text-xs font-bold">Записаться</div>
    </Button>
  );
};

export default SignUpCard;
