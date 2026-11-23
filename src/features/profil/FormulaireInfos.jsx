import { useState } from 'react'
import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { modifierProfil } from '../../services/profil'
import { MESSAGES } from '../../utils/validation'

// « Mes informations » : prénom, nom, ville
export default function FormulaireInfos({ profil, onEnregistre }) {
  const [prenom, setPrenom] = useState(profil.firstName)
  const [nom, setNom] = useState(profil.lastName)
  const [ville, setVille] = useState(profil.city ?? '')
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState(false)

  async function envoyer(e) {
    e.preventDefault()
    setSucces(false)

    // 1. Vérifier les champs
    const nouvellesErreurs = {}
    if (!prenom.trim()) nouvellesErreurs.prenom = MESSAGES.prenom
    if (!nom.trim()) nouvellesErreurs.nom = MESSAGES.nom
    setErreurs(nouvellesErreurs)
    if (Object.keys(nouvellesErreurs).length > 0) return

    // 2. Enregistrer dans le back
    setEnvoi(true)
    try {
      onEnregistre(await modifierProfil(profil.id, { firstName: prenom, lastName: nom, city: ville }))
      setSucces(true)
    } catch (erreur) {
      setErreurs({ serveur: erreur.message })
    }
    setEnvoi(false)
  }

  return (
    <form onSubmit={envoyer} noValidate className="ligne-menu__panneau">
      <Message type="succes">{succes && 'Modifications enregistrées.'}</Message>
      <Message type="erreur">{erreurs.serveur}</Message>

      <Champ
        id="prenom"
        label="Prénom"
        obligatoire
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        erreur={erreurs.prenom}
      />
      <Champ
        id="nom"
        label="Nom"
        obligatoire
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        erreur={erreurs.nom}
      />
      <Champ id="ville" label="Ville ou quartier" value={ville} onChange={(e) => setVille(e.target.value)} />

      <Bouton type="submit" chargement={envoi}>
        Enregistrer
      </Bouton>
    </form>
  )
}
