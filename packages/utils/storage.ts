class AppStorage {
  load(key: string, getObject = false) {
    return new Promise((resolve, reject) => {
      try {
        if (getObject) {
          resolve(JSON.parse(localStorage.getItem(key) || '{}'));
        } else {
          resolve(localStorage.getItem(key));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  save(key: string, data: any) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  get(key: string): string {
    if (!localStorage) {
      return '';
    }
    return localStorage.getItem(key) || '';
  }

  set(key: string, value: string): void {
    if (!localStorage) {
      return;
    }
    localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
}

export const storage = new AppStorage();


