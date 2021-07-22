/*-- 厳格モード --*/
"use strict";

/*-- 画像検索エラーメッセージ一覧 --*/
const SearchImagesErrorDictionary = {
  1000: "400:APIキーが未指定です。",
  1001: "400:APIキーが見つかりません。",
  1002: "400:退会済みです。",
  1003: "400:アカウントがまだ未承認です。",
  1010: "400:サーバが見つかりません。",
  1011: "400:サーバ側の設定でエラーが発生しました。",
  1030: "400:アクセスが拒否されました。",
  1031: "300:検索文字が未入力です。",
  1032: "400:検索文字は50文字以内にしてください。",
  1034: "400:ユーザー作成モデルが存在しません。",
  1404: "404:エンドポイントが不正です。",
  1405: "405:リクエストメソッドが不正です。",
  1500: "500:サーバ処理中に想定外のエラーが発生しました。",
};

/*-- API URL --*/
const URL_SearchByTextAPI =
  "https://api.a3rt.recruit-tech.co.jp/image_search/v1/search_by_text";
const URL_MyModelSearchByText =
  "https://api.a3rt.recruit-tech.co.jp/image_search/v1/my_model/search_by_text";

const MODEL_PATH = "../model/animal/";

/*-- 検索ワード取得 --*/
function GetSearchWord() {
  let searchword = document.getElementById("txt_message").value;
  SearchImages(searchword);
}

/*-- チェックボックス変更時処理 --*/
function ConfirmCheckBox(element) {
  if (element.checked === true) {
    document.getElementById("txt_message").value = element.value;
    SearchImages(element.value);
  }
}

/*-- 画像検索 --*/
function SearchImages(searchword) {
  /* 入力チェック */
  if (searchword === "") return;

  /* IEの場合、全角文字は文字化けするため */
  searchword = encodeURI(searchword);

  /* コントロール操作不可 */
  disableControl_searchimages(true);

  /* 処理切替 */
  let api_url = "";
  let rdn_dft = document.getElementById("rdn_dft");
  let rdn_my = document.getElementById("rdn_my");
  if (rdn_dft.checked) {
    /* デフォルトのモデルを使用 */
    api_url = URL_SearchByTextAPI;
  } else if (rdn_my.checked) {
    /* 自分が作成したモデルを使用 */
    api_url = URL_MyModelSearchByText;
  }

  if (api_url != "") {
    /* 検索処理開始 */
    let xhr = new XMLHttpRequest();
    xhr.open("GET", api_url + "?apikey=" + apikey + "&query=" + searchword);
    xhr.send();

    /* 検索成功時 */
    xhr.onload = function () {
      let json = JSON.parse(xhr.responseText);
      let web_page_body = document.getElementById("web-page-body");
      web_page_body.textContent = "";
      if (json.status === 0) {
        let index = 0;
        /* 検索結果の関連ワード表示 */
        let lbl_tag = document.createElement("label");
        lbl_tag.textContent = "関連ワード";
        web_page_body.appendChild(lbl_tag);
        let div_tag_lbl = document.createElement("div");
        div_tag_lbl.className = "related-word-scroll";
        for (let i = 0; i < json.result.txt.length; i++) {
          let value = json.result.txt[i];
          relation_word(value, div_tag_lbl, index);
          index += 1;
        }
        web_page_body.appendChild(div_tag_lbl);

        web_page_body.appendChild(document.createElement("br"));

        index = 0;
        /* 検索結果の画像表示 */
        let div_tag_img = document.createElement("div");
        div_tag_img.className = "grid";
        for (let i = 0; i < json.result.img.length; i++) {
          let value = json.result.img[i];
          preview_image(value, div_tag_img, index, api_url);
          index += 1;
        }
        web_page_body.appendChild(div_tag_img);

        /* Masonryのオプション設定 */
        let container = document.querySelector(".grid");
        imagesLoaded(container, function () {
          new Masonry(container, {
            itemSelector: ".grid-item",
          });
        });
        /* fancyboxのオプション設定 */
        $("[data-fancybox]").fancybox({
          loop: true,
        });
      } else {
        let errmsg = SearchImagesErrorDictionary[json.status];
        alert(errmsg);
      }
      /* コントロール操作可 */
      disableControl_searchimages(false);
    };
    xhr.onerror = function () {
      error_msg_view("error");
    };
    xhr.onabort = function () {
      error_msg_view("abort");
    };
    xhr.ontimeout = function () {
      error_msg_view("timeout");
    };
  } else {
    /* コントロール操作可 */
    disableControl_searchimages(false);
  }
}

/*-- 関連ワード表示 --*/
function relation_word(r_word, div_tag, index) {
  /* divタグ作成 */
  let div_tag_checkbox = document.createElement("div");
  div_tag_checkbox.className = "div-tag-word";
  /* checkboxタグ作成 */
  let checkbox_tag = document.createElement("input");
  checkbox_tag.type = "checkbox";
  checkbox_tag.id = "relation_word_" + index;
  checkbox_tag.setAttribute("onclick", "ConfirmCheckBox(this)");
  checkbox_tag.value = r_word;
  checkbox_tag.hidden = "hidden";
  /* labelタグ作成 */
  let lbl_tag = document.createElement("label");
  lbl_tag.setAttribute("for", "relation_word_" + index);
  lbl_tag.className = "related-word";
  lbl_tag.textContent = r_word;
  /* 関連ワード設定 */
  div_tag_checkbox.appendChild(checkbox_tag);
  div_tag_checkbox.appendChild(lbl_tag);
  div_tag.appendChild(div_tag_checkbox);
}

/*-- プレビュー画像作成 --*/
function preview_image(image, div_tag, index, api_url) {
  /* aタグ作成 */
  let a_tag = document.createElement("a");
  a_tag.setAttribute("data-fancybox", "group");
  a_tag.setAttribute("data-caption", image.file_name);
  a_tag.className = "grid-item";
  /* imgタグ作成 */
  let img_tag = document.createElement("img");
  img_tag.id = "img_result_" + index;
  img_tag.class = "img_result";
  if (api_url === URL_SearchByTextAPI) {
    /* デフォルトのモデルを使用 */
    a_tag.href = image.url;
    img_tag.src = image.url;
  } else if (api_url === URL_MyModelSearchByText) {
    /* 自分が作成したモデルを使用 */
    a_tag.href = MODEL_PATH + image.file_name;
    img_tag.src = MODEL_PATH + image.file_name;
  }
  /* 画面設定 */
  a_tag.appendChild(img_tag);
  div_tag.appendChild(a_tag);
}

/*-- エラーメッセージ表示 --*/
function error_msg_view(err_type) {
  alert(CommonErrorDictionary[err_type]);
  /* コントロール操作可 */
  disableControl_searchimages(false);
}
