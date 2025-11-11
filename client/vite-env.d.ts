/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_INFURA_API_KEY?: string
  // add any other VITE_ variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
