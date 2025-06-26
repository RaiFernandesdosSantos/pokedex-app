# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

---

## 📁 Estrutura de Pastas

```
├── app/
│   ├── _layout.tsx         # Layout raiz, proteção de rotas e providers
│   ├── login.tsx           # Tela de login
│   ├── register.tsx        # Tela de cadastro
│   ├── (drawer)/           # Grupo de rotas privadas (Drawer)
│   │   ├── _layout.tsx     # Layout do Drawer
│   │   ├── index.tsx       # Home (Pokédex)
│   │   ├── perfil.tsx      # Tela de perfil e time do usuário
│   │   ├── Ginasios.tsx    # Tela de líderes de ginásio
│   │   └── ...
│   └── Home/
│       ├── _layout.tsx     # Stack para detalhes
│       ├── [pokemonId].tsx # Detalhes do Pokémon
│       └── index.tsx       # Lista de Pokémons
├── assets/
│   ├── components/         # Componentes reutilizáveis (ex: CardPokemon)
│   └── style/              # Estilos separados por tela/componente
├── context/
│   ├── AuthContext.tsx     # Contexto de autenticação
│   └── PokemonTeamContext.tsx # Contexto do time do usuário (Firestore)
├── services/               # Serviços de API (Pokémon, tipos, ginásios)
├── config/
│   └── firebaseConfig.ts   # Configuração do Firebase
├── package.json
├── tsconfig.json
└── ...
```

---

## 🔄 Fluxo do App (Diagrama Simplificado)

```
Usuário abre o app
   │
   ▼
[Proteção de Rotas em _layout.tsx]
   │
   ├── Não autenticado? ──► [login.tsx] ou [register.tsx]
   │
   └── Autenticado? ──────► [(drawer)/index.tsx] (Pokédex)
                                 │
                                 ├── [perfil.tsx] (Perfil e Time)
                                 ├── [Ginasios.tsx] (Líderes)
                                 └── [Home/[pokemonId].tsx] (Detalhes)
```

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
