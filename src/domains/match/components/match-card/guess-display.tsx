import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import type { GUESS_STATUS, IGuess } from "@/domains/guess/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { theme } from "@/domains/ui-system/theme";

interface Props {
  data: IGuess["away"] | IGuess["away"];
  cardExpanded: boolean;
}

export const GuessDisplay = ({ data, cardExpanded }: Props) => {
  console.log("data", data);
  if (cardExpanded || data.status === "expired") return null;

  const value = data.value;
  const { color, bgColor } = getStylesByStatus(data?.status || null);

  return (
    <Wrapper data-ui="guess-display">
      <Typography textTransform="uppercase" variant="tag" fontWeight={500}>
        you
      </Typography>
      <AppPill.Component
        minWidth={30}
        height={20}
        padding={0}
        color={color}
        bgcolor={bgColor}
      >
        <Typography variant="tag">{value ?? "-"}</Typography>
      </AppPill.Component>
    </Wrapper>
  );
};

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(0.5),
}));

const getStylesByStatus = (status: GUESS_STATUS) => {
  if (status === "expired") {
    return {
      color: theme.palette.neutral[100],
      bgColor: "transparent",
    };
  }

  return {
    color: "neutral.100",
    bgColor: "black.500",
  };
};
