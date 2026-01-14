import routes from './router';
import { useUserSettingsStore } from './stores/userSettings';

export { routes, useUserSettingsStore };
export type { UserSetting } from './stores/userSettings';

export default {
    install: (app: any) => {
        // Package installation logic if needed
        console.log('moii-user-settings package installed');
    }
};
