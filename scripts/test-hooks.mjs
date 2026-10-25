import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const scratch = mkdtempSync(join(tmpdir(), 'ruby-hooks-'));
// Git injects repository-local variables into hooks. The fixture must use its own repository.
const env = { ...process.env, HUSKY: '1', HUSKY_SKIP_INIT: '1' };
for (const key of Object.keys(env)) {
  if (key.startsWith('GIT_')) delete env[key];
}
const run = (command, args, expected = 0) => {
  const result = spawnSync(command, args, {
    cwd: scratch,
    env,
    encoding: 'utf8',
    timeout: 60000,
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  if (result.error) throw result.error;
  if (expected === 0) assert.equal(result.status, 0, output);
  else
    assert.notEqual(
      result.status,
      0,
      `Expected rejection, got success: ${output}`,
    );
  return output;
};
const git = (...args) => run('git', args);
const write = (name, content) => writeFileSync(join(scratch, name), content);

try {
  for (const name of [
    'package.json',
    'eslint.config.mjs',
    'prettier.config.mjs',
    'lint-staged.config.mjs',
    'commitlint.config.mjs',
  ]) {
    cpSync(join(root, name), join(scratch, name));
  }
  cpSync(join(root, '.husky'), join(scratch, '.husky'), {
    recursive: true,
    filter: (path) => !path.includes(`${join('.husky', '_')}`),
  });
  mkdirSync(join(scratch, 'apps/web'), { recursive: true });
  write('apps/web/package.json', '{"name":"hook-fixture","private":true}');
  symlinkSync(join(root, 'node_modules'), join(scratch, 'node_modules'), 'dir');
  write('.gitignore', 'node_modules/\n');
  git('init', '-b', 'main');
  git('config', 'user.name', 'Hook Test');
  git('config', 'user.email', 'hook-test@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  run('pnpm', ['exec', 'husky']);

  write('first file.ts', 'export const first = "hello"\n');
  git('add', 'first file.ts');
  git('commit', '-m', 'feat(test): validate initial commit');
  assert.equal(
    git('show', 'HEAD:first file.ts').trim(),
    "export const first = 'hello';",
  );
  console.log(
    'PASS initial commit, auto-format and filename containing spaces',
  );

  write('invalid.ts', 'export const invalid: any = 1;\n');
  git('add', 'invalid.ts');
  const lintFailure = run(
    'git',
    ['commit', '-m', 'feat(test): reject invalid code'],
    1,
  );
  assert.match(lintFailure, /no-explicit-any/);
  git('restore', '--staged', 'invalid.ts');
  rmSync(join(scratch, 'invalid.ts'));
  console.log('PASS lint failure blocks commit');

  write('message.ts', 'export const message = 1;\n');
  git('add', 'message.ts');
  const messageFailure = run('git', ['commit', '-m', 'bad message'], 1);
  assert.match(messageFailure, /type-empty|subject-empty/);
  git('commit', '-m', 'test: accept conventional message');
  console.log('PASS invalid message rejected; valid message accepted');

  write('first file.ts', 'export const first = "changed"\n');
  git('add', 'first file.ts');
  write(
    'first file.ts',
    'export const first = "changed"\nexport const localOnly = 2;\n',
  );
  git('commit', '-m', 'test: preserve partially staged changes');
  assert.equal(
    git('show', 'HEAD:first file.ts').trim(),
    "export const first = 'changed';",
  );
  assert.match(
    readFileSync(join(scratch, 'first file.ts'), 'utf8'),
    /localOnly/,
  );
  assert.match(git('diff', '--', 'first file.ts'), /localOnly/);
  console.log('PASS unstaged edit preserved and excluded from commit');

  git('rm', 'message.ts');
  git('commit', '-m', 'test: handle deleted files');
  assert.doesNotMatch(git('ls-files'), /message.ts/);
  console.log('PASS deleted file accepted');
} finally {
  // Only remove the uniquely created fixture; never touch the user's repository.
  rmSync(scratch, { recursive: true, force: true });
}
