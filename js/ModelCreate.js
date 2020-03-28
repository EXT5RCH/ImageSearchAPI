/*-- 厳格モード --*/
"use strict";

/*-- モデル作成依頼エラーメッセージ一覧 --*/
const ModelCreateRequestErrorDictionary = {
	"apikey is null":"APIキー未指定",
	"apikey not found":"APIキーが見つからない",
	"deleted account":"退会済み",
	"temporary account":"アカウントがまだ未承認です。",
	"server not found":"サーバが見つかりません。",
	"server parameter error":"サーバ側の設定でエラーが発生しました。",
	"access deny":"アクセスが拒否されました。",
	"order is full":"順番待ちがいっぱいです。",
	"order already exists":"既に順番待ちです。",
	"training is in progress":"学習中です。",
	"not found":"エンドポイントが不正です。",
	"method not allowed":"リクエストメソッドが不正です。",
	"internal server error":"サーバ処理中に想定外のエラーが発生しました。"
}

/*-- モデル作成状況参照エラーメッセージ一覧 --*/
const CreateStatusReferenceErrorDictionary = {
	1000:"APIキー未指定",
	1001:"APIキーが見つかりません。",
	1002:"退会済みです。",
	1003:"アカウントがまだ未承認です。",
	1010:"サーバが見つかりません。",
	1011:"サーバ側の設定でエラーが発生しました。",
	1030:"アクセスが拒否されました。",
	1404:"エンドポイントが不正です。",
	1405:"リクエストメソッドが不正です。",
	1500:"サーバ処理中に想定外のエラーが発生しました。"
}

/*-- API URL --*/
const URL_OrderModel = "https://api.a3rt.recruit-tech.co.jp/image_search/v1/order_model";
const URL_StatusModel = "https://api.a3rt.recruit-tech.co.jp/image_search/v1/status_model";

/*-- モデル作成依頼 --*/
function ModelCreateRequest() {

	let web_body = document.getElementById("web-page-body");

	/* コントロール操作不可 */
	disableControl_modelcreate(true)

	let xhr = new XMLHttpRequest();
	xhr.open("GET", URL_OrderModel + "?apikey=" + apikey);
	xhr.send();

	xhr.onload = function() {
		let json = JSON.parse(xhr.responseText);
		if (json.status == 0) {
			web_body.innerText = "モデルの作成依頼を受け付けました。";
			/* コントロール操作可 */
			disableControl_modelcreate(false);
		} else {
			web_body.innerText = ModelCreateRequestErrorDictionary[json.message];
			/* コントロール操作可 */
			disableControl_modelcreate(false);
		}
	}
	xhr.onerror = function() {
		web_body.innerText = CommonErrorDictionary["error"];
		/* コントロール操作可 */
		disableControl_modelcreate(false);
	}
	xhr.onabort = function() {
		web_body.innerText = CommonErrorDictionary["abort"];
		/* コントロール操作可 */
		disableControl_modelcreate(false);
	}
	xhr.ontimeout = function() {
		web_body.innerText = CommonErrorDictionary["timeout"];
		/* コントロール操作可 */
		disableControl_modelcreate(false);
	}
}

/*-- モデル作成状況参照 --*/
function CreateStatusReference() {

	let web_body = document.getElementById("web-page-body");

	/* コントロール操作不可 */
	disableControl_modelcreate(true);

	let xhr = new XMLHttpRequest();
	xhr.open("GET", URL_StatusModel + "?apikey=" + apikey);
	xhr.send();

	xhr.onload = function() {
		let json = JSON.parse(xhr.responseText);
		if (json.status === 0) {
			if (json.message.indexOf("wait") != -1) {
				web_body.innerText = "モデル作成順番待ちです。" + json.message.substr(4) + "時間後にモデルの作成がはじまる見込みです。";
			} else if (json.message.indexOf("train") != -1) {
				web_body.innerText = "モデル作成中です。" + json.message.substr(5) + "時間後にモデルの作成が終わる見込みです。";
			} else if (json.message.indexOf("done") != -1) {
				web_body.innerText = "モデル作成が終わりました。";
			} else if (json.message.indexOf("fail") != -1) {
				web_body.innerText= "モデル作成に失敗しました。";
			} else {
				web_body.innerText = "想定しないメッセージです。";
			}
		} else {
			web_body.innerText = CreateStatusReferenceErrorDictionary[json.status];
		}
		/* コントロール操作可 */
		disableControl_modelcreate(false);
	}
	xhr.onerror = function() {
		error_msg_view(web_body,"error");
	}
	xhr.onabort = function() {
		error_msg_view(web_body,"abort");
	}
	xhr.ontimeout = function() {
		error_msg_view(web_body,"timeout");
	}
}

/*-- エラーメッセージ表示 --*/
function error_msg_view(web_body, err_type) {
	web_body.innerText = CommonErrorDictionary[err_type];
	/* コントロール操作可 */
	disableControl_modelimport(false);
}

