export * as Plugins from "./plugins";
export * as Webpack from "./webpack";
export * as Api from "./api";
export * as Updater from "./utils/updater";
export * as QuickCss from "./utils/quickCss";
export * as Util from "./utils";

import { popNotice, showNotice } from "./api/Notices";
import { Settings, PlainSettings } from "./api/settings";
import { startAllPlugins } from "./plugins";

export { Settings, PlainSettings };

import "./webpack/patchWebpack";
import "./utils/quickCss";
import { checkForUpdates, UpdateLogger } from "./utils/updater";
import { onceReady } from "./webpack";
import { Router } from "./webpack/common";

export let Components: any;

async function init() {
    await onceReady;
    startAllPlugins();
    Components = await import("./components");

    if (!IS_WEB) {
        try {
            const isOutdated = await checkForUpdates();
            if (isOutdated && Settings.notifyAboutUpdates)
                setTimeout(() => {
                    showNotice(
                        "A Vencord update is available!",
                        "View Update",
                        () => {
                            popNotice();
                            Router.open("VencordUpdater");
                        }
                    );
                }, 10000);
        } catch (err) {
            UpdateLogger.error("Failed to check for updates", err);
        }
    }
}

init();
