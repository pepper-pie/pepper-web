import config, { TConfig } from "./config";
import axiosUtils from "./utils/axios-utils";


const VALIDATE_CONFIG_PROPERTIES: (keyof TConfig)[] = ['BASE_URL', 'API_URL'];

const validateConfig = () => {
    VALIDATE_CONFIG_PROPERTIES.forEach(key => {
        const val = config.get(key);
        if (!val)
            throw new Error(`App config must define ${key}`);
    });

}

const Boot = () => {
    return new Promise<void>((resolve, reject) => {
        validateConfig();
        /** Override console.log as per environment file */
        if (config.get('CONSOLE_LOGGING') === false) {
            console.log = () => { }
        }
        axiosUtils.setBaseAPI_URL(config.get('API_URL'));
        // const res = AppModel.fetchAppConstants();
        // Promise.all([res]).then(() => {
        //     resolve();
        // })
        resolve();
    })
};

export default Boot;