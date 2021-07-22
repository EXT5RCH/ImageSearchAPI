/*-- 厳格モード --*/
"use strict";

/*-- 画像検索エラーメッセージ一覧 --*/
const SearchImagesErrorDictionary = {
  1000: "400:APIキー未指定",
  1001: "400:APIキーが見つからない",
  1002: "400:退会済み",
  1003: "400:アカウントがまだ未承認です。",
  1010: "400:サーバが見つかりません。",
  1011: "400:サーバ側の設定でエラーが発生しました。",
  1030: "400:アクセスが拒否されました。",
  1400: "400:アップロード用のURLの作製に失敗しました。",
  1404: "404:エンドポイントが不正です。",
  1405: "405:リクエストメソッドが不正です。",
  1500: "500:サーバ処理中に想定外のエラーが発生しました。",
};

/*-- API URL --*/
const URL_GetUploadURL =
  "https://api.a3rt.recruit-tech.co.jp/image_search/v1/get_upload_url";

/*-- エラーメッセージ用 --*/
const et_url_const = "URL取得時" + "\n";
const upload_const = "アップロード時" + "\n";

/*-- モデルインポート --*/
function ModelImport() {
  /* 入力チェック */
  let upload_file_path = document.getElementById("upload_file_path");
  if (upload_file_path.value === "") {
    alert("アップロードファイルを指定してください。");
    return;
  }

  /* コントロール操作不可 */
  disableControl_modelimport(true);

  /* ファイルデータ準備 */
  let form_data = new FormData();
  let file = upload_file_path.files[0];
  form_data.append(file.name, file);

  /* 前回結果表示クリア */
  let web_body = document.getElementById("web-page-body");
  web_body.innerText = "";

  /* 進捗状況表示開始 */
  let prgrs_tag = document.createElement("progress");
  prgrs_tag.id = "prgrs_tag";
  prgrs_tag.max = 100;
  change_progress(prgrs_tag, 0);
  web_body.appendChild(prgrs_tag);

  /* アップロード先URL取得*/
  let xhr = new XMLHttpRequest();
  xhr.open("GET", URL_GetUploadURL + "?apikey=" + apikey);
  xhr.send();

  /* 処理開始 */
  xhr.onloadstart = function () {
    change_progress(prgrs_tag, 25);
  };
  /* 受信中 */
  xhr.onprogress = function () {
    change_progress(prgrs_tag, 50);
  };
  /* 取得成功時 */
  xhr.onload = function () {
    /* 学習データアップロード */
    let json = JSON.parse(xhr.responseText);
    xhr = new XMLHttpRequest();
    xhr.open("PUT", json.result.url);
    xhr.setRequestHeader("Content-Type", "");
    xhr.send(form_data);
    /* 処理開始 */
    xhr.onloadstart = function () {
      change_progress(prgrs_tag, 75);
    };
    /* 受信中 */
    xhr.onprogress = function () {
      change_progress(prgrs_tag, 90);
    };
    /* アップロード成功時 */
    xhr.onload = function () {
      upload_success(prgrs_tag, web_body);
    };
    xhr.onerror = function () {
      error_msg_view(upload_const, get_url_const, "error");
    };
    xhr.onabort = function () {
      error_msg_view(upload_const, get_url_const, "abort");
    };
    xhr.ontimeout = function () {
      error_msg_view(upload_const, get_url_const, "timeout");
    };
  };
  xhr.onerror = function () {
    error_msg_view(web_body, get_url_const, "error");
  };
  xhr.onabort = function () {
    error_msg_view(web_body, get_url_const, "abort");
  };
  xhr.ontimeout = function () {
    error_msg_view(web_body, get_url_const, "timeout");
  };
}

/*-- 進捗状況変更処理 --*/
function change_progress(prgrs_tag, pram) {
  prgrs_tag.value = pram;
  prgrs_tag.innerText = pram + "%";
}
/*-- エラーメッセージ表示 --*/
function error_msg_view(web_body, str_const, err_type) {
  web_body.innerText = str_const + CommonErrorDictionary[err_type];
  /* コントロール操作可 */
  disableControl_modelimport(false);
}

/*-- アップロード成功時処理 --*/
function upload_success(prgrs_tag, web_body) {
  change_progress(prgrs_tag, 100);
  disableControl_modelimport(false);
  let div_tag = document.createElement("div");
  div_tag.textContent = "成功しました。";
  web_body.appendChild(div_tag);
}
