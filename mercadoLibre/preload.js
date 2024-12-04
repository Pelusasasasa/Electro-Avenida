const os = require('os');

const { contextBridge } = require('electron');


contextBridge.exposeInMainWorld('electron', {
    homedir: () => os.homedir(),
});
