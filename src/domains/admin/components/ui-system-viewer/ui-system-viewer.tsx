import { Box, Divider, Stack, styled, Typography } from "@mui/material";
import { useState } from "react";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { theme } from "@/domains/ui-system/theme";
import { COLORS } from "@/domains/ui-system/theme/foundation/colors";
import { TYPOGRAPHY } from "@/domains/ui-system/theme/foundation/typography";

type TabId = "colors" | "typography" | "breakpoints" | "spacing" | "components";

const TABS: { id: TabId; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "breakpoints", label: "Breakpoints" },
  { id: "spacing", label: "Spacing" },
  { id: "components", label: "Components" },
];

export const UISystemViewer = () => {
  const [activeTab, setActiveTab] = useState<TabId>("colors");

  return (
    <Container>
      <Sidebar>
        <Typography variant="h5" color="neutral.100" sx={{ mb: 3, px: 2 }}>
          UI System
        </Typography>
        <Stack spacing={1}>
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </Stack>
      </Sidebar>

      <Content>
        <Typography variant="h3" color="neutral.100" sx={{ mb: 4 }}>
          {TABS.find((t) => t.id === activeTab)?.label}
        </Typography>

        {activeTab === "colors" && <ColorsSection />}
        {activeTab === "typography" && <TypographySection />}
        {activeTab === "breakpoints" && <BreakpointsSection />}
        {activeTab === "spacing" && <SpacingSection />}
        {activeTab === "components" && <ComponentsSection />}
      </Content>
    </Container>
  );
};

// --- Sections ---

const ColorsSection = () => (
  <Stack spacing={4}>
    {Object.entries(COLORS).map(([colorName, variants]) => (
      <Box key={colorName}>
        <Typography
          variant="h5"
          color="neutral.100"
          sx={{ mb: 2, textTransform: "capitalize" }}
        >
          {colorName}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 2,
          }}
        >
          {Object.entries(variants).map(([shade, value]) => (
            <ColorCard key={shade}>
              <Box sx={{ height: 100, bgcolor: value, borderRadius: 1 }} />
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" color="neutral.100">
                  {shade}
                </Typography>
                <Typography variant="caption" color="neutral.500">
                  {value}
                </Typography>
              </Box>
            </ColorCard>
          ))}
        </Box>
      </Box>
    ))}
  </Stack>
);

const TypographySection = () => (
  <Stack spacing={4}>
    <Box>
      <Typography variant="h5" color="neutral.100" sx={{ mb: 2 }}>
        Font Families
      </Typography>
      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" color="neutral.500">
            Heading
          </Typography>
          <Typography
            sx={{
              fontFamily: theme.typography.fontFamily?.split(",")[0],
              fontSize: 24,
              color: "neutral.100",
            }}
          >
            Poppins - The quick brown fox jumps over the lazy dog
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="neutral.500">
            Body
          </Typography>
          <Typography
            sx={{
              fontFamily: theme.typography.fontFamily?.split(",")[1],
              fontSize: 24,
              color: "neutral.100",
            }}
          >
            Montserrat - The quick brown fox jumps over the lazy dog
          </Typography>
        </Box>
      </Stack>
    </Box>

    <Divider sx={{ borderColor: "neutral.500" }} />

    <Box>
      <Typography variant="h5" color="neutral.100" sx={{ mb: 2 }}>
        Variants
      </Typography>
      <Stack spacing={4}>
        {Object.keys(TYPOGRAPHY.variants).map((variant) => (
          <Box key={variant}>
            <Typography
              variant="caption"
              color="neutral.500"
              sx={{ display: "block", mb: 1 }}
            >
              {variant}
            </Typography>
            <Typography
              variant={
                variant as React.ComponentProps<typeof Typography>["variant"]
              }
              color="neutral.100"
            >
              The quick brown fox jumps over the lazy dog
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  </Stack>
);

const BreakpointsSection = () => (
  <Box>
    <Typography variant="body1" color="neutral.100">
      Breakpoints content coming soon...
    </Typography>
  </Box>
);

const SpacingSection = () => (
  <Box>
    <Typography variant="body1" color="neutral.100">
      Spacing content coming soon...
    </Typography>
  </Box>
);

const ComponentsSection = () => (
  <Stack spacing={4}>
    <Box>
      <Typography variant="h5" color="neutral.100" sx={{ mb: 2 }}>
        Buttons
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <AppButton variant="solid" color="teal.500">
          Solid Teal
        </AppButton>
        <AppButton variant="outlined" color="teal.500">
          Outlined Teal
        </AppButton>
        <AppButton variant="text" color="teal.500">
          Text Teal
        </AppButton>
        <AppButton disabled>Disabled</AppButton>
      </Stack>
    </Box>
  </Stack>
);

// --- Styled Components ---

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "calc(100vh - 80px)", // Adjust based on header height
  backgroundColor: theme.palette.black[700],
  overflow: "hidden",
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  backgroundColor: theme.palette.black[800],
  borderRight: `1px solid ${theme.palette.black[500]}`,
  padding: theme.spacing(3, 2),
  overflowY: "auto",
  flexShrink: 0,
}));

const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  overflowY: "auto",
}));

const TabButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  cursor: "pointer",
  color: isActive ? theme.palette.teal[500] : theme.palette.neutral[500],
  backgroundColor: isActive ? theme.palette.black[500] : "transparent",
  fontWeight: isActive ? 600 : 400,
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: theme.palette.black[500],
    color: isActive ? theme.palette.teal[500] : theme.palette.neutral[100],
  },
}));

const ColorCard = styled(Surface)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.black[800],
}));
