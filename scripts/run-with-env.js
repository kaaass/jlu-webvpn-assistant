const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node scripts/run-with-env.js <env-file> <command> [args...]');
  process.exit(1);
}

const envFile = args[0];
const command = args[1];
const commandArgs = args.slice(2);

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  fileContent.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    const equalIndex = trimmedLine.indexOf('=');
    if (equalIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, equalIndex).trim().replace(/^export\s+/, '');
    let value = trimmedLine.slice(equalIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
};

const envPath = path.resolve(process.cwd(), envFile);
loadEnvFile(envPath);

const result = spawnSync(command, commandArgs, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status || 0);