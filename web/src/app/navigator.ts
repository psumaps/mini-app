import INavigator from 'psumaps-shared/src/models/navigator';

class Navigator implements INavigator {
  navigate(path: string): void {
    history.pushState({}, '', path);
    history.go();
  }

  back(): void {
    history.back();
  }
}

export default Navigator;
