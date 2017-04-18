# Eorclock - a desktop gadget for FF14 gatherers

エオルゼア時間に追われるギャザラーのための Windows デスクトップガジェットです。

Web ブラウザやスマホで動くエオルゼア時計はあるのですが、
ひとつのアプリとして Windows のデスクトップ上に置いておけるものがほしかったので、
作りました。


## Installation

このリポジトリのファイルを丸ごと ZIP ファイルでダウンロードして、
適当なフォルダに展開すればインストール完了です。
`eorclock.hta` をダブルクリックすれば起動します。

[このリポジトリのトップページ](https://github.com/quercus2011/eorclock)を開いて、
右上にある緑色の "Clone or download" ボタンを押すと、
ZIP ファイルがダウンロードできます。

もしかすると起動時にセキュリティの警告が出るかもしれません。
一般的に、拡張子 `.hta` のプログラム（HTA スクリプト）はヘイトが高いのです。
自己責任で許可を出してください。

使わなくなったらフォルダ丸ごと削除すれば消えます。

Windows のレジストリとかは触っていません。

Eorclock は PC の（Windows の）時計を参照しています。
PC の内蔵時計はあまり精度が良くないので、
定期的にインターネット上のサーバと通信して自動的に時計を調整するように
Windows を設定しておきましょう。


## Specification

 - エオルゼア時間 (ET) の1日（24時間）が地球時間の 70 分に相当するものとして計算しています。
 - エオルゼアの暦では、24時間で1日、8日で1週間、4週間で1ヶ月、12ヶ月で1年、となります。
 - 世界協定時 (UTC) 1970/Jan/01 00:00:00 （いわゆる UNIX Epoch）を ET 紀元として計算しています。


## Reference

 - エオルゼア時間 - FF14 Online Wiki    
   http://ff14wiki.info/?%E3%82%A8%E3%82%AA%E3%83%AB%E3%82%BC%E3%82%A2%E6%99%82%E9%96%93
 - 五紀暦 - FF14 Online Wiki    
   http://ff14wiki.info/?%E4%BA%94%E7%B4%80%E6%9A%A6
 - FF14俺tools: エオルゼアカレンダー    
   http://ffxiv.eca.exdreams.net
 - エオルゼア時計（Javascript版） - eLeMeN    
   http://www5.plala.or.jp/SQR/ff14/contents/download/eorzeaclock.html


## License

[MIT License (X11 License) です。](https://github.com/quercus2011/eorclock/blob/master/LICENSE)

基本的に「好きに扱ってください」というフリーなオープンソース・ライセンスです。
改造、再配布、商用利用など、問題ありません。
**無保証**なのはお約束です。使うときは自己責任で。

参考：[さまざまなライセンスとそれらについての解説 - GNUプロジェクト - FSF](https://www.gnu.org/licenses/license-list.ja.html#X11License)


## Notice

記載されている会社名・製品名・システム名などは、各社の商標、または登録商標です。
