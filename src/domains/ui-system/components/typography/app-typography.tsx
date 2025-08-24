import { Typography, TypographyProps } from "@mui/material";
import { forwardRef } from "react";

// Define our custom typography variants
type AppTypographyVariant = 
  | "body1" 
  | "body2" 
  | "subtitle1" 
  | "subtitle2"
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
  | "h6"
  | "paragraph"
  | "topic"
  | "label"
  | "tag"
  | "caption"
  | "overline";

interface AppTypographyProps extends Omit<TypographyProps, 'variant'> {
  variant?: AppTypographyVariant;
}

// Map our custom variants to MUI variants or use sx prop for custom styling
const variantMapping: Record<AppTypographyVariant, TypographyProps['variant'] | 'custom'> = {
  body1: 'custom',
  body2: 'custom', 
  subtitle1: 'custom',
  subtitle2: 'custom',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'custom',
  h6: 'h6',
  paragraph: 'custom',
  topic: 'custom',
  label: 'custom',
  tag: 'custom',
  caption: 'caption',
  overline: 'overline',
};

// Custom styles for our variants
const customStyles: Record<AppTypographyVariant, any> = {
  body1: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    fontFamily: 'Montserrat',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    fontFamily: 'Montserrat',
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '1rem', // 16px
    fontWeight: 500,
    fontFamily: 'Montserrat',
    lineHeight: 1.4,
  },
  subtitle2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    fontFamily: 'Montserrat',
    lineHeight: 1.4,
  },
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  paragraph: {
    fontSize: '1.125rem', // 18px
    fontWeight: 400,
    fontFamily: 'Montserrat',
    lineHeight: 1.5,
  },
  topic: {
    fontSize: '1rem', // 16px
    fontWeight: 300,
    fontFamily: 'Montserrat',
    lineHeight: 1.4,
  },
  label: {
    fontSize: '0.75rem', // 12px
    fontWeight: 500,
    fontFamily: 'Poppins',
    lineHeight: 1.4,
  },
  tag: {
    fontSize: '0.625rem', // 10px
    fontWeight: 400,
    fontFamily: 'Montserrat',
    lineHeight: 1.4,
  },
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    fontFamily: 'Montserrat',
    lineHeight: 1.4,
  },
  overline: {
    fontSize: '0.625rem', // 10px
    fontWeight: 600,
    fontFamily: 'Poppins',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    lineHeight: 1.4,
  },
};

export const AppTypography = forwardRef<HTMLElement, AppTypographyProps>(
  ({ variant = 'body1', sx, ...props }, ref) => {
    const muiVariant = variantMapping[variant];
    const customStyle = customStyles[variant];
    
    return (
      <Typography
        ref={ref}
        variant={muiVariant === 'custom' ? undefined : muiVariant}
        sx={{
          ...(muiVariant === 'custom' ? customStyle : {}),
          ...sx,
        }}
        {...props}
      />
    );
  }
);

AppTypography.displayName = 'AppTypography';

export type { AppTypographyProps };
