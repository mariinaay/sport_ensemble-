import { useState } from 'react'

// Ce que tous les formulaires ont en commun : les valeurs des champs, les erreurs, l'envoi en cours, le succès.
// Les clés de `valeurs` et de `erreurs` sont les id des champs.
export default function useFormulaire(valeursDeDepart) {
  const [valeurs, setValeurs] = useState(valeursDeDepart)
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState(false)

  // Un seul onChange pour tous les champs : l'id du champ dit quelle valeur changer
  function changer(e) {
    setValeurs({ ...valeurs, [e.target.id]: e.target.value })
  }

  // Affiche les erreurs trouvées ; s'il n'y en a aucune, lance `action` (l'appel au back)
  async function soumettre(erreursTrouvees, action) {
    setSucces(false)
    setErreurs(erreursTrouvees)
    if (Object.keys(erreursTrouvees).length > 0) return

    setEnvoi(true)
    try {
      await action()
      setSucces(true)
    } catch (erreur) {
      // Erreur sous le champ concerné, sinon en haut
      setErreurs({ [erreur.champ ?? 'serveur']: erreur.message })
    }
    setEnvoi(false)
  }

  return { valeurs, setValeurs, erreurs, envoi, succes, changer, soumettre }
}
