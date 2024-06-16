/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PSU_TOOLS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
