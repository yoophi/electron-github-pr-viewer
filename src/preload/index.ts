import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getSettings: (command) => ipcRenderer.invoke('get-settings', command),
  writeSettings: (command) => ipcRenderer.invoke('write-settings', command),
  getRepositories: (command) => ipcRenderer.invoke('get-repositories', command),
  getPullRequests: (command) => {
    return ipcRenderer.invoke('get-pull-requests', command)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
