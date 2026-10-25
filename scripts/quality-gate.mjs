import { pathToFileURL } from 'node:url';

export function qualityGatePassed(results) {
  return results.length > 0 && results.every((result) => result === 'success');
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (!qualityGatePassed(process.argv.slice(2))) {
    console.error('Required jobs must all finish successfully.');
    process.exitCode = 1;
  }
}
