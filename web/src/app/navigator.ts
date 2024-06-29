import INavigator from 'psumaps-shared/src/models/navigator';

class Navigator implements INavigator {
  navigate(path: string): void {
    window.location.href = path;
  }

  back(): void {
    window.history.back();
  }
}

export default Navigator;
