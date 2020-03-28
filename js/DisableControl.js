/*-- 厳格モード --*/
"use strict";

/*-- 画像検索画面用コントロール制御 --*/
function disableControl_searchimages(disable_flag) {

	let bl = document.getElementById("back-loader");
	
	if (disable_flag) {
		/* true:操作不可 */
		bl.style.visibility  = "visible";
	} else {
		/* false:操作可 */
		bl.style.visibility  = "hidden";
	}
}

/*-- モデルインポート画面用コントロール制御 --*/
function disableControl_modelimport(disable_flag) {
	let upload_file_path = document.getElementById("upload_file_path");
	let btn_upload = document.getElementById("btn_upload");
	if (disable_flag) {
		/* true:操作不可 */
		upload_file_path.setAttribute("disabled", "disabled");
		btn_upload.setAttribute("disabled", "disabled");
	}
	else {
		/* false:操作可 */
		upload_file_path.removeAttribute("disabled", "disabled");
		btn_upload.removeAttribute("disabled", "disabled");
	}
}

/*-- モデルインポート画面用コントロール制御 --*/
function disableControl_modelcreate(disable_flag) {
	let btn_request = document.getElementById("btn_request");
	let btn_reference = document.getElementById("btn_reference");
	if (disable_flag) {
		/* true:操作不可 */
		btn_request.setAttribute("disabled", "disabled");
		btn_reference.setAttribute("disabled", "disabled");
	}
	else {
		/* false:操作可 */
		btn_request.removeAttribute("disabled", "disabled");
		btn_reference.removeAttribute("disabled", "disabled");
	}
}