import { NodeSetupConfig, PackageJson } from './types';
declare const defaultConfig: NodeSetupConfig;
declare function setupEnv(): Promise<void>;
export { NodeSetupConfig, PackageJson, defaultConfig, setupEnv };
