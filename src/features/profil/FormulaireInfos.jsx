import Bouton from '../../components/Bouton'
import Champ from '../../components/Champ'
import Message from '../../components/Message'
import { modifierProfil } from '../../services/profil'
import { MESSAGES } from '../../utils/validation'
import useFormulaire from '../compte/useFormulaire'

// « Mes informations » : prénom, nom, ville
export default function FormulaireInfos({ profil, onEnregistre }) {
  const { valeurs, erreurs, envoi, succes, changer, soumettre } = useFormulaire({
    prenom: profil.firstName,
    nom: profil.lastName,
    ville: profil.city ?? '',
  })
  const { prenom, nom, ville } = valeurs

  function envoyer(e) {
    e.preventDefault()
    const nouvellesErreurs = {}
    if (!prenom.trim()) nouvellesErreurs.prenom = MESSAGES.prenom
    if (!nom.trim()) nouvellesErreurs.nom = MESSAGES.nom

    soumettre(nouvellesErreurs, async () => {
      onEnregistre(await modifierProfil(profil.id, { firstName: prenom, lastName: nom, city: ville }))
    })
  }

  return (
    <form onSubmit={envoyer} noValidate className="ligne-menu__panneau">
      <Message type="succes">{succes && 'Modifications enregistrées.'}</Message>
      <Message type="erreur">{erreurs.serveur}</Message>

      <Champ id="prenom" label="Prénom" obligatoire value={prenom} onChange={changer} erreur={erreurs.prenom} />
      <Champ id="nom" label="Nom" obligatoire value={nom} onChange={changer} erreur={erreurs.nom} />
      <Champ id="ville" label="Ville ou quartier" value={ville} onChange={changer} />

      <Bouton type="submit" chargement={envoi}>
        Enregistrer
      </Bouton>
    </form>
  )
}
