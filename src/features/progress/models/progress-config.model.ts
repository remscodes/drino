export interface ProgressConfig {
  /**
   * Download progress inspection config.
   */
  download?: ProgressInspectionConfig;

  /**
   * Upload progress inspection config.
   */
  // upload?: ProgressInspectionConfig;
}

export interface ProgressInspectionConfig {
  /**
   * Enable download progress.
   *
   * @default true
   */
  inspect?: boolean;
  // intervalMs?: number;
}
