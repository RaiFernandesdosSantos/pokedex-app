# Pokédex Kanto - Expo App

App mobile feito com [Expo](https://expo.dev), React Native e Firebase. UI inspirada em Figma.

---

## 📁 Estrutura

```
├── app/
│   ├── _layout.tsx         # Layout raiz, rotas e header
│   ├── login.tsx           # Login
│   ├── register.tsx        # Cadastro
│   ├── [pokemonId].tsx     # Detalhes do Pokémon
│   ├── index.tsx           # Lista de Pokémons
│   └── (drawer)/           # Rotas privadas (Drawer)
│       ├── _layout.tsx     # Layout do Drawer
│       ├── index.tsx       # Home (Pokédex)
│       ├── perfil.tsx      # Perfil e time
│       ├── Ginasios.tsx    # Líderes de ginásio
│       └── ...
├── assets/
│   ├── components/         # Componentes reutilizáveis
│   ├── icons/              # SVGs e ícones
│   └── style/              # Estilos e tema
├── context/                # Contextos globais (auth, time)
├── services/               # Serviços de API
├── config/                 # Configuração do Firebase
└── ...
```

---

## Fluxo

- Usuário abre o app
- Proteção de rotas em \_layout.tsx
- Não autenticado → login/register
- Autenticado → (drawer)/index (Pokédex)
- Drawer: Pokédex, Perfil, Ginásios
- Stack: Detalhes do Pokémon, Lista

---

## Componentes/Serviços

- **AuthContext**: Autenticação Firebase
- **PokemonTeamContext**: Time do usuário (Firestore)
- **CardPokemon, TypeBadge, StatBar, EvolutionStage**: UI
- **pokemonService**: Dados da PokéAPI + cache
- **typeService**: Fraquezas do time
- **gymService**: Dados dos líderes de ginásio

---

## Tema

- Cores e tokens em `assets/style/theme.ts`
- Estilos com StyleSheet do React Native

---

## Como rodar

```sh
npm install
npx expo start
```

---

## Segurança

- Não exponha suas chaves do Firebase publicamente.
- Só usuários autenticados acessam rotas privadas.

---

## Links úteis

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [PokéAPI](https://pokeapi.co/)
- [Firebase](https://firebase.google.com/)

---

Feito com ❤️ por fãs de Pokémon!
