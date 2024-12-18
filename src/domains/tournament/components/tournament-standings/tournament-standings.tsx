import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { UIHelper } from "@/theming/theme";
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

export const TournamentStandings = () => {
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
			<TableContainer>
				<StandingsTable size="small" aria-label="standings-table">
					<TableHead>
						<Row>
							<Cell sx={{ pt: 3, pb: 0, textAlign: "left" }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									team
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									pts
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									g
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									w
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									d
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									l
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									gf
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									ga
								</Typography>
							</Cell>
							<Cell sx={{ pt: 3, pb: 0 }}>
								<Typography
									variant="label"
									textTransform="uppercase"
									color="teal.500"
								>
									gd
								</Typography>
							</Cell>
						</Row>
					</TableHead>
					<TableBody>
						{fakeData?.map((row) => {
							return (
								<Row key={row.ordem} sx={{ color: "neutral.100" }}>
									<Cell sx={{ color: "neutral.100" }}>
										<Stack direction="row" alignItems="center" gap={1}>
											<Typography
												variant="label"
												textTransform="uppercase"
												color="teal.500"
											>
												{row.ordem}
											</Typography>
											<Typography
												variant="label"
												textTransform="uppercase"
												color="neutral.100"
											>
												{row.sigla}
											</Typography>
										</Stack>
									</Cell>
									<Cell sx={{ color: "neutral.100" }}>
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.pontos}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.jogos}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.vitorias}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.empates}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.derrotas}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.gols_pro}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.gols_contra}
										</Typography>
									</Cell>
									<Cell sx={{ color: "neutral.100" }} align="right">
										<Typography
											variant="label"
											textTransform="uppercase"
											color="neutral.100"
										>
											{row.saldo_gols}
										</Typography>
									</Cell>
								</Row>
							);
						})}
					</TableBody>
				</StandingsTable>
			</TableContainer>
		</Wrapper>
	);
};

const Cell = styled(TableCell)`
	border: none;
	padding: ${({ theme }) => theme.spacing(2, 3)};
	font-weight: 200;
	text-align: center;
`;

const StandingsTable = styled(Table)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	borderRadius: theme.spacing(3),
}));

const Row = styled(TableRow)(() => ({
	border: "none",
}));

const TableContainer = styled(Box)(({ theme }) => ({
	border: "none",
	padding: theme.spacing(0, 1, 0, 0),
	overflow: "auto",
	height: "100%",
}));

const Wrapper = styled(Box)(() => ({
	flex: 1,
	[UIHelper.startsOn("tablet")]: {},
}));

