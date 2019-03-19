export const stupath = 'http://localhost:8899/';
export const stuwspath = 'ws://localhost:8899/';
export const teacherpath = 'http://localhost:8080/';
export const teacherwspath = 'ws://localhost:8080/'; 
/* export const stupath = 'http://192.168.10.119:8899/';
export const stuwspath = 'ws://192.168.10.119:8899/';
export const teacherpath = 'http://192.168.10.119:8080/';
export const teacherwspath = 'ws://192.168.10.119:8080/'; */ 
export const webpath = "http://192.168.10.184";
export const alltxtlist = {
	"word": ["hello", "Hi", "why", "happy", "what", "water", "white", "apple", "banana", "thanks"],
	"english": ["what's your name", "how old are you", "where are you from", "I'm find", "Thank you", "how do you do",
		"what are you doing", "I love you", "happy birthday", "good morning"
	],
	"chinese": ["你好", "再见", "床前明月光", "朝辞白帝彩云间", "你叫什么名字", "你多大了", "谢谢", "生日快乐", "早上好", "你在做什么"]
};
export const htmlescpe = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
export const allenglish = new RegExp("^[a-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]|\s+$");
export const allchinese = new RegExp("^[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5]|\s+$");
export default {
	stupath,
	stuwspath,
	htmlescpe,
	alltxtlist,
	allenglish,
	allchinese,
	webpath
}
