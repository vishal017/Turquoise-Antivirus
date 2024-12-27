const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('path')
let win;
// const userDataPath = app.getPath('userData');
const basePath = app.getAppPath();
const Store = require('./store.js');

const store = new Store({
    configName:"user_preference",
    defaults:{
        initialLaunch: true
    },
    userPath: basePath + "/config/"
});

function createWindow() {
    // store.set('initialLaunch',true);
    let initialLaunch = store.get('initialLaunch');
    console.log(initialLaunch);
    if (initialLaunch){
        //show initial config window
        console.log("First time Launch: Compiling Signatures...");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ basePath: basePath })
        };
        var data = fetch('http://127.0.0.1:5000/compileYaraSigs');
        // var dataJ = data.json();
        console.log(data);
        store.set("initialLaunch", false);
    } else {
        console.log("NO, signatures already compiled at: userPath")
    }
    // let backend;
    // backend = path.join(process.cwd(), './engine.exe')
    // var execfile = require('child_process').execFile;
    // execfile(
    //     backend,
    //     {
    //         windowsHide: true,
    //     },
    //     (err, stdout, stderr) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         if (stdout) {
    //             console.log(stdout);
    //         }
    //         if (stderr) {
    //             console.log(stderr);
    //         }
    //     }
    // )
    win = new BrowserWindow({
        width: 800,
        height: 620,
        webPreferences: {
            nodeIntegration:true,
            contextIsolation: false
        }
    })
    win.removeMenu();
    win.webContents.openDevTools();
    win.loadFile('index.html');

    ipcMain.on('xylent-get-path',(event,data)=>{
        if (data ==="XYLENT_GET_APP_PATH"){
            event.reply('xylent-get-path', basePath);
        }
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    // const { exec } = require('child_process');
    // exec('taskkill / f / t / im engine.exe', (err, stdout, stderr) => {
    //     if (err) {
    //         console.log(err)
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.log(`stderr: ${stderr}`);
    // });
    if (process.platform !== 'darwin') {
        app.quit()
    }
})