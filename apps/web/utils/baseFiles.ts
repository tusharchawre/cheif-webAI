// frontend/utils/baseFiles.ts

/** @type {import('@webcontainer/api').FileSystemTree} */
export const BASE_WEB_CONTAINER_FILES = {
  "package.json": {
    file: {
      contents: `
  {
    "name": "webcontainer-app",
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
      "lucide-react": "^0.344.0",
      "clsx": "^2.1.0",
      "tailwind-merge": "^2.2.2",
      "framer-motion": "^11.0.20",
      "@tailwindcss/forms": "^0.5.7"
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
  `,
    },
  },
  "index.html": {
    file: {
      contents: `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>WebContainer App</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  `,
    },
  },
  "vite.config.ts": {
    file: {
      contents: `
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  
  export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  });
  `,
    },
  },
  "tailwind.config.js": {
    file: {
      contents: `
  /** @type {import('tailwindcss').Config} */
  import forms from '@tailwindcss/forms';
  
  export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [forms],
  };
  `,
    },
  },
  "postcss.config.js": {
    file: {
      contents: `
  export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
  `,
    },
  },
  "tsconfig.json": {
    file: {
      contents: `
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
  `,
    },
  },
  "tsconfig.node.json": {
    file: {
      contents: `
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
  `,
    },
  },
  src: {
    directory: {
      "main.tsx": {
        file: {
          contents: `
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App.tsx';
  import './index.css';
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  `,
        },
      },
      "index.css": {
        file: {
          contents: `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  /* Default base styles */
  body {
      @apply bg-slate-50 dark:bg-slate-900;
  }
  `,
        },
      },
      "App.tsx": {
        file: {
          contents: `
  import React from 'react';
  // Components will be dynamically added or modified by AI.
  // This is just a minimal starting point.
  
  function App() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">WebContainer App Initialized!</h1>
        <p className="mt-4 text-lg">Waiting for AI to generate content...</p>
      </div>
    );
  }
  export default App;
  `,
        },
      },
      "vite-env.d.ts": {
        file: {
          contents: `/// <reference types="vite/client" />`,
        },
      },
      lib: {
        directory: {
          "utils.ts": {
            file: {
              contents: `
  import { type ClassValue, clsx } from "clsx"
  import { twMerge } from "tailwind-merge"
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  `,
            },
          },
        },
      },
      types: {
        directory: {
          "index.ts": {
            file: {
              contents: `
  // Export any global types if your base template needs them.
  // export type GlobalType = string;
  `,
            },
          },
        },
      },
      components: {
        directory: {
          // AI will populate this directory with components.
        },
      },
    },
  },
};
