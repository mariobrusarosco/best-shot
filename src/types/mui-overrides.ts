/**
 * Material-UI Type Augmentation
 * 
 * This module extends Material-UI's TypeScript interfaces to support
 * custom variants and design system tokens used throughout the application.
 */

declare module '@mui/material/styles' {
  // Extend Button variant overrides
  interface ButtonPropsVariantOverrides {
    tournament: true;
    aiPrediction: true;
  }

  // Extend Paper/Card variant overrides  
  interface PaperPropsVariantOverrides {
    tournament: true;
    match: true;
    league: true;
    aiInsight: true;
    elevated: true;
    flat: true;
  }

  // Extend Select variant overrides
  interface SelectPropsVariantOverrides {
    default: true;
    tournament: true;
    league: true;
    compact: true;
  }

  // Extend Breakpoint with custom breakpoint names
  interface BreakpointOverrides {
    xs: false; // disable default xs
    sm: false; // disable default sm
    md: false; // disable default md
    lg: false; // disable default lg
    xl: false; // disable default xl
    all: true;
    mobile: true;
    tablet: true;
    laptop: true;
    desktop: true;
  }
}

// Export for module recognition
export {};