import { useContext } from 'react';
import { IcalTokenContext } from '../contexts/IcalTokenContext';

// Реэкспортируем хук из контекста для обратной совместимости
const useIcalToken = () => {
  const context = useContext(IcalTokenContext);
  if (!context) {
    throw new Error('useIcalToken must be used within an IcalTokenProvider');
  }
  return context;
};

export default useIcalToken;
