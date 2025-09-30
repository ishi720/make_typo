"use strict";

var strongLine = false;

document.execCommand('defaultParagraphSeparator', false, 'div');

//入力箇所の高さの自動制御
var textareaL = document.getElementById("typo");
var textareaR = document.getElementById("result");
textareaL.addEventListener('input', function() {
    textareaL.style.height = "50px";
    textareaL.style.height = textareaL.scrollHeight + "px";
    textareaR.style.height = textareaL.scrollHeight + "px";
});
textareaR.addEventListener('input', function() {
    textareaR.style.height = "50px";
    textareaR.style.height = textareaR.scrollHeight + "px";
    textareaL.style.height = textareaR.scrollHeight + "px";
    placeholderChange(textareaR);
});

/**
 * タイポグリセミア変換を実行
 */
function typoglycemia() {
    // 形態素解析メソッドの呼び出し
    kuromoji.builder({ dicPath: "node_modules/kuromoji/dict/" }).build(function (err, tokenizer) {
        if (err) {
            console.log(err);
            return;
        }

        var str = htmlCut(document.getElementById("typo").value);

        // 形態素解析
        var tokens = tokenizer.tokenize( str );
        var work = "";

        for (var i=0; i < tokens.length; i++){
            var tango = replacingChara(tokens[i].surface_form);

            if (tango === tokens[i].surface_form) {
                work = work + tango;
            } else {
                if (strongLine) {
                    work = work + "<span class='typo strong'>" + tango + "</span>";
                } else {
                    work = work + "<span class='typo'>" + tango + "</span>";
                }
            }
        }

        // 結果を表示する
        document.getElementById("result").innerHTML = work;

        placeholderChange(textareaR);
    });

}

/**
 * 文字列の先頭と末尾を残し、中間の文字をランダムに並び替える
 * @param {string} str - 対象の文字列
 * @returns {string} 変換後の文字列
 */
function replacingChara(str) {
    return String(str).replace(/^(.)(.*?)(.)$/, function(v,p1,p2,p3){
        return p1 + sort_random(p2.split('')).join('') + p3;
    });
}

/**
 * 配列の要素をランダムに並び替える（Fisher-Yates シャッフル）
 * @param {Array} array - シャッフルする配列
 * @returns {Array} シャッフルされた配列
 */
function sort_random(array) {
    for (var i = 0; i < array.length; i++) {
      var rand = Math.floor( Math.random() * ( i + 1 ) );
      var tmp = array[i];
      array[i] = array[rand];
      array[rand] = tmp;
    }
    return array;
}

/**
 * タイポ部分の強調表示を切り替える
 */
function typoStrong() {
    document.querySelectorAll(".typo").forEach(ele => {
        ele.classList.toggle("strong", !strongLine);
    });
    strongLine = !strongLine;
}

/**
 * HTMLタグを除去し、テキストのみに変換する
 * @param {string} str - HTMLを含む文字列
 * @returns {string} テキストのみの文字列
 */
function htmlCut(str) {
    return String(str).replace(/<.+?>/g,' ');
}

/**
 * サンプル文を左側入力欄にセットする
 */
function sampleSet(){
    var str = document.getElementsByClassName("detail")[0].textContent;
    document.getElementById("typo").value = str;
}

/**
 * placeholderの表示制御（空欄かどうかで切り替え）
 * @param {HTMLElement} ele - 対象の要素
 */
function placeholderChange(ele) {
    if ( ele.textContent.length === 0 && ( ele.innerText.match(/\r\n|\n/g) === null || ele.innerText.match(/\r\n|\n/g).length === 1 )  ){
        document.getElementById("result").textContent  = "";//強制的に中身を空にする
        ele.setAttribute('data-placeholderactive','true');

    } else {
        ele.setAttribute('data-placeholderactive','false');
    }
}
