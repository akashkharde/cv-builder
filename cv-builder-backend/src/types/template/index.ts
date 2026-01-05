/**
 * Template related types
 */

/**
 * Template asset paths
 */
export interface AssetPaths {
  css?: string;
  img?: string[];
}

/**
 * Template data
 */
export interface TemplateData {
  _id: string;
  name: string;
  description: string;
  assetPaths: AssetPaths;
  version: number;
  createdBy?: string;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}

