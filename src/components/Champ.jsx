// Champ de formulaire : label, saisie, erreur en dessous (`multiligne` = grande zone de texte)
export default function Champ({ id, label, erreur, obligatoire, multiligne, ...reste }) {
  const Zone = multiligne ? 'textarea' : 'input'

  return (
    <div className="champ">
      <label htmlFor={id}>
        {label}
        {obligatoire && (
          <span className="champ__etoile" aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      <Zone
        id={id}
        className="champ__input"
        required={obligatoire}
        aria-invalid={Boolean(erreur)}
        aria-describedby={erreur ? `${id}-erreur` : undefined}
        {...reste}
      />
      {erreur && (
        <p id={`${id}-erreur`} className="champ__erreur" role="alert">
          {erreur}
        </p>
      )}
    </div>
  )
}
