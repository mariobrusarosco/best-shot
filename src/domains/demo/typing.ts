export type responseGloboEsporteRound = {
	id: number;
	content: responseGloboEsporteGame[];
};

export type responseGloboEsporteGame = {
	id: number;
	data_realizacao: string;
	hora_realizacao: string;
	placar_oficial_visitante: number | null;
	placar_oficial_mandante: number | null;
	equipes: {
		mandante: {
			id: number;
			nome_popular: string;
			sigla: string;
		};
		visitante: {
			id: number;
			nome_popular: string;
			sigla: string;
		};
	};
	sede: {
		nome_popular: string;
	};
	jogo_ja_comecou: boolean;
};

export type globoEsporteGame = {
	id: number;
	date: string;
	time: string;
	homeScore: number | null;
	awayScore: number | null;
	homeTeam: string;
	awayTeam: string;
	stadium: string;
	gameStarted: boolean;
};

export type IRound = {
	id: number;
	games: IGame[];
};

export type IGame = globoEsporteGame;
