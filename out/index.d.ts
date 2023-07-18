import { NodeSetupConfig, PackageJson } from './types';
declare const defaultConfig: NodeSetupConfig;
declare function install(): Promise<void>;
declare function setupEnv(): Promise<void>;
export { NodeSetupConfig, PackageJson, defaultConfig, install, setupEnv };
