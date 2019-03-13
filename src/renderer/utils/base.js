export const stupath = 'http://localhost:8899/';
export const stuwspath='ws://localhost:8899/';
export const teacherpath = 'http://localhost:8080/';
export const teacherwspath='ws://localhost:8080/';
 export const alltxtlist={
	"word":["hello","Hi","why","happy","what","water","white","apple","banana","thanks"],
	"english":["what's your name","how old are you","where are you from","I'm find","Thank you","how do you do","what are you doing","I love you","happy birthday","good morning"],
	"chinese":["你好","再见","床前明月光","朝辞白帝彩云间","你叫什么名字","你多大了","谢谢","生日快乐","早上好","你在做什么"]
};
export const htmlescpe = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
export default {
	stupath,
	stuwspath,
	htmlescpe,
	alltxtlist
}