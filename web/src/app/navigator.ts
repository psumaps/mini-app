import INavigator from 'psumaps-shared/src/models/navigator';
import { NavigateFunction } from 'react-router-dom';

class Navigator implements INavigator {
  private readonly navigateFunction: NavigateFunction;

  constructor(navigateFunction: NavigateFunction) {
    this.navigateFunction = navigateFunction;
  }

  navigate(path: string): void {
    this.navigateFunction(path);
  }

  back(): void {
    this.navigateFunction(-1);
  }
}

export default Navigator;
