# Pokédex Kanto - Expo App

Este projeto é uma Pokédex moderna para dispositivos móveis, construída com [Expo](https://expo.dev), React Native, Firebase e um design system inspirado no Figma.

---

## 📁 Estrutura de Pastas

```
├── app/
│   ├── _layout.tsx         # Layout raiz, proteção de rotas, providers e header global
│   ├── login.tsx           # Tela de login
│   ├── register.tsx        # Tela de cadastro
│   ├── [pokemonId].tsx     # Detalhes do Pokémon (Stack, fora do Drawer)
│   ├── index.tsx           # Lista de Pokémons (Stack, fora do Drawer)
│   └── (drawer)/           # Grupo de rotas privadas (Drawer)
│       ├── _layout.tsx     # Layout do Drawer (define rotas privadas)
│       ├── index.tsx       # Home (Pokédex)
│       ├── perfil.tsx      # Tela de perfil e time do usuário
│       ├── Ginasios.tsx    # Tela de líderes de ginásio
│       └── ...
├── assets/
│   ├── components/         # Componentes reutilizáveis (ex: CardPokemon, TypeBadge)
│   ├── icons/              # SVGs e ícones customizados
│   └── style/              # Estilos centralizados e tema
├── context/
│   ├── AuthContext.tsx     # Contexto de autenticação (Firebase Auth)
│   └── PokemonTeamContext.tsx # Contexto do time do usuário (Firestore)
├── services/               # Serviços de API (Pokémon, tipos, ginásios)
├── config/
│   └── firebaseConfig.ts   # Configuração do Firebase
├── package.json
├── tsconfig.json
└── ...
```

---

## 🔄 Fluxo do App

```
Usuário abre o app
   │
   ▼
[Proteção de Rotas em _layout.tsx]
   │
   ├── Não autenticado → login/register
   └── Autenticado → (drawer)/index (Pokédex)
         │
         ├── Drawer: Pokédex, Perfil, Ginásios
         └── Stack: Detalhes do Pokémon, Lista de Pokémons
```

---

## 🧩 Principais Componentes e Serviços

- **AuthContext**: Gerencia autenticação, login, cadastro, logout e nome do treinador.
- **PokemonTeamContext**: Gerencia o time do usuário, sincroniza com Firestore, permite editar nível, golpes, etc.
- **CardPokemon, TypeBadge, StatBar, EvolutionStage**: UI moderna, responsiva e baseada em tema central.
- **pokemonService**: Busca e enriquece dados da PokéAPI, com cache no Firestore.
- **typeService**: Calcula fraquezas do time.
- **gymService**: Dados dos líderes de ginásio de Kanto.

---

## 🎨 Tema e Design System

- Cores, espaçamentos e tokens centralizados em `assets/style/theme.ts`.
- Integração com [react-native-unistyles](https://github.com/kristerkari/react-native-unistyles) para uso de tema em todos os componentes.
- Layouts e componentes inspirados em Figma para UI/UX moderna.

---

## 🚀 Como rodar o projeto

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o app:
   ```sh
   npx expo start
   ```
3. Siga as instruções do Expo para rodar no emulador ou dispositivo.

---

## 🔒 Segurança

- Nunca exponha suas chaves do Firebase em repositórios públicos.
- O app só permite acesso a rotas privadas para usuários autenticados.

---

## 📚 Mais informações

- [Documentação do Expo Router](https://docs.expo.dev/router/introduction/)
- [PokéAPI](https://pokeapi.co/)
- [Firebase](https://firebase.google.com/)

---

Feito com ❤️ por fãs de Pokémon!
