
export const reactBasePrompt = `
<CheifArtifact id="initial-react-template" title="Initial React Project Template">
  <CheifAction type="file" filePath="index.html">
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  </CheifAction>
  <CheifAction type="file" filePath="package.json">
    {
      "name": "my-react-app",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "lucide-react": "^0.344.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.66",
        "@types/react-dom": "^18.2.22",
        "@typescript-eslint/eslint-plugin": "^7.2.0",
        "@typescript-eslint/parser": "^7.2.0",
        "@vitejs/plugin-react": "^4.2.1",
        "eslint": "^8.57.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.6",
        "typescript": "^5.2.2",
        "vite": "^5.2.0",
        "tailwindcss": "^3.4.1",
        "postcss": "^8.4.31",
        "autoprefixer": "^10.4.17"
      }
    }
  </CheifAction>
  <CheifAction type="file" filePath="vite.config.ts">
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      optimizeDeps: {
        exclude: ['lucide-react'],
      },
    });
  </CheifAction>
  <CheifAction type="file" filePath="tailwind.config.js">
    /** @type {import('tailwindcss').Config} */
    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {},
      },
      plugins: [],
    };
  </CheifAction>
  <CheifAction type="file" filePath="postcss.config.js">
    export default {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
  </CheifAction>
  <CheifAction type="file" filePath="tsconfig.json">
    {
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src"],
      "references": [{ "path": "./tsconfig.node.json" }]
    }
  </CheifAction>
  <CheifAction type="file" filePath="tsconfig.node.json">
    {
      "compilerOptions": {
        "composite": true,
        "esModuleInterop": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "skipLibCheck": true,
        "strict": true,
        "types": ["node"]
      },
      "include": ["vite.config.ts", "postcss.config.js", "tailwind.config.js"]
    }
  </CheifAction>
  <CheifAction type="file" filePath="src/main.tsx">
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.tsx';
    import './index.css';

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  </CheifAction>
  <CheifAction type="file" filePath="src/index.css">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  </CheifAction>
  <CheifAction type="file" filePath="src/App.tsx">
    import React from 'react';
    // ... other imports
    function App() {
      return (
        <div>
          <p>This is the base App component.</p>
        </div>
      );
    }
    export default App;
  </CheifAction>
  <!-- Add all other base components here -->
  <CheifAction type="file" filePath="src/vite-env.d.ts">
    /// <reference types="vite/client" />
  </CheifAction>
</CheifArtifact>
`;