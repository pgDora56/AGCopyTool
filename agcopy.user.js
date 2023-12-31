// ==UserScript==
// @name         AG Copy Tool
// @namespace    https://github.com/pgDora56
// @version      0.2.0
// @description  Add copy function to anison generation
// @author       Dora F.
// @match        http://anison.info/data/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anison.info
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let subject = document.querySelector(".subject");
    let title = subject.innerText;
    let perstr = "";
    let prostr = "";
    console.log(title);

    document.querySelectorAll("table").forEach((elem) => {
        let columns = [];
        elem.querySelector("thead").querySelectorAll("th.list").forEach((lis) => {
            columns.push(lis.innerText);
        });
        switch(JSON.stringify(columns)) {
            case JSON.stringify(["担当", "名前"]):
                perstr = personsString(elem.querySelector("tbody").querySelectorAll("tr"));
                break;
            case JSON.stringify(["ジャンル", "タイトル", "OP/ED"]):
                prostr = programsString(elem.querySelector("tbody").querySelectorAll("tr"));
                break;
        }
    });

    let copytext = title + " - " + perstr + " - " + prostr;
    console.log(copytext);

    subject.addEventListener('click', () => {
        copyTextToClipboard(copytext);
    })
})();


function personsString(trs) {
    let strs = [];
    trs.forEach((tr) => {
        let tds = tr.querySelectorAll("td");
        if (tds.length == 2) {
            let typ = tds[0].innerText;
            let dupl = false;
            for(let i = 0; i < strs.length; i++) {
                if(typ == strs[i][0]) {
                    strs[i][1] += ", " + tds[1].innerText;
                    dupl = true;
                    break;
                }
            }
            if(!dupl){
                strs.push([tds[0].innerText, tds[0].innerText + ":" + tds[1].innerText]);
            }
        }
    });
    let ret = [];
    for(let i = 0; i < strs.length; i++) {
        ret.push(strs[i][1]);
    }
    return ret.join(" / ");
}

function programsString(trs) {
    let strs = [];
    trs.forEach((tr) => {
        let genre = "";
        let pro = "";
        let oped = "";
        let tds = tr.querySelectorAll("td");
        if (tds.length == 3) {
            let tdstrong = tds[0].querySelectorAll("strong")
            if (tdstrong.length == 1) {
                genre = tdstrong[0].innerText.substr(0, 2);
                pro = tds[1].querySelector("strong").innerText;
                oped = "*" + tds[2].querySelector("strong").innerText;
            } else {
                genre = tds[0].innerText.substr(0, 2);
                pro = tds[1].innerText;
                oped = tds[2].innerText;
            }
            let dupl = false;
            for(let i = 0; i < strs.length; i++) {
                if(genre+pro==strs[i][0]) {
                    strs[i][3].push(oped);
                    dupl = true;
                    break;
                }
            }
            if(!dupl) {
                strs.push([genre+pro, pro, genre, [oped]]);
            }
        }
    });
    console.log(strs);
    let ret = [];
    for(let i = 0; i < strs.length; i++) {
        ret.push(`${strs[i][2]}『${strs[i][1]}』[${strs[i][3].join("/")}]`);
    }
    return ret.join(", ");
}

function copyTextToClipboard (text) {
  if (navigator.clipboard) return  navigator.clipboard.writeText(text);

  const isIos = navigator.userAgent.match(/ipad|iphone/i);
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  if (isIos) {
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    textarea.setSelectionRange(0, 999999);
  } else {
    textarea.select();
  }
  const result = document.execCommand('copy');
  document.body.removeChild(textarea);
};
