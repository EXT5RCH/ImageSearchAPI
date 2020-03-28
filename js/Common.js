/*-- 厳格モード --*/
"use strict";

/*-- 共通メッセージ --*/
const CommonErrorDictionary = {
	"error":"異常エラーが発生しました。",
	"abort":"処理が中断されました。",
	"timeout":"タイムアウトしました。"
}

/*-- テキストボックス上エンターキー押下処理 --*/
function EnterTextBox(callback) {
	if(window.event.keyCode==13) {
		callback();
	}
}
   
