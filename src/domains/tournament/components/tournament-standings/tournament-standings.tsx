import {
  Box,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentStandings } from "@/domains/tournament/hooks/use-tournament-standings";
import {
  type TournamentStandingGroupSchema,
  type TournamentStandingTeamSchema,
} from "@/domains/tournament/schemas";
import type { z } from "zod";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { theme, UIHelper } from "@/domains/ui-system/theme";
import { OverflowOnHover } from "@/domains/ui-system/utils";

const TournamentStandings = () => {
  const tournamentStandings = useTournamentStandings();
  const tournamentQuery = useTournament();

  if (tournamentStandings.isPending) {
    return (
      <Wrapper data-testid="standings-loading">
        <Typography variant="h6" color={theme.palette.neutral[100]}>
          Loading
        </Typography>
      </Wrapper>
    );
  }

  if (tournamentStandings.error) {
    return (
      <Wrapper data-testid="standings-error">
        <Typography variant="h6" color={theme.palette.neutral[100]}>
          Error
        </Typography>
      </Wrapper>
    );
  }

  if (tournamentQuery.data?.mode === "knockout-only") {
    return (
      <Wrapper data-testid="standings-wrapper">
        <Heading>
          <AppPill.Component
            border="1px solid"
            borderColor="teal.500"
            width={80}
            height={25}
          >
            <Typography
              variant="tag"
              textTransform="uppercase"
              color="neutral.100"
              fontWeight={500}
            >
              standings
            </Typography>
          </AppPill.Component>
        </Heading>
        <Typography
          variant="label"
          color={theme.palette.neutral[100]}
          data-testid="no-standings-message"
        >
          Knockout tournaments do not have standings
        </Typography>
      </Wrapper>
    );
  }

  const standings = tournamentStandings.data;

  if (!standings) {
    return (
      <Stack data-testid="empty-standings-message">
        <Heading>
          <AppPill.Component
            border="1px solid"
            borderColor="teal.500"
            width={80}
            height={25}
          >
            <Typography
              variant="tag"
              textTransform="uppercase"
              color="neutral.100"
              fontWeight={500}
            >
              standings
            </Typography>
          </AppPill.Component>
        </Heading>
        <Typography variant="topic" color={theme.palette.neutral[100]}>
          It seems that there are no standings available for this tournament
        </Typography>
      </Stack>
    );
  }

  return (
    <Wrapper data-ui="standings">
      <Heading>
        <AppPill.Component
          border="1px solid"
          borderColor="teal.500"
          width={80}
          height={25}
        >
          <Typography
            variant="tag"
            textTransform="uppercase"
            color="neutral.100"
            fontWeight={500}
          >
            standings
          </Typography>
        </AppPill.Component>
      </Heading>

      {standings.format === "multi-group" ? (
        <MultiGroupStandings
          groups={
            standings.teams as z.infer<typeof TournamentStandingGroupSchema>[]
          }
        />
      ) : (
        <UniqueGroupStandings
          teams={
            standings.teams as z.infer<typeof TournamentStandingTeamSchema>[]
          }
        />
      )}
    </Wrapper>
  );
};

const Skeleton = () => {
  return (
    <Wrapper data-ui="standings">
      <Heading sx={{ ...shimmerEffect() }}></Heading>

      <StandingsTable size="small" aria-label="standings-table">
        <TableHead>
          <Row sx={{ ...shimmerEffect(), height: "20px" }} />
        </TableHead>
        <TableBody>
          <Row sx={{ ...shimmerEffect(), py: 2 }} />
        </TableBody>
      </StandingsTable>
    </Wrapper>
  );
};

export default {
  Component: TournamentStandings,
  Skeleton,
};

const Cell = styled(TableCell)`
  border: none;
  padding: ${({ theme }) => theme.spacing(1.5)};
  font-weight: 200;
  text-align: center;
`;

const StandingsTable = styled(Table)(({ theme }) => ({
  borderRadius: theme.spacing(3),
}));

const Row = styled(TableRow)(() => ({
  border: "none",
}));

const Wrapper = styled(Box)(() => ({
  [UIHelper.whileIs("mobile")]: {
    display: "none",
  },

  [UIHelper.startsOn("tablet")]: {
    flex: 1,
  },
  ...OverflowOnHover(),
}));

const Heading = styled(Box)(() => ({
  backgroundColor: theme.palette.black[700],
  paddingBottom: theme.spacing(3),
}));

