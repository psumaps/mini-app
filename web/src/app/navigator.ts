import INavigator from 'psumaps-shared/src/models/navigator';
import { NavigateFunction } from 'react-router-dom';

class Navigator implements INavigator {
  private readonly navigateFunction?: NavigateFunction;

  constructor(navigateFunction?: NavigateFunction) {
    this.navigateFunction = navigateFunction;
  }

  navigate(path: string): void {
    if (this.navigateFunction) {
      this.navigateFunction(path);
    } else {
      history.pushState({}, '', path);
      history.go();
    }
  }

  back(): void {
    if (this.navigateFunction) {
      this.navigateFunction(-1);
    } else {
      history.back();
    }
  }
}

export default Navigator;
