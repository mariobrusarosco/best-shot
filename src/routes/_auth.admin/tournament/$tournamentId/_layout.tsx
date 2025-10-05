import { createFileRoute } from '@tanstack/react-router'
import { AdminTournamentLayout } from '@/domains/admin/layout'

export const Route = createFileRoute('/_auth/admin/tournament/$tournamentId/_layout')({
  component: AdminTournamentLayout,
})