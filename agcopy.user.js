// ==UserScript==
// @name         AG Copy Tool
// @namespace    https://github.com/pgDora56
// @version      0.1
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
            strs.push(tds[0].innerText + ":" + tds[1].innerText);
        }
    });
    return strs.join(" / ");
}

function programsString(trs) {
    let strs = [];
    trs.forEach((tr) => {
        let tds = tr.querySelectorAll("td");
        if (tds.length == 3) {
            let tdstrong = tds[0].querySelectorAll("strong")
            if (tdstrong.length == 1) {
                strs.push(tds[1].querySelector("strong").innerText+"[★"+
                          tdstrong[0].innerText.substr(0, 2)+" "+
                          tds[2].querySelector("strong").innerText+"]");
            } else {
                strs.push(tds[1].innerText+"["+
                          tds[0].innerText.substr(0, 2)+" "+
                          tds[2].innerText+"]");
            }
        }
    });
    return strs.join(", ");
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
