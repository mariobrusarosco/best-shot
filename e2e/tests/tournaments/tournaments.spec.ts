import { test, expect } from '../../fixtures/auth.fixture';
import { tournaments, navigation, dashboard } from '../../utils/selectors';

test.describe('Tournaments @critical', () => {
    
  const expectedTournaments = [
    { name: 'Premier League 25/26', type: 'regular' },
    { name: 'FA Cup 25/26', type: 'knockout' },
  ];

  for (const tournament of expectedTournaments) {
    test(`should list tournament: ${tournament.name}`, async ({ authenticatedPage }) => {
      // 1. Navigate to Tournaments
      await authenticatedPage.goto('/tournaments');
      await authenticatedPage.waitForURL(/.*tournaments/);
      
      // 2. Verify we see the tournament link
      const tournamentLink = tournaments.cardLink(authenticatedPage, new RegExp(tournament.name, 'i')).first();
      await expect(tournamentLink).toBeVisible();
      
      // 3. Click into the tournament
      await tournamentLink.click();
      
      // 4. Verify we reached the details page
      await expect(authenticatedPage).toHaveURL(/.*tournaments\/.*/);
      await expect(dashboard.screenHeading(authenticatedPage)).toBeVisible();

      // 5. Verify type-specific elements
      if (tournament.type === 'regular') {
        await expect(tournaments.standingsTable(authenticatedPage)).toBeVisible();
      } else {
        await expect(tournaments.noStandingsMessage(authenticatedPage)).toBeVisible();
      }
    });
  }
});
