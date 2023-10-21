export interface ProgressConfig {
  /**
   * Download progress inspection config.
   */
  download?: ProgressInspectionConfig;

  /**
   * Upload progress inspection config.
   *
   * Only for POST, PUT and PATCH methods.
   *
   * **[Beta] Chrome only**
   */
  // upload?: ProgressInspectionConfig;
}

export interface ProgressInspectionConfig {
  /**
   * Enable progress inspection.
   *
   * @default true
   */
  inspect?: boolean;
}
