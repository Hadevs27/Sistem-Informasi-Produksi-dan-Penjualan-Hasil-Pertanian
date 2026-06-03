import { config } from "dotenv";

let envLoaded = false;

export function loadServerEnv() {
  if (envLoaded) return;

  config({ path: ".env.local", override: false, quiet: true });
  config({ path: ".env", override: false, quiet: true });
  envLoaded = true;
}

export function getRequiredEnv(name: string) {
  loadServerEnv();
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} belum dikonfigurasi. Pastikan tersedia di .env, .env.local, atau environment deployment.`);
  }

  return value;
}
