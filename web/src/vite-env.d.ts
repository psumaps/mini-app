/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_IJO42_TILES: string;
  readonly VITE_URL_IJO42_MAPI: string;
  readonly VITE_PSU_TOOLS_KEY: string;
  readonly VITE_URL_PSU_TOOLS_API: string;
  readonly VITE_URL_INDOOREQUAL_TILES: string;
  readonly VITE_URL_MAPTILER_STYLE: string;
  readonly VITE_MAPTILES_STYLE_KEY: string;
  readonly VITE_URL_BIND_ETIS: string;
  readonly VITE_URL_SUPPORT: string;
  readonly VITE_URL_TG_GROUP: string;
  readonly VITE_URL_VK_APP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
