export interface I_Member {
	id: string;
	nickName: string;
	email: string;
	firstName: string;
	lastName: string;
}

export interface I_MemberPerformance {
	tournaments: {
		worstPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
		bestPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
	};

	leagues: {
		worstPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
		bestPerformance: {
			id: string;
			points: number;
			label: string;
			logo: string;
		};
	};
}
