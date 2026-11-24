// Appels au back pour les séances
import { requete } from './api'

// Toutes les séances, chacune avec la liste de ses inscrits (prénom + nom)
export async function lireSeances() {
  const [seances, utilisateurs] = await Promise.all([
    requete('/sessions?_embed=registrations'),
    requete('/users'),
  ])

  return seances.map((seance) => ({
    ...seance,
    inscrits: seance.registrations
      .map((inscription) => utilisateurs.find((u) => u.id === inscription.userId))
      .filter(Boolean),
  }))
}
