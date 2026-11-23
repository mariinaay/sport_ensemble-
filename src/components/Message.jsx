// Message rouge (erreur) ou vert (succès) ; rien s'il n'y a pas de texte
export default function Message({ type, children }) {
  if (!children) return null

  return (
    <p className={`message-${type}`} role={type === 'erreur' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}
