import DEFAULT_CONFIG from './config.json';

export type TConfig = Record<keyof typeof DEFAULT_CONFIG, any>;

let envConfig: TConfig = {} as TConfig;
let defaultConfig: Record<keyof typeof DEFAULT_CONFIG, any> = DEFAULT_CONFIG;

if (process.env.REACT_APP_NODE_ENV) {
    const env = process.env.REACT_APP_NODE_ENV.trim();
    envConfig = require(`./config.${env}.json`);
}

const config = {
    get: <T = any>(key: keyof typeof DEFAULT_CONFIG): T => {
        return envConfig[key] || defaultConfig[key];
    }
}


export default config;