export class HttpContextToken<T> {
  /**
   * factory - Default value.
   */
  public constructor(
    private factory: () => T,
  ) { }

  public get default() {
    return this.factory();
  }
}
