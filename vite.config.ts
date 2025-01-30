import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVitePlugin } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite'; // التعديل الرئيسي
import UnoCSS from 'unocss/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'no-git-info';
  }
};

export default defineConfig((config) => {
  return {
    define: {
      __COMMIT_HASH: JSON.stringify(getGitHash()),
      __APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      target: 'esnext',
    },
    plugins: [
      nodePolyfills({
        include: ['path', 'buffer', 'process'],
      }),
      // احتفظ بـ Cloudflare Dev Proxy للوضع المحلي فقط
      config.mode !== 'test' && remixCloudflareDevProxy(),
      remixVitePlugin({
        presets: [vercelPreset()], // التعديل الرئيسي هنا
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true
        },
      }),
      UnoCSS(),
      tsconfigPaths(),
      chrome129IssuePlugin(),
    ],
    envPrefix: ["VITE_","OPENAI_LIKE_API_BASE_URL", "OLLAMA_API_BASE_URL", "LMSTUDIO_API_BASE_URL","TOGETHER_API_BASE_URL"],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  };
});

// باقي الكود بدون تغيير
