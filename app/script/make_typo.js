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

var msie = window.document.documentMode;

if (msie) {
    textareaR.addEventListener('keydown', function() {
        console.log("event");
        textareaR.style.height = "50px";
        textareaR.style.height = textareaR.scrollHeight + "px";
        textareaL.style.height = textareaR.scrollHeight + "px";
        placeholderChange(textareaR);
    });
} else {
    textareaR.addEventListener('input', function() {
        console.log("input");
        textareaR.style.height = "50px";
        textareaR.style.height = textareaR.scrollHeight + "px";
        textareaL.style.height = textareaR.scrollHeight + "px";
        placeholderChange(textareaR);
    });
}
function typoglycemia() {
    // 形態素解析メソッドの呼び出し
    kuromoji.builder({ dicPath: "node_modules/kuromoji/dict/" }).build(function (err, tokenizer) {
        if(err) {
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

function replacingChara(str) {
    return String(str).replace(/^(.)(.*?)(.)$/, function(v,p1,p2,p3){
        return p1 + sort_random(p2.split('')).join('') + p3;
    });
}
function sort_random(array) {
    for (var i = 0; i < array.length; i++) {
      var rand = Math.floor( Math.random() * ( i + 1 ) );
      var tmp = array[i];
      array[i] = array[rand];
      array[rand] = tmp;
    }
    return array;
}
function typoStrong() {
    var arr = Array.prototype.slice.call(document.getElementsByClassName("typo"));
    if ( !strongLine ) {
        Array.prototype.forEach.call(document.getElementsByClassName("typo"), function(ele){
            ele.classList.add("strong");
        });
    } else {
        Array.prototype.forEach.call(document.getElementsByClassName("typo"), function(ele){
            ele.classList.remove("strong");
        });
    }
    strongLine = !strongLine;
}
function textClear() {
    document.getElementById("typo").value = "";
    document.getElementById("result").textContent  = "";

    placeholderChange(textareaR);
}

function htmlCut(str) {
    return String(str).replace(/<.+?>/g,' ');
}

function sampleSet(){
    var str = document.getElementsByClassName("detail")[0].textContent;
    document.getElementById("typo").value = str;
}

function placeholderChange(ele) {
    if ( ele.textContent.length === 0 && ( ele.innerText.match(/\r\n|\n/g) === null || ele.innerText.match(/\r\n|\n/g).length === 1 )  ){
        document.getElementById("result").textContent  = "";//強制的に中身を空にする
        ele.setAttribute('data-placeholderactive','true');

    } else {
        ele.setAttribute('data-placeholderactive','false');
    }
}
