import { useState } from 'react'

// Code commun à tous les formulaires
export default function useFormulaire(valeursDeDepart) {
  const [valeurs, setValeurs] = useState(valeursDeDepart) // ce qui est écrit dans les champs
  const [erreurs, setErreurs] = useState({}) // les messages d'erreur
  const [envoi, setEnvoi] = useState(false) // true pendant l'envoi
  const [succes, setSucces] = useState(false) // true si l'envoi a marché

  // Quand on écrit dans un champ, on met à jour sa valeur
  function changer(e) {
    setValeurs({ ...valeurs, [e.target.id]: e.target.value })
  }

  // Quand on valide le formulaire : s'il y a des erreurs on les affiche, sinon on envoie
  async function soumettre(erreursTrouvees, action) {
    setSucces(false)
    setErreurs(erreursTrouvees)
    if (Object.keys(erreursTrouvees).length > 0) return

    setEnvoi(true)
    try {
      await action()
      setSucces(true)
    } catch (erreur) {
      // Si l'envoi échoue, on affiche l'erreur
      setErreurs({ [erreur.champ ?? 'serveur']: erreur.message })
    }
    setEnvoi(false)
  }

  return { valeurs, setValeurs, erreurs, envoi, succes, changer, soumettre }
}