export const TeamLogo = styled("img")(({ theme }) =>
  theme?.unstable_sx({
    display: "inline-flex",
    width: 18,
    height: 18,
  }),
);

const MultiGroupStandings = ({
  groups,
}: {
  groups: z.infer<typeof TournamentStandingGroupSchema>[];
}) => {
  return (
    <Stack gap={4}>
      {groups.map((group) => (
        <Box key={group.name} data-testid={`standings-group-${group.name}`}>
          <Heading sx={{ paddingBottom: theme.spacing(3) }}>
            <AppPill.Component
              bgcolor="teal.500"
              width="fit-content"
              height={25}
              px={2}
            >
              <Typography
                variant="tag"
                textTransform="uppercase"
                color="neutral.100"
                fontWeight={500}
              >
                {group.name}
              </Typography>
            </AppPill.Component>
          </Heading>
          <StandingsList teams={group.teams} />
        </Box>
      ))}
    </Stack>
  );
};

const UniqueGroupStandings = ({
  teams,
}: {
  teams: z.infer<typeof TournamentStandingTeamSchema>[];
}) => {
  return <StandingsList teams={teams} />;
};

const StandingsList = ({
  teams,
}: {
  teams: z.infer<typeof TournamentStandingTeamSchema>[];
}) => {
  return (
    <StandingsTable
      size="small"
      aria-label="standings-table"
      data-testid="standings-table"
    >
      <TableHead>
        <Row>
          <Cell sx={{ pt: 0, pb: 0, textAlign: "left" }}>
            <Typography
              variant="label"
              fontWeight={300}
              textTransform="uppercase"
              color="teal.500"
            >
              team
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              pts
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              g
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              w
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              d
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              l
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              gf
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              ga
            </Typography>
          </Cell>
          <Cell sx={{ pt: 0, pb: 0 }}>
            <Typography
              variant="label"
              textTransform="uppercase"
              color="teal.500"
              fontWeight={300}
            >
              gd
            </Typography>
          </Cell>
        </Row>
      </TableHead>

      <TableBody>
        {teams.map((row) => {
          return (
            <Row key={row.order} sx={{ color: "neutral.100" }}>
              <Cell sx={{ color: "neutral.100" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography
                    variant="label"
                    textTransform="uppercase"
                    fontWeight={300}
                    color="teal.500"
                  >
                    {row.order}
                  </Typography>

                  <Stack flexDirection="row" alignItems="center" gap={0.5}>
                    <TeamLogo src={row.teamBadge} />
                    <Typography
                      variant="label"
                      textTransform="uppercase"
                      fontWeight={300}
                      color="neutral.100"
                      sx={{
                        display: {
                          all: "none",
                          tablet: "inline-block",
                        },
                      }}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      textAlign="left"
                    >
                      {row.shortName || row.longName}
                    </Typography>
                  </Stack>

                  {/* Fallback for mobile */}
                  <Typography
                    variant="label"
                    textTransform="uppercase"
                    fontWeight={300}
                    color="neutral.100"
                    sx={{
                      display: {
                        all: "inline-block",
                        tablet: "none",
                      },
                    }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    textAlign="left"
                  >
                    {row.shortName}
                  </Typography>
                </Stack>
              </Cell>
              <Cell sx={{ color: "neutral.100" }}>
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.points}
                </Typography>
              </Cell>
              <Cell sx={{ color: "neutral.100" }} align="right">
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.games}
                </Typography>
              </Cell>
              <Cell sx={{ color: "neutral.100" }} align="right">
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.wins}
                </Typography>
              </Cell>
              <Cell sx={{ color: "neutral.100" }} align="right">
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.draws}
                </Typography>
              </Cell>
              <Cell sx={{ color: "neutral.100" }} align="right">
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.losses}
                </Typography>
              </Cell>
              <Cell sx={{ color: "neutral.100" }} align="right">
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.gf}
                </Typography>
              </Cell>
              <Cell sx={{ color: "neutral.100" }} align="right">
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.ga}
                </Typography>
              </Cell>
              <Cell sx={{ color: "neutral.100" }} align="right">
                <Typography
                  variant="label"
                  textTransform="uppercase"
                  fontWeight={300}
                  color="neutral.100"
                >
                  {row.gd}
                </Typography>
              </Cell>
            </Row>
          );
        })}
      </TableBody>
    </StandingsTable>
  );
};
