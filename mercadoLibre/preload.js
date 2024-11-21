const { contextBridge } = require('electron');

const os = require('os');

contextBridge.exposeInMainWorld('electron', {
    homedir: () => os.homedir(),
})