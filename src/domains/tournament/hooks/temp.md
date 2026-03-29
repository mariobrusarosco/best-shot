Yes, we finished that backend contract.

What changed:

src/domains/tournament/api/index.ts
src/domains/league/api/index.ts
New behavior
Both existing score endpoints now accept an optional memberId query param.

Tournament score
GET /api/v1/tournaments/:tournamentId/score
GET /api/v2/tournaments/:tournamentId/score
Now supports:

GET /api/v2/tournaments/:tournamentId/score?memberId=<member-uuid>
If memberId is omitted:

it still uses the authenticated member, exactly like before
League score
GET /api/v1/leagues/:leagueId/score
GET /api/v2/leagues/:leagueId/score
Now supports:

GET /api/v2/leagues/:leagueId/score?memberId=<member-uuid>
If memberId is omitted:

it still uses the authenticated member
League guard I added
For league score:

requester must be a member of the league
if memberId is different from the requester:
that target member must also be a member of the league
So we didn’t open a “query any random member” hole there.

Frontend contract
Examples:

GET /api/v2/tournaments/53d6fef8-4f43-45dc-9397-15db829d72dd/score?memberId=4b3fbbf6-ecb2-41a2-a55c-5be9aaf832b7
GET /api/v2/leagues/<leagueId>/score?memberId=4b3fbbf6-ecb2-41a2-a55c-5be9aaf832b7
Response shapes
Tournament:

{
  "points": 0,
  "underCalculation": true
}
League:

{
  "points": 0,
  "tournaments": [],
  "underCalculation": true
}
Verification:

yarn eslint src/domains/tournament/api/index.ts src/domains/league/api/index.ts
yarn compile
One explicit assumption I made:

memberId here means the internal member UUID, not publicId
If you want, next I can give you a tiny frontend-facing note with the exact endpoints and query param contract in one copy-paste block.







