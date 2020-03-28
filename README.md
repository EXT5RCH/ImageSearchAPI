# ImageSearchAPI
A3RTのImageSearchAPIを使用

# 諸注意
- 以下の公式サイトより、API KEYを事前に取得する必要があります。  
https://a3rt.recruit-tech.co.jp/product/imageSearchAPI/  
所得後、『APIKEY.js』のapikeyへ取得した値を設定してください。  
- 学習データとして、ImageSearchAPI\modelへanimal.zipを用意しています。  
今回DBを立ち上げない設定のため、学習データを『SearchImages.js』のMODEL_PATHへ記載したディレクトリへ展開しておく必要があります。  
（デフォルトは「../model/animal/」）
- CORSの関係で、実行環境により動作が異なります。 

|ブラウザ|Chrome|Edge|IE|
----|----|----|---- 
|ローカルファイルとして実行した場合|〇|×|×|
|Webサーバに置いて実行した場合|〇|〇|〇|
