# Structure

1. Files inside /routes are part of FILE-ROUTING system. Their goal is to "import" screen.
2. The code for a screen follows the domain driven architecture: ..../screens.

### Example

`index.lazy.tsx`

```
import { createLazyFileRoute } from "@tanstack/react-router";
import { LeagueScreen } from "@/domains/league/screens/league";

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId/")({
  component: LeagueScreen,
});
```

`domain/leagues/screens/league.tsx`

```
export const LeagueScreen = () => {
  const { league } = useLeague();
  const hasInvitePermission = league?.data?.permissions.invite;
  const hasEditPermission = league?.data?.permissions.edit;
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleOpenInviteDialog = useCallback(
```
