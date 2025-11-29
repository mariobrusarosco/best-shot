import { Box, styled, Typography } from "@mui/material";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Authentication } from "@/domains/authentication";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { PublicLayout } from "@/domains/ui-system/layout/public";
import { theme } from "@/theming/theme";

const useAppAuth = Authentication.useAppAuth;

const SignUpScreen = () => {
  const auth = useAppAuth();
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <SignUp>
        <Typography variant="h1" color="neutral.100">
          Best Shot
        </Typography>

        <SignUpBUtton
          slotProps={{
            root: {
              onClick: async () => {
                try {
                  await auth.signup?.();
                  // Redirect to home after successful signup
                  navigate({ to: "/" });
                } catch (_) {
                  // Error is already handled in appSignup with alert
                  return null;
                }
              },
            },
          }}
        >
          SIGN UP
        </SignUpBUtton>
        <ProviderDisclaimer>
          <Typography variant="tag" color={theme.palette.teal[500]}>
            using Auth0 by Okta
          </Typography>
        </ProviderDisclaimer>

        <Typography
          variant="label"
          color={theme.palette.neutral[100]}
          textTransform="uppercase"
        >
          Already have an account?
          <LoginPageLink to="/login" sx={{ color: theme.palette.teal[500] }}>
            Login now!
          </LoginPageLink>
        </Typography>
      </SignUp>
    </PublicLayout>
  );
};

const SignUp = styled(Box)(({ theme }) => ({
  display: "grid",
  placeContent: "center",
  placeItems: "center",
  flex: 1,
  gap: theme.spacing(1),
}));

const SignUpBUtton = styled(AppButton)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.teal[500],
  color: theme.palette.neutral[100],
}));

const ProviderDisclaimer = styled(AppButton)(() => ({}));
const LoginPageLink = styled(Link)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
}));

export const Route = createLazyFileRoute("/signup")({
  component: SignUpScreen,
});
