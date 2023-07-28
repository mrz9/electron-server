
module.exports = function startServer({ mainWindow }) {
    const express = require('express')
    const { app, BrowserView, BrowserWindow } = require('electron')

    const server = express()

    const hostname = '127.0.0.1';
    const port = 8899;

    let modalWindow;

    server.use(express.json()) // for parsing application/json
    server.use(express.urlencoded({ extended: true }))

    server.get('/', (req, res) => {
        res.send('GET request to the homepage')
    })

    server.post('/url', (req, res) => {
        console.log(req.body)
        if(req.body.url) {
            // const view = new BrowserView()
            // mainWindow.setBrowserView(view)
            // view.setBounds({ x: 0, y: 100, width: 1200, height: 700 })
            // // view.webContents.loadURL('https://electronjs.org')
            // view.webContents.loadURL(req.body.url)
            if(!modalWindow) {
                modalWindow = new BrowserWindow({ parent: mainWindow,x:0, y:0, modal: true, simpleFullscreen: true, fullscreen: true, show: false,})
            }

            modalWindow.loadURL(req.body.url)
            modalWindow.once('ready-to-show', () => {
                // modalWindow.setSimpleFullScreen(true)
                modalWindow.show();
            })
            
        }
        res.json(req.body)
    })

    server.get('/close', (req, res) => {
       if(modalWindow) {
        // modalWindow.setSimpleFullScreen(false)
        modalWindow.destroy();
       }
       res.send('ok')
    })

    server.get('/info', (req, res) => {
        res.json({
            mainWindow: {
                isSimpleFullScreen: mainWindow.isSimpleFullScreen(),
                isFullScreen: mainWindow.isFullScreen()
            },
            modalWindow: {
                isSimpleFullScreen: mainWindow?.isSimpleFullScreen(),
                isFullScreen: modalWindow?.isFullScreen()
            }

        })
    })

    server.listen(port, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    })

}