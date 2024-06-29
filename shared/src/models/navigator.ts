import React from 'react';

interface INavigator {
  navigate(path: string): void;
  back(): void;
}

export const NavigatorContext = React.createContext<INavigator | null>(null);

export default INavigator;
