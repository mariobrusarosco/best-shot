export const leaguesQueryKey = () => ["leagues"];
export const leagueQueryKey = (id?: string) => ["leagues", { id }];
export const leagueScoreKey = (id?: string) => ["leagues", id, "score"];
