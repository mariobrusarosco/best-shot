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




}

// Export for module recognition
export {};