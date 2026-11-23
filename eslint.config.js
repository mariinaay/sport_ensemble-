// Règles de `npm run lint` : ESLint relit le code et signale les erreurs.
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  // Dossiers à ne pas vérifier (code généré ou installé)
  { ignores: ['dist', 'node_modules'] },

  // Le code de l'application (src/) : tourne dans le navigateur, écrit en JSX
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Ignore les noms en majuscule : ESLint ne voit pas qu'un composant importé sert dans le JSX.
      // ignoreRestSiblings : autorise { password, ...reste } pour retirer un champ d'un objet.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z]', ignoreRestSiblings: true }],
    },
  },

  // Les fichiers de configuration : tournent dans Node (le terminal)
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
]
