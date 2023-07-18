export interface NodeSetupConfig {
    packageManager: string;
    envVars: string[];
}
export interface PackageJson {
    name: string;
    version: string;
    description: string;
    main: string;
    types: 'commonjs' | 'module';
    author: string;
    license: string;
    typings?: string;
    scripts: {
        [key: string]: string;
    };
    keywords: string[];
    devDependencies: {
        [key: string]: string;
    };
    dependencies: {
        [key: string]: string;
    };
    'node-setup': NodeSetupConfig;
    [key: string]: any;
}
