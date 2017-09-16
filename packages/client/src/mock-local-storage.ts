class LocalStorageMock {
  private store: object;
  constructor() {
    this.store = {};
  }

  public clear() {
    this.store = {};
  }

  public getItem(key) {
    return this.store[key];
  }

  public setItem(key, value) {
    this.store[key] = value.toString();
  }

  public removeItem(key) {
    if (this.store[key]) {
      delete this.store[key];
    }
  }
}

// tslint:disable-next-line no-string-literal
global['localStorage'] = new LocalStorageMock();
