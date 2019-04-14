import {
	app,
	Menu,
	Tray,
	BrowserWindow,
	dialog,
	ipcMain,
	globalShortcut
} from 'electron';
import {
	autoUpdater
} from 'electron-updater';
import path from 'path';
import fs from 'fs';
import electron from 'electron';
import jsmediatags from 'jsmediatags';
import async from 'async';

import musicServer from './musicServer';
import store from './store';
import IPC from '../IPC.js';

let tray = null;

if (process.env.NODE_ENV !== 'development') {
	global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development' ?
	`http://localhost:9080` :
	`file://${__dirname}/index.html`;

/**
 * Create main window
 */
function createWindow() {
	mainWindow = new BrowserWindow({
		height: 1080,
		useContentSize: true,
		width: 1920,
		titleBarStyle: 'hidden-inset',
		frame: false,
		transparent: true,
		fullscreenable: true,
		fullscreen: true,
		simpleFullscreen: true,
		resizable: false,
		hasShadow: false,
		webPreferences: {
			webSecurity: false
		}
		// 		maximizable: false,
		// 		minimizable: false 
	});
	mainWindow.loadURL(winURL);
	mainWindow.on('closed', () => {
		mainWindow = null
	});
	mainWindow.on('close', (e) => {
		e.preventDefault();
		//mainWindow.hide();
		mainWindow.webContents.send('isexitApp')
	});
	mainWindow.setFullScreen(true); //设置全屏
	mainWindow.setAlwaysOnTop(true);
	/* 窗口退出最小化的时候，通知页面，暂停弹幕 */
	mainWindow.on('minimize', (e) => {
		mainWindow.webContents.send('isminimizeApp',true);
	});
	/* 在窗口从最小化恢复的时候触发,通知页面，恢复弹幕 */
	mainWindow.on('restore', (e) => {
		mainWindow.webContents.send('isminimizeApp',false);
	});
	/* 退出全屏 */
	globalShortcut.register('CTRL+T', () => {
		//mainWindow.setFullScreen(false);
		mainWindow.webContents.openDevTools({
			mode: 'bottom'
		})
	})
	globalShortcut.register('CTRL+Q', () => {
		//mainWindow.setFullScreen(false);
		//mainWindow.webContents.openDevTools({mode:'bottom'})
		mainWindow.minimize()
	})
	globalShortcut.register('CTRL+M', () => {
		mainWindow.show();
		mainWindow.setFullScreen(true);
		//mainWindow.webContents.openDevTools({mode:'bottom'})
	})

}

/**
 * Create Tray
 */
function createTray() {
	let iconPath = path.join(__static, 'icons/icon2.png');
	tray = new Tray(iconPath);
	const contextMenu = Menu.buildFromTemplate([{
			label: '打开',
			type: 'normal',
			click: onOpenAppClick
		},
		{
			label: '退出',
			type: 'normal',
			// role: 'quit'
			click: onExitAppClick
		}
	]);
	contextMenu.items[1].checked = false;
	tray.setContextMenu(contextMenu);
	tray.setToolTip("答题器");
	tray.on('double-click', () => {
		// mainWindow.isVisible() ? mainWindow.hide() : {mainWindow.show();mainWindow.setFullScreen(true);}
		mainWindow.show();
		mainWindow.setFullScreen(true);
	})
}

/**
 * when choose folder btn click
 */
function onOpenAppClick() {
	// 	const musicPaths = dialog.showOpenDialog({
	// 		properties: ['openDirectory']
	// 	});
	// 	if (musicPaths != null && musicPaths != 'undefined') {
	// 		sendMusicList(musicPaths);
	// 	}
	mainWindow.show();
	mainWindow.setFullScreen(true);
}

function onExitAppClick() {
	mainWindow.webContents.send('isexitApp')
}
/**
 * Get music tags such as title adn artist
 * @param fullPath file path
 * @returns {Promise}
 */
function getTags(fullPath) {
	return new Promise((resolve, reject) => {
		new jsmediatags.Reader(fullPath).setTagsToRead(["title", "artist"]).read({
			onSuccess: ({
				tags
			}) => {
				resolve(tags);
			}
		});
	})
}

/**
 * Send music list
 * @param musicPaths music path
 */
function sendMusicList(musicPaths) {
	if (mainWindow) {
		store.set("MUSIC_PATHS", musicPaths);
		musicPaths.forEach((filePath) => {
			if (fs.existsSync(filePath)) {
				let fileNames = fs.readdirSync(filePath);
				fileNames = fileNames.filter((fileName) => { // we just need .mp3 files
					let fullPath = path.join(filePath, fileName);
					try {
						let stats = fs.statSync(fullPath);
						return stats.isFile() && path.extname(fullPath) == '.mp3';
					} catch (e) {}
				});

				if (fileNames.length <= 0) {
					mainWindow.webContents.send(IPC.SET_MUSIC_LIST, []);
				} else {
					async.map(fileNames, (fileName, callback) => {
						let fullPath = path.join(filePath, fileName);
						new jsmediatags.Reader(fullPath).setTagsToRead(["title", "artist"]).read({
							onSuccess: ({
								tags
							}) => {
								callback(null, {
									fileName,
									artist: tags.artist,
									title: tags.title
								});
							}
						});
					}, (err, results) => {
						mainWindow.webContents.send(IPC.SET_MUSIC_LIST, results);
					});
				}
			} else {
				mainWindow.webContents.send(IPC.SET_MUSIC_LIST, []);
			}
		});
	}
}

/**
 * On ready
 * ----------------------
 * 1. create tray
 * 2. create window
 * 3. listen ,if vue is ready ,get the music path and set the music list
 */
app.on('ready', () => {
	createTray();
	// new musicServer().start();
	createWindow();
	ipcMain.on(IPC.RENDER_READY, (event, arg) => {
		/* if (store.get("MUSIC_PATHS") == undefined || store.get("MUSIC_PATHS").length <= 0) {
		     const dataPath = (electron.app || electron.remote.app).getPath('userData');
		     sendMusicList([dataPath]);
		 } else {
		     sendMusicList(store.get("MUSIC_PATHS"))
		 } */
	});
	ipcMain.on("exitApp", () => {
		if (process.platform !== 'darwin') {
			//app.quit()
			app.exit();
		}
	});
	ipcMain.on('minApp', e => mainWindow.minimize());

});

/**
 * On close
 */
app.on('window-all-closed', () => {
	// 	if (process.platform !== 'darwin') {
	// 		app.quit()
	// 	}
});

/**
 * On active
 */
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
});


// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
! function updateHandle() {
	let message = {
		error: '检查更新出错',
		checking: '正在检查更新……',
		updateAva: '检测到新版本，正在下载……',
		updateNotAva: '现在使用的就是最新版本，不用更新',
	};
	const uploadUrl = "http://192.168.10.184/teacher-platform/files/"; // 下载地址，不加后面的**.exe
	autoUpdater.setFeedURL(uploadUrl);
	autoUpdater.on('error', function(error) {
		sendUpdateMessage(message.error)
	});
	autoUpdater.on('checking-for-update', function() {
		sendUpdateMessage(message.checking)
	});
	autoUpdater.on('update-available', function(info) {
		sendUpdateMessage(message.updateAva)
	});
	autoUpdater.on('update-not-available', function(info) {
		sendUpdateMessage(message.updateNotAva)
	});

	// 更新下载进度事件
	autoUpdater.on('download-progress', function(progressObj) {
		mainWindow.webContents.send('downloadProgress', progressObj)
	})
	autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

		ipcMain.on('isUpdateNow', (e, arg) => {
			console.log(arguments);
			console.log("开始更新");
			//some code here to handle event
			autoUpdater.quitAndInstall();
		});

		mainWindow.webContents.send('isUpdateNow')
	});

	ipcMain.on("checkForUpdate", () => {
		//执行自动更新检查
		autoUpdater.checkForUpdates();
	})
}()

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
	mainWindow.webContents.send('message', text)
}
