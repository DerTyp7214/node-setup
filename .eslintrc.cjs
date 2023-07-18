module.exports = {
    root: true,
    env: {
        browser: true,
        es2017: true,
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    plugins: [],
    overrides: [
        {
            files: ['*.cjs', '*.mjs', '*.js'],
            env: {
                node: true,
            },
        },
        {
            files: ['*.ts'],
            extends: ['plugin:@typescript-eslint/recommended'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ['./tsconfig.json'],
            },
            rules: {
                '@typescript-eslint/no-floating-promises': 'error',
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                        argsIgnorePattern: '^_',
                    },
                ],
                'prettier/prettier': [
                    'error',
                    {
                        endOfLine: 'auto',
                    },
                ],
            },
        },
    ],
    rules: {
        'prettier/prettier': 'warn',
    },
}