const fakeData = [
	{
		ordem: 1,
		variacao: 0,
		pontos: 36,
		nome_popular: "Liverpool",
		sigla: "LIV",
		vitorias: 11,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/10/05/liverpool-svg-72634.svg",
		equipe_id: 2667,
		aproveitamento: 80,
		jogos: 15,
		derrotas: 1,
		faixa_classificacao_cor: "#0000ff",
		faixa_classificacao: {
			cor: "#0000ff",
		},
		ultimos_jogos: ["v", "v", "v", "e", "e"],
		saldo_gols: 18,
		gols_pro: 31,
		gols_contra: 13,
		empates: 3,
	},
	{
		ordem: 2,
		variacao: 0,
		pontos: 34,
		nome_popular: "Chelsea",
		sigla: "CHE",
		vitorias: 10,
		escudo: "https://s.sde.globo.com/media/teams/2018/03/11/chelsea.svg",
		equipe_id: 2661,
		aproveitamento: 70,
		jogos: 16,
		derrotas: 2,
		faixa_classificacao_cor: "#0000ff",
		faixa_classificacao: {
			cor: "#0000ff",
		},
		ultimos_jogos: ["v", "v", "v", "v", "v"],
		saldo_gols: 18,
		gols_pro: 37,
		gols_contra: 19,
		empates: 4,
	},
	{
		ordem: 3,
		variacao: 0,
		pontos: 30,
		nome_popular: "Arsenal",
		sigla: "ARS",
		vitorias: 8,
		escudo: "https://s.sde.globo.com/media/teams/2018/03/11/arsenal.svg",
		equipe_id: 2663,
		aproveitamento: 62,
		jogos: 16,
		derrotas: 2,
		faixa_classificacao_cor: "#0000ff",
		faixa_classificacao: {
			cor: "#0000ff",
		},
		ultimos_jogos: ["v", "v", "v", "e", "e"],
		saldo_gols: 14,
		gols_pro: 29,
		gols_contra: 15,
		empates: 6,
	},
	{
		ordem: 4,
		variacao: 1,
		pontos: 28,
		nome_popular: "Nottingham Forest",
		sigla: "NOT",
		vitorias: 8,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/02/27/nottingham_forest.svg",
		equipe_id: 3971,
		aproveitamento: 58,
		jogos: 16,
		derrotas: 4,
		faixa_classificacao_cor: "#0000ff",
		faixa_classificacao: {
			cor: "#0000ff",
		},
		ultimos_jogos: ["d", "v", "d", "v", "v"],
		saldo_gols: 2,
		gols_pro: 21,
		gols_contra: 19,
		empates: 4,
	},
	{
		ordem: 5,
		variacao: -1,
		pontos: 27,
		nome_popular: "Manchester City",
		sigla: "MAC",
		vitorias: 8,
		escudo:
			"https://s.sde.globo.com/media/organizations/2018/03/11/manchester-city.svg",
		equipe_id: 2665,
		aproveitamento: 56,
		jogos: 16,
		derrotas: 5,
		faixa_classificacao_cor: "#00ffff",
		faixa_classificacao: {
			cor: "#00ffff",
		},
		ultimos_jogos: ["d", "d", "v", "e", "d"],
		saldo_gols: 5,
		gols_pro: 28,
		gols_contra: 23,
		empates: 3,
	},
	{
		ordem: 6,
		variacao: 2,
		pontos: 25,
		nome_popular: "Bournemouth",
		sigla: "BOU",
		vitorias: 7,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/11/01/AFC_Bournemouth_2013_1.svg",
		equipe_id: 4224,
		aproveitamento: 52,
		jogos: 16,
		derrotas: 5,
		faixa_classificacao_cor: "#008000",
		faixa_classificacao: {
			cor: "#008000",
		},
		ultimos_jogos: ["d", "v", "v", "v", "e"],
		saldo_gols: 3,
		gols_pro: 24,
		gols_contra: 21,
		empates: 4,
	},
	{
		ordem: 7,
		variacao: -1,
		pontos: 25,
		nome_popular: "Aston Villa",
		sigla: "ASV",
		vitorias: 7,
		escudo:
			"https://s.sde.globo.com/media/organizations/2023/12/05/Aston_Villa.svg",
		equipe_id: 2666,
		aproveitamento: 52,
		jogos: 16,
		derrotas: 5,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["e", "d", "v", "v", "d"],
		saldo_gols: -1,
		gols_pro: 24,
		gols_contra: 25,
		empates: 4,
	},
	{
		ordem: 8,
		variacao: 2,
		pontos: 24,
		nome_popular: "Fulham",
		sigla: "FUL",
		vitorias: 6,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/10/04/fulham-svg-72605.svg",
		equipe_id: 2673,
		aproveitamento: 50,
		jogos: 16,
		derrotas: 4,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["d", "e", "v", "e", "e"],
		saldo_gols: 2,
		gols_pro: 24,
		gols_contra: 22,
		empates: 6,
	},
	{
		ordem: 9,
		variacao: -2,
		pontos: 24,
		nome_popular: "Brighton",
		sigla: "BFC",
		vitorias: 6,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/04/25/Brighton_xcDfo4Q.svg",
		equipe_id: 4436,
		aproveitamento: 50,
		jogos: 16,
		derrotas: 4,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["v", "e", "d", "e", "d"],
		saldo_gols: 1,
		gols_pro: 26,
		gols_contra: 25,
		empates: 6,
	},
	{
		ordem: 10,
		variacao: 1,
		pontos: 23,
		nome_popular: "Tottenham",
		sigla: "TOT",
		vitorias: 7,
		escudo:
			"https://s.sde.globo.com/media/organizations/2018/03/11/tottenham.svg",
		equipe_id: 2664,
		aproveitamento: 47,
		jogos: 16,
		derrotas: 7,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["v", "e", "d", "d", "v"],
		saldo_gols: 17,
		gols_pro: 36,
		gols_contra: 19,
		empates: 2,
	},
	{
		ordem: 11,
		variacao: -2,
		pontos: 23,
		nome_popular: "Brentford",
		sigla: "BRE",
		vitorias: 7,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/02/19/Brentford.svg",
		equipe_id: 4435,
		aproveitamento: 47,
		jogos: 16,
		derrotas: 7,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["e", "v", "d", "v", "d"],
		saldo_gols: 2,
		gols_pro: 32,
		gols_contra: 30,
		empates: 2,
	},
	{
		ordem: 12,
		variacao: 0,
		pontos: 23,
		nome_popular: "Newcastle",
		sigla: "NEW",
		vitorias: 6,
		escudo:
			"https://s.sde.globo.com/media/organizations/2023/09/04/Newcastle_United.svg",
		equipe_id: 2680,
		aproveitamento: 47,
		jogos: 16,
		derrotas: 5,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["d", "e", "e", "d", "v"],
		saldo_gols: 2,
		gols_pro: 23,
		gols_contra: 21,
		empates: 5,
	},
	{
		ordem: 13,
		variacao: 0,
		pontos: 22,
		nome_popular: "Manchester United",
		sigla: "MAN",
		vitorias: 6,
		escudo:
			"https://s.sde.globo.com/media/teams/2018/03/11/manchester-united.svg",
		equipe_id: 2662,
		aproveitamento: 45,
		jogos: 16,
		derrotas: 6,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["e", "v", "d", "d", "v"],
		saldo_gols: 2,
		gols_pro: 21,
		gols_contra: 19,
		empates: 4,
	},
	{
		ordem: 14,
		variacao: 0,
		pontos: 19,
		nome_popular: "West Ham",
		sigla: "WTH",
		vitorias: 5,
		escudo:
			"https://s.sde.globo.com/media/organizations/2023/06/06/west-ham-svg.svg",
		equipe_id: 2679,
		aproveitamento: 39,
		jogos: 16,
		derrotas: 7,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["v", "d", "d", "v", "e"],
		saldo_gols: -8,
		gols_pro: 21,
		gols_contra: 29,
		empates: 4,
	},
	{
		ordem: 15,
		variacao: 2,
		pontos: 16,
		nome_popular: "Crystal Palace",
		sigla: "CPA",
		vitorias: 3,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/09/20/Crystal_Palace_FC.svg",
		equipe_id: 3675,
		aproveitamento: 33,
		jogos: 16,
		derrotas: 6,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["e", "e", "v", "e", "v"],
		saldo_gols: -4,
		gols_pro: 17,
		gols_contra: 21,
		empates: 7,
	},
	{
		ordem: 16,
		variacao: -1,
		pontos: 15,
		nome_popular: "Everton",
		sigla: "EVE",
		vitorias: 3,
		escudo:
			"https://s.sde.globo.com/media/organizations/2017/10/22/Everton-65.png",
		equipe_id: 2668,
		aproveitamento: 33,
		jogos: 15,
		derrotas: 6,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["e", "e", "d", "v", "e"],
		saldo_gols: -7,
		gols_pro: 14,
		gols_contra: 21,
		empates: 6,
	},
	{
		ordem: 17,
		variacao: -1,
		pontos: 14,
		nome_popular: "Leicester",
		sigla: "LEI",
		vitorias: 3,
		escudo: "https://s.sde.globo.com/media/teams/2014/07/22/lei65.png",
		equipe_id: 2936,
		aproveitamento: 29,
		jogos: 16,
		derrotas: 8,
		faixa_classificacao_cor: null,
		faixa_classificacao: {
			cor: null,
		},
		ultimos_jogos: ["d", "d", "v", "e", "d"],
		saldo_gols: -13,
		gols_pro: 21,
		gols_contra: 34,
		empates: 5,
	},
	{
		ordem: 18,
		variacao: 0,
		pontos: 12,
		nome_popular: "Ipswich",
		sigla: "IPT",
		vitorias: 2,
		escudo:
			"https://s.sde.globo.com/media/organizations/2022/12/22/65_0008_ipswich-town-57735.png",
		equipe_id: 6400,
		aproveitamento: 25,
		jogos: 16,
		derrotas: 8,
		faixa_classificacao_cor: "#ff0000",
		faixa_classificacao: {
			cor: "#ff0000",
		},
		ultimos_jogos: ["e", "d", "d", "d", "v"],
		saldo_gols: -12,
		gols_pro: 16,
		gols_contra: 28,
		empates: 6,
	},
	{
		ordem: 19,
		variacao: 0,
		pontos: 9,
		nome_popular: "Wolverhampton",
		sigla: "WOL",
		vitorias: 2,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/09/27/Wolverhampton.svg",
		equipe_id: 2677,
		aproveitamento: 18,
		jogos: 16,
		derrotas: 11,
		faixa_classificacao_cor: "#ff0000",
		faixa_classificacao: {
			cor: "#ff0000",
		},
		ultimos_jogos: ["v", "d", "d", "d", "d"],
		saldo_gols: -16,
		gols_pro: 24,
		gols_contra: 40,
		empates: 3,
	},
	{
		ordem: 20,
		variacao: 0,
		pontos: 5,
		nome_popular: "Southampton",
		sigla: "SOU",
		vitorias: 1,
		escudo:
			"https://s.sde.globo.com/media/organizations/2024/02/27/Southampton_FC.svg.svg",
		equipe_id: 3488,
		aproveitamento: 10,
		jogos: 16,
		derrotas: 13,
		faixa_classificacao_cor: "#ff0000",
		faixa_classificacao: {
			cor: "#ff0000",
		},
		ultimos_jogos: ["d", "e", "d", "d", "d"],
		saldo_gols: -25,
		gols_pro: 11,
		gols_contra: 36,
		empates: 2,
	},
];

const Heading = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		backgroundColor: "black.700",
		pb: 3,
	}),
);
