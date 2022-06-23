class MyStorage {
  public val: string;
  constructor() {
    this.val = '';
  }

  static setAccessToken(value: string): void {
    if (localStorage) localStorage.setItem('access_token', value);
  }

  static getAccessToken(): string {
    if (localStorage) {
      const val = localStorage.getItem('access_token');
      return val || '';
    }
    return '';
  }

  static setRefreshToken(value: string): void {
    if (localStorage) localStorage.setItem('refresh_token', value);
  }

  static getRefreshToken(): string {
    if (localStorage) {
      const val = localStorage.getItem('refresh_token');
      return val || '';
    }
    return '';
  }

  static clear(): void {
    if (localStorage) localStorage.clear();
  }
}

export default MyStorage;
