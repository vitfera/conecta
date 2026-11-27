import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { isAbsolute, parse, sep } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const repository = realpathSync(fileURLToPath(new URL('..', import.meta.url)));
process.chdir(repository);
if (existsSync('.env')) loadEnvFile('.env');
process.env.ASTRO_TELEMETRY_DISABLED = '1';

const deployPath = process.env.DEPLOYPATH;
if (!process.env.SITE_URL?.trim() || !deployPath || !isAbsolute(deployPath)) {
  throw new Error('Configure SITE_URL e o caminho absoluto DEPLOYPATH no .env do clone.');
}

const destination = realpathSync(deployPath);
if (
  !lstatSync(destination).isDirectory() ||
  destination === parse(destination).root ||
  destination === realpathSync(homedir()) ||
  destination === repository ||
  repository.startsWith(destination + sep) ||
  destination.startsWith(repository + sep)
) {
  throw new Error('Use a raiz do domínio como destino e mantenha o clone em uma pasta separada.');
}

const marker = `${destination}/.conecta-static-site`;
const hostingEntries = ['.well-known', 'cgi-bin'];
function needsMarker() {
  const existing = lstatSync(marker, { throwIfNoEntry: false });
  if (existing?.isFile()) return false;
  if (readdirSync(destination).some((name) => !hostingEntries.includes(name))) {
    throw new Error(
      'O destino já contém arquivos. Confirme a pasta, faça backup e crie .conecta-static-site.',
    );
  }
  return true;
}

needsMarker();
execFileSync('rsync', ['--version'], { stdio: 'ignore' });
execFileSync('npm', ['ci', '--include=dev', '--engine-strict'], { stdio: 'inherit' });
execFileSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, ROLLDOWN_WORKER_THREADS: '1', TOKIO_WORKER_THREADS: '1' },
});
execFileSync('npm', ['run', 'verify'], { stdio: 'inherit' });

if (needsMarker()) writeFileSync(marker, '', { flag: 'wx' });
execFileSync(
  'rsync',
  [
    '--archive',
    '--delay-updates',
    '--delete-after',
    '--exclude=/.conecta-static-site',
    ...hostingEntries.map((name) => `--exclude=/${name}`),
    'dist/',
    destination + sep,
  ],
  { stdio: 'inherit' },
);
console.log(`Site publicado em ${process.env.SITE_URL.trim()}.`);
