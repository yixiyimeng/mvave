import {
	app,
	Menu,
	Tray,
	BrowserWindow,
	dialog,
	ipcMain,
	globalShortcut,
	screen
} from 'electron';
import {
	autoUpdater
} from 'electron-updater';
import path from 'path';
import fs from 'fs';
import electron from 'electron';


let tray = null;

if (process.env.NODE_ENV !== 'development') {
	global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
var win = null;
//const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/mainPage'
  : `file://${__dirname}/mainPage/index.html`;
const subwinURL =process.env.NODE_ENV === 'development' ? 'http://localhost:9080/newPage' : `file://${__dirname}/newPage/index.html`;
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
		},
		id: 'mainWindow'
		// 		maximizable: false,
		// 		minimizable: false 
	});
	mainWindow.loadURL(winURL);
	/* 打开悬浮窗口 */
	createSuspensionWindow();
	mainWindow.on('closed', () => {
		mainWindow = null
	});
	mainWindow.on('close', (e) => {
		e.preventDefault();
		//mainWindow.hide();
		mainWindow.webContents.send('isexitApp')
	});
	mainWindow.setFullScreen(true); //设置全屏
	// mainWindow.setAlwaysOnTop(true);
	/* 窗口退出最小化的时候，通知页面，暂停弹幕 */
	mainWindow.on('minimize', (e) => {
		mainWindow.webContents.send('isminimizeApp', true);
		win.webContents.send('isminimizeAppsub', true);

	});
	/* 在窗口从最小化恢复的时候触发,通知页面，恢复弹幕 */
	mainWindow.on('restore', (e) => {
		mainWindow.setFullScreen(true);
		mainWindow.webContents.send('isminimizeApp', false);
		win.webContents.send('isminimizeAppsub', false);

	});
	/* 退出全屏 */
	globalShortcut.register('CTRL+T', () => {
		//mainWindow.setFullScreen(false);
		mainWindow.webContents.openDevTools({
			mode: 'bottom'
		})
	})
	globalShortcut.register('SHIFT+Q', () => {
		//mainWindow.setFullScreen(false);
		//mainWindow.webContents.openDevTools({mode:'bottom'})
		mainWindow.minimize()
	})
	globalShortcut.register('SHIFT+M', () => {
		mainWindow.show();
		mainWindow.setFullScreen(true);
		//mainWindow.webContents.openDevTools({mode:'bottom'})
	})
	//require('./window');
	//require('./newPage');
}

function createSuspensionWindow() {
	win = new BrowserWindow({
		width: 110, //悬浮窗口的宽度 比实际DIV的宽度要多2px 因为有1px的边框
		height: 250, //悬浮窗口的高度 比实际DIV的高度要多2px 因为有1px的边框
		type: 'toolbar', //创建的窗口类型为工具栏窗口
		frame: false, //要创建无边框窗口
		resizable: false, //禁止窗口大小缩放
		show: false, //先不让窗口显示
		webPreferences: {
			devTools: false //关闭调试工具
		},
		transparent: true, //设置透明
		alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
	});
	const size = screen.getPrimaryDisplay().workAreaSize; //获取显示器的宽高
	const winSize = win.getSize(); //获取窗口宽高

	//设置窗口的位置 注意x轴要桌面的宽度 - 窗口的宽度
	win.setPosition(size.width - winSize[0], 40);
	win.loadURL(subwinURL);

	win.once('ready-to-show', () => {
		win.show()
	});

	win.on('close', () => {
		win = null;
	})
}
/**
 * Create Tray
 */
function createTray() {
	let iconPath = path.join(__static, 'icons/icon7.png');
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
	tray.setToolTip("老师端答题器");
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
	mainWindow.show();
	mainWindow.setFullScreen(true);
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

	ipcMain.on("exitApp", () => {
		if (process.platform !== 'darwin') {
			//app.quit()
			app.exit();
		}
	});
	ipcMain.on('minApp', e => mainWindow.minimize());
	ipcMain.on('maxApp', e => mainWindow.show());
	/* 是否退出软件 */
	ipcMain.on('isexitApp', e => {
		mainWindow.webContents.send('isexitApp');
		mainWindow.show();
		mainWindow.setFullScreen(true);
	});
	/* 是否退出直播间 */
	ipcMain.on('isexitdirebro', e => {
		mainWindow.webContents.send('exitdirebro');
	});
	/* 直播间状态 */
	ipcMain.on('onlinedirebro', (e,value) => {
		win.webContents.send('onlinedirebro',value);
	});
	ipcMain.on('showSuspensionWindow', () => {
		if (win) {
			if (win.isVisible()) {
				createSuspensionWindow();
			} else {
				win.showInactive(); //显示但不聚焦于窗口
			}
		} else {
			createSuspensionWindow();
		}

	});

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
