/**
 * Brand configuration. "WorkHub" is a WORKING TITLE.
 * Rename the product everywhere by changing this one constant.
 */
export const BRAND = {
  name: 'WorkHub',
  /** Shown next to the name on the welcome page and in the investor view. */
  isWorkingTitle: true,
} as const;

export const BRAND_NAME = BRAND.name;
