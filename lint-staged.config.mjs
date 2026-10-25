const config = {
  '*.{js,mjs,cjs,jsx,ts,tsx}': [
    'eslint --fix --max-warnings=0',
    'prettier --write',
  ],
  '*.{json,jsonc,yml,yaml,md,css}': 'prettier --write',
};

export default config;
