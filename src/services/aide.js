// Appels au back pour la page Aide & contact
import { envoyer } from './api'

export function envoyerMessage(email, sujet, message) {
  return envoyer('POST', '/messages', { email: email.trim(), sujet, message, date: new Date().toISOString() })
}
