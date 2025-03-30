//表示されているIDの初期値
var disp_id = 1;
var selsuuryou = 0;

//コマを選択したフラグ
var setSelBtnFlag = 0;
var selectInfo = "";
var tb_disp_id_min = 1;
var tb_disp_id_max = 8;

function initButton() {
  var int_td = 5;

  var tagid_prefix = "td" + disp_id;
  var obj_array = new Array(2);
  obj_array[0] = document.getElementsByTagName("th");
  obj_array[1] = document.getElementsByTagName("td");

  // 複数のコマパターンが登録されてる場合の対応

  if (tb_disp_id_min > 4) {
    tb_disp_id_min = 4 - 8 + 1;

    tb_disp_id_max = tb_disp_id_min + 8 - 1;
  }

  for (i = 0; i < obj_array.length; i++) {
    for (j = 0; j < obj_array[i].length; j++) {
      var objtmp = obj_array[i][j];
      var objidtmp = objtmp.id;
      if (objidtmp.indexOf(tagid_prefix) == 0) {
        var colno = objidtmp.substring(objidtmp.indexOf("_") + 1);
        if (tb_disp_id_min <= colno && colno <= tb_disp_id_max) {
          objtmp.style.display = "";
        } else {
          objtmp.style.display = "none";
        }
      }
    }
  }
}

function okbutton() {
  var flag = false;
  var flag1 = false;

  for (i = 0; i < 3; i++) {
    var hidkomaptn;

    if (i < 3) {
      hidkomaptn = document.getElementById("hkomaptn" + i);
    }

    if (flag) {
      document.HIDUKEFORM.flg_sstkoma.value = "1";
      break;
    }

    if (document.HIDUKEFORM.yoyakuinfo) {
      if (document.HIDUKEFORM.yoyakuinfo.value.length > 0) flag1 = true;
    }

    if (
      document.HIDUKEFORM.kaisikoma.options[i] != null &&
      document.HIDUKEFORM.kaisikoma.options[i].value != 0
    ) {
      document.HIDUKEFORM.kaisikoma.options[i].selected = true;
      document.HIDUKEFORM.g_kaisitime.options[i].selected = true;
      document.HIDUKEFORM.kanricd.options[i].selected = true;
      document.HIDUKEFORM.g_sisetucd.options[i].selected = true;
      document.HIDUKEFORM.cssisetucd.options[i].selected = true;

      document.HIDUKEFORM.g_stgroup.options[i].selected = true;

      document.HIDUKEFORM.basyocd.options[i].selected = true;

      document.HIDUKEFORM.ymd.options[i].selected = true;
      document.HIDUKEFORM.g_renzkkoma.options[i].selected = true;
    }
    if (
      document.HIDUKEFORM.syurkoma.options[i] != null &&
      document.HIDUKEFORM.syurkoma.options[i].value != 0
    ) {
      document.HIDUKEFORM.syurkoma.options[i].selected = true;
      document.HIDUKEFORM.g_syurtime.options[i].selected = true;
    }
    var index_i;
    var index_j;
    for (j = 0; j < 28; j++) {
      var hiddenId = "record" + i + "_" + j;
      var check_elm = document.getElementById(hiddenId);
      if (
        check_elm != null &&
        check_elm.value == document.HIDUKEFORM.kaisikoma.options[i].value
      ) {
        index_i = j;
      }
      if (
        check_elm != null &&
        check_elm.value == document.HIDUKEFORM.syurkoma.options[i].value
      ) {
        index_j = j;
      }
    }

    if (hidkomaptn != null && hidkomaptn.value == "1") {
      var check_id;
      if (i < 3) {
        check_id = "record" + i + "_" + "4";
      }

      var check_elem = document.getElementById(check_id);

      if (check_elem.value != 0) {
      } else {
        for (; index_i < index_j; index_i++) {
          var check_id = "record" + i + "_" + index_i;
          var check_elem = document.getElementById(check_id);

          if (check_elem.value == 0 || check_elem.value == null) {
            flag = true;
            break;
          }
        }
      }
    } else {
      for (; index_i < index_j; index_i++) {
        var check_id = "record" + i + "_" + index_i;
        var check_elem = document.getElementById(check_id);
        if (check_elem.value == 0 || check_elem.value == null) {
          flag = true;
          break;
        }
      }
    }
  }

  if (document.HIDUKEFORM.yoyakuinfo.value != "") {
    var size = document.HIDUKEFORM.yoyakuinfo.value.split("@");

    var rec_cnt = getSelRecordNum(document.HIDUKEFORM.yoyakuinfo.value, "");
    if (rec_cnt > 25) {
      alert("最大予約数を超えています。");
      flag1 = false;
    }
  }

  if (flag1) {
    document.HIDUKEFORM.showStartKoma.value = tb_disp_id_min;
    document.HIDUKEFORM.showEndKoma.value = tb_disp_id_max;

    document.HIDUKEFORM.submit();
  }
}

function okbuttonTk() {
  document.HIDUKEFORM.submit();
}

function onclickbutton(count, num, td_id, lastKomaIdx) {
  var imgurl = "/stagia/jsp/images_jp/multi_images/";

  var td_idname = "button" + count + "_" + num;
  var input_idname =
    count + "," + num + ",'" + td_id + "','" + lastKomaIdx + "'";

  var button = document.getElementById("button" + count + "_" + num);
  var td = document.getElementById(td_id);
  checkkoma(count, num);
  var komaInfo = getSelKomaInfo(count, num, lastKomaIdx);

  // 連続コマを選択するかどうかのチェック。
  if (checkMultKoma(komaInfo) == false) {
    return;
  }

  if (false == checkFukusuKoma(komaInfo)) {
    return;
  }

  if (button.title == "O") {
    if (setSelBtnFlag == 1) {
      //セット予約がある場合

      if (1 == "1") {
        var saidaisu = 25;
        if (
          getSelRecordNum(document.HIDUKEFORM.yoyakuinfo.value, komaInfo) >
          saidaisu
        ) {
          return;
        }
      } else {
        //セット予約が無い場合

        if (
          getSelRecordNum(document.HIDUKEFORM.yoyakuinfo.value, komaInfo) > 1
        ) {
          return;
        }
      }
    }

    if (getSelRecordNum(document.HIDUKEFORM.yoyakuinfo.value, komaInfo) == -1) {
      document.HIDUKEFORM.errorg_code.value = "1";
      okbutton();
      return;
    }

    var text =
      '<a id = "' +
      td_idname +
      '" href="javascript:onclickbutton(' +
      input_idname +
      ')">選択</a>';
    td.innerHTML = text;
    td.className = "selected";

    button.alt = "null";

    button.title = "null";

    selsuuryou += 1;

    while (document.HIDUKEFORM.yoyakuinfo.value.indexOf(komaInfo) == -1) {
      document.HIDUKEFORM.yoyakuinfo.value =
        document.HIDUKEFORM.yoyakuinfo.value + komaInfo;
    }
  } else {
    if (setSelBtnFlag == 1) {
      //セット予約がある場合

      if (1 == "1") {
        var saidaisu = 25;
        if (
          getSelRecordNum(
            document.HIDUKEFORM.yoyakuinfo.value.replace(komaInfo, ""),
            "",
          ) > saidaisu
        ) {
          return;
        }
      } else {
        //セット予約が無い場合

        if (
          getSelRecordNum(
            document.HIDUKEFORM.yoyakuinfo.value.replace(komaInfo, ""),
            "",
          ) > 1
        ) {
          return;
        }
      }
    }

    var text =
      '<input type="image" id="' +
      td_idname +
      '" onClick="onclickbutton(' +
      input_idname +
      ')" src="' +
      imgurl +
      'timetable-o.gif" alt="O" title="O" >';

    td.innerHTML = text;
    td.className = "ok";
    button.src = "/stagia/jsp/images_jp/multi_images/timetable-o.gif";

    button.alt = "O";

    button.title = "O";

    selsuuryou -= 1;
    document.HIDUKEFORM.yoyakuinfo.value =
      document.HIDUKEFORM.yoyakuinfo.value.replace(komaInfo, "");
  }
  var yoyaku = document.getElementById("btnYyList");
  if (selsuuryou > 0) {
    yoyaku.style.cursor = "hand";
  } else {
    yoyaku.style.cursor = "default";
  }
}

// 連続コマを選択するかどうかのチェック。

function checkMultKoma(komaInfo) {
  var sep = ",";
  var yoyakuInfoSelAll = "";
  var yoyakuInfoSel = komaInfo;
  if (typeof document.HIDUKEFORM.yoyakuinfo != "undefined") {
    if (
      document.HIDUKEFORM.yoyakuinfo.value != null &&
      document.HIDUKEFORM.yoyakuinfo.value != ""
    ) {
      yoyakuInfoSelAll = document.HIDUKEFORM.yoyakuinfo.value;
    } else {
      return true;
    }
  }

  var selButtonInfo = yoyakuInfoSel.split("@");
  var selButtonDetails = selButtonInfo[0].split(",");
  var selKanricd = selButtonDetails[0];
  var selGsisetucd = selButtonDetails[1];
  var selCssisetucd = selButtonDetails[2];
  var selBasyocd = selButtonDetails[3];
  var selYmd = selButtonDetails[4];
  var selKaisikoma = selButtonDetails[5];
  var selSyuryokoma = selButtonDetails[6];
  var selGrenzkkoma = selButtonDetails[9];
  var selKaisikomaBef = eval(selKaisikoma) - 1;
  var selKaisikomaAft = eval(selKaisikoma) + 1;
  var selSyuryokomaBef = eval(selSyuryokoma) - 1;
  var selSyuryokomaAft = eval(selSyuryokoma) + 1;

  var chkSelInfoBefore =
    selKanricd +
    sep +
    selGsisetucd +
    sep +
    selCssisetucd +
    sep +
    selBasyocd +
    sep +
    selYmd +
    sep +
    "kaisikoma=" +
    selKaisikomaBef +
    sep +
    "syurkoma=" +
    selSyuryokomaBef +
    sep;

  var chkSelInfoAfter =
    selKanricd +
    sep +
    selGsisetucd +
    sep +
    selCssisetucd +
    sep +
    selBasyocd +
    sep +
    selYmd +
    sep +
    "kaisikoma=" +
    selKaisikomaAft +
    sep +
    "syurkoma=" +
    selSyuryokomaAft +
    sep;

  var selButtonInfoAll = yoyakuInfoSelAll.split("@");
  var selButtonLengthAll = selButtonInfoAll.length;

  //連続コマ選択不可
  if ("g_renzkkoma=0" == selGrenzkkoma) {
    if (selButtonLengthAll != 0) {
      for (i = 0; i < selButtonLengthAll; i++) {
        if (selButtonInfoAll[i].indexOf(chkSelInfoBefore) != -1) {
          return false;
        }
        if (selButtonInfoAll[i].indexOf(chkSelInfoAfter) != -1) {
          return false;
        }
      }
    }
  } else {
    //連続コマ選択可
    return true;
  }
}

function checkFukusuKoma(komaInfo) {
  var yoyakuInfo = "";
  if (typeof document.HIDUKEFORM.yoyakuinfo != "undefined") {
    if (
      document.HIDUKEFORM.yoyakuinfo.value != null &&
      document.HIDUKEFORM.yoyakuinfo.value != ""
    ) {
      yoyakuInfo = document.HIDUKEFORM.yoyakuinfo.value;
    } else {
      return true; // 他のコマ押さえ無し
    }
  }

  var selButtonInfo = komaInfo.split("@");
  var selButtonDetails = selButtonInfo[0].split(",");
  var selKanricd = selButtonDetails[0];
  var selGsisetucd = selButtonDetails[1];
  var selCssisetucd = selButtonDetails[2];
  var selBasyocd = selButtonDetails[3];
  var selYmd = selButtonDetails[4];
  var selKaisikoma = parseInt(
    selButtonDetails[5].substring("kaisikoma=".length),
    10,
  );
  var selSyuryokoma = parseInt(
    selButtonDetails[6].substring("syurkoma=".length),
    10,
  );
  var selFhantekoma = parseInt(
    selButtonDetails[12].substring("fhantekoma=".length),
    10,
  );
  var selFhantekomasu = parseInt(
    selButtonDetails[13].substring("fhantekomasu=".length),
    10,
  );
  if (0 == selFhantekomasu) {
    return true; // 複数判定なし
  }

  // コマ押さえ情報から、今回クリックしたコマを含む明細を探す
  var chkKaisikoma = 0;
  var chkSyuryokoma = 0;
  var yoyaku_list = getSelRecordArray(yoyakuInfo, komaInfo);
  if (yoyaku_list == null) {
    return false; // 管理をまたいだコマ押さえ
  }
  for (var i = 1; i < yoyaku_list.length; i++) {
    if (yoyaku_list[i] != "") {
      var yoyakuDetails = yoyaku_list[i].split(",");
      if (
        selKanricd == yoyakuDetails[0] && // 管理コードが同一
        selGsisetucd == yoyakuDetails[1] && // 施設コードが同一
        selCssisetucd == yoyakuDetails[2] && // 申込施設コードが同一
        selBasyocd == yoyakuDetails[3] && // 場所コードが同一
        selYmd == yoyakuDetails[4] // 日付が同一
      ) {
        var yoyakuKaisikoma = parseInt(
          yoyakuDetails[5].substring("kaisikoma=".length),
          10,
        ); // 開始コマ
        var yoyakuSyuryokoma = parseInt(
          yoyakuDetails[6].substring("syurkoma=".length),
          10,
        ); // 終了コマ
        if (
          yoyakuKaisikoma <= selKaisikoma &&
          selKaisikoma <= yoyakuSyuryokoma
        ) {
          chkKaisikoma = yoyakuKaisikoma;
          chkSyuryokoma = yoyakuSyuryokoma;
          break;
        }
      }
    }
  }
  if (chkKaisikoma < selFhantekoma) {
    // コマ押さえ開始コマ番号が 複数判定開始コマ より小さい場合は、複数判定開始コマから複数判定を開始する
    chkKaisikoma = selFhantekoma;
  }
  if (chkSyuryokoma - chkKaisikoma + 1 > selFhantekomasu) {
    return false; // 複数判定ＮＧ
  }
  return true;
}

function getSelRecordArray(yoyakuinfo, komainfo) {
  yoyakuinfo = yoyakuinfo + komainfo;
  if (yoyakuinfo == null || yoyakuinfo.length == 0) {
    return new Array();
  }
  // 貸与区分
  var taiyokubun = "taiyokbn=1";
  // 午前区分
  var gozenkubun = "komakbn=2";
  // 午後区分
  var gogokubun = "komakbn=4";
  // 夜間区分
  var yakankubun = "komakbn=6";
  var infolist = yoyakuinfo.split("@");
  for (i = 0; i < infolist.length; i++) {
    if (infolist[i] == "") break;
    var sublist = infolist[i].split(",");
    if (Number(sublist[5].substring("kaisikoma=".length)) < 10) {
      infolist[i] = infolist[i].replace("kaisikoma=", "kaisikoma=0");
    }
  }
  var sortlist = infolist.sort();
  for (index = 1; index < sortlist.length; index++) {
    var sublistone = sortlist[index].split(",");
    //現在の区分コード
    var genzaikunu = sublistone[11];
    for (indey = index; indey < sortlist.length; indey++) {
      if (sortlist[indey] == "") {
        break;
      }
      var sublisttwo = sortlist[indey].split(",");
      //管理コード!=次の管理コードの場合、管理を跨いだ施設選択は不可。
      if (sublistone[0] != sublisttwo[0]) {
        return -1;
      }

      if (
        sublistone[0] == sublisttwo[0] && //管理コード==次の管理コード
        sublistone[1] == sublisttwo[1] && //施設コード==次の施設コード
        sublistone[2] == sublisttwo[2] && //申込施設コード==次の申込施設コード
        sublistone[3] == sublisttwo[3] && //場所コード==次の場所コード
        sublistone[4] == sublisttwo[4]
      ) {
        //日付==次の日付
        //連続コマ
        if (sublistone[9] == "g_renzkkoma=" + "1") {
          //終了コマ > 次の開始コマ-1
          if (
            sublistone[6].substring("syurkoma=".length) >
            sublisttwo[5].substring("kaisikoma=".length) - 1
          ) {
            continue;
          }
          //終了コマ == 次の開始コマ-1
          if (
            sublistone[6].substring("syurkoma=".length) ==
            sublisttwo[5].substring("kaisikoma=".length) - 1
          ) {
            sublistone[6] = sublisttwo[6];
            sortlist[index] = sublistone.join(",");
            sortlist[indey] = "";
            continue;
            //貸与区分 == 区分貸 && (午前と午後を選択 or 午後と夜間を選択)
          } else if (
            sublistone[10] == taiyokubun &&
            ((genzaikunu == gozenkubun && sublisttwo[11] == gogokubun) ||
              (genzaikunu == gogokubun && sublisttwo[11] == yakankubun))
          ) {
            sublistone[6] = sublisttwo[6];
            genzaikunu = sublisttwo[11];
            sortlist[index] = sublistone.join(",");
            sortlist[indey] = "";
            continue;
          }
        }
      }
    }
  }
  return sortlist;
}

function getSelRecordNum(yoyakuinfo, komaInfo) {
  var sortlist = getSelRecordArray(yoyakuinfo, komaInfo);
  if (sortlist == null) {
    return -1; // 管理をまたいだコマ押さえ
  }
  var selRecordNum = 0;

  //計算レコード数
  for (index = 1; index < sortlist.length; index++) {
    if (sortlist[index] != "") {
      selRecordNum++;
    }
  }
  return selRecordNum;
}

function getSelKomaInfo(index, num, lastKomaIdx) {
  var kaisiKoma = num;
  //↓Mod 2015.11.02 Stagia1.0.0開発(23区カスタマイズ) by song [11-1]
  //		var syuryoKoma = num;
  var syuryoKoma = lastKomaIdx;
  //↑Mod 2015.11.02 Stagia1.0.0開発(23区カスタマイズ) by song [11-1]

  var kaisitime = document.getElementById(
    "kaisitime" + index + "_" + num,
  ).value;

  var syurtime = document.getElementById(
    "syuryotime" + index + "_" + num,
  ).value;

  var taiyokbn = document.getElementById("taiyokbn" + index + "_" + num).value;

  var kubuncd = document.getElementById("kubuncdnm" + index + "_" + num).value;

  var karicd = document.HIDUKEFORM.kanricd.options[index].value;
  var g_susetycd = document.HIDUKEFORM.g_sisetucd.options[index].value;
  var cssisetucd = document.HIDUKEFORM.cssisetucd.options[index].value;
  var basyocd = document.HIDUKEFORM.basyocd.options[index].value;
  var ymd = document.HIDUKEFORM.ymd.options[index].value;

  var renzoku = document.HIDUKEFORM.g_renzkkoma.options[index].value;

  var fhantekoma = document.getElementById(
    "fhantekoma" + index + "_" + num,
  ).value;
  var fhantekomasu = document.getElementById(
    "fhantekomasu" + index + "_" + num,
  ).value;

  var sep = ",";
  return (
    "kanricd=" +
    karicd +
    sep +
    "g_sisetucd=" +
    g_susetycd +
    sep +
    "cssisetucd=" +
    cssisetucd +
    sep +
    "basyocd=" +
    basyocd +
    sep +
    "ymd=" +
    ymd +
    sep +
    "kaisikoma=" +
    kaisiKoma +
    sep +
    "syurkoma=" +
    syuryoKoma +
    sep +
    "g_kaisitime=" +
    kaisitime +
    sep +
    "g_syurtime=" +
    syurtime +
    sep +
    "g_renzkkoma=" +
    renzoku +
    sep +
    "taiyokbn=" +
    taiyokbn +
    sep +
    "komakbn=" +
    kubuncd +
    sep +
    "fhantekoma=" +
    fhantekoma +
    sep +
    "fhantekomasu=" +
    fhantekomasu +
    "@"
  );
}

function checkkoma(index, num) {
  var hiddenId = "record" + index + "_" + num;

  var elementId = document.getElementById(hiddenId);
  if (elementId.value == 0) {
    elementId.value = num;
  } else {
    elementId.value = 0;
  }

  var min_koma = 28;
  var max_koma = 0;
  var kaisitime;
  var syrrtime;
  var setFlg = false;
  for (i = 1; i <= 28; i++) {
    var j = i + 1;

    var i_id = "record" + index + "_" + i;

    var kaisitimeid = "kaisitime" + index + "_" + i;

    var syurtimeid = "syuryotime" + index + "_" + i;
    var i_elem = document.getElementById(i_id);
    var kaisi_elem = document.getElementById(kaisitimeid);
    var syur_elem = document.getElementById(syurtimeid);
    if (
      i_elem != null &&
      i_elem.value != 0 &&
      eval(i_elem.value) < eval(min_koma)
    ) {
      min_koma = i_elem.value;
      kaisitime = kaisi_elem.value;
      setFlg = true;
    }
    if (
      i_elem != null &&
      i_elem.value != 0 &&
      eval(i_elem.value) > eval(max_koma)
    ) {
      max_koma = i_elem.value;
      syrrtime = syur_elem.value;
      setFlg = true;
    }
    // コマが連続しないのばあい、設定しない。

    if (setFlg && (i_elem == null || i_elem.value == 0)) break;
  }
  if (min_koma != 28 && max_koma != 0) {
    document.HIDUKEFORM.g_kaisitime.options[index].value = kaisitime;
    document.HIDUKEFORM.g_syurtime.options[index].value = syrrtime;
    document.HIDUKEFORM.kaisikoma.options[index].value = min_koma;
    document.HIDUKEFORM.syurkoma.options[index].value = max_koma;
  } else {
    document.HIDUKEFORM.g_kaisitime.options[index].value = "";
    document.HIDUKEFORM.g_syurtime.options[index].value = "";
    document.HIDUKEFORM.kaisikoma.options[index].value = "";
    document.HIDUKEFORM.syurkoma.options[index].value = "";
  }
}

//↓Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
//	function setSelectInfo(count,num,td_id) {
function setSelectInfo(count, num, td_id, komaIndex) {
  //↑Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
  var sep = ",";
  //↓Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
  //				selectInfo = selectInfo + count + sep
  //                       					+ num + sep
  //                       					+ td_id + "@";
  selectInfo =
    selectInfo + count + sep + num + sep + td_id + sep + komaIndex + "@";
  //↑Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
}

function setSelectButton() {
  var selectButtonInfo = selectInfo.split("@");
  var length_button = selectButtonInfo.length;
  if (length_button != 0) {
    for (t = 0; t <= length_button - 1; t++) {
      var selectButtonDetails = selectButtonInfo[t].split(",");
      if (
        selectButtonDetails.length >= 3 &&
        selectButtonDetails[0] != null &&
        selectButtonDetails[1] != null &&
        selectButtonDetails[2] != null &&
        //↓Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
        // selectButtonDetails[6] != null)
        selectButtonDetails[3] != null
      ) {
        //↑Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
        //↓Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
        // 					onclickbutton(selectButtonDetails[0],
        // 					              selectButtonDetails[1],
        // 					              selectButtonDetails[2],
        // 					              selectButtonDetails[6]);
        onclickbutton(
          selectButtonDetails[0],
          selectButtonDetails[1],
          selectButtonDetails[2],
          selectButtonDetails[3],
        );
        onclickbutton(
          selectButtonDetails[0],
          selectButtonDetails[1],
          selectButtonDetails[2],
          selectButtonDetails[3],
        );
        //↑Mod 2015.12.18 Stagia1.0.0開発(23区カスタマイズ) by song [13-1]
      }
    }
  }
}

function clrSelectInfo() {
  selectInfo = "";
}

function leftbutton() {
  //次のID
  var next_id = tb_disp_id_max - 7;
  var int_td = 5;

  for (i = 0; i <= int_td - 1; i++) {
    //現在のIDのオブジェクトを取得

    var td_obj = document.getElementById(
      "td" + disp_id + i + "_" + tb_disp_id_max,
    );

    if (td_obj == null) {
    } else {
      //現在のIDを非表示にする
      td_obj.style.display = "none";
    }
  }
  for (i = 0; i <= int_td - 1; i++) {
    //次のIDのオブジェクトを取得

    var next_td_obj = document.getElementById(
      "td" + disp_id + i + "_" + next_id,
    );

    if (next_td_obj == null) {
    } else {
      //次のIDを表示する
      next_td_obj.style.display = "";
    }
  }

  //表示IDの更新
  tb_disp_id_min = tb_disp_id_min - 1;
  tb_disp_id_max = tb_disp_id_max - 1;

  //ボタンの表示チェック
  butonCheck();
}

function rightbutton() {
  //次のID
  var next_id = tb_disp_id_min + 7;
  var int_td = 5;
  for (i = 0; i <= int_td - 1; i++) {
    //次のIDのオブジェクトを取得

    var next_td_obj = document.getElementById(
      "td" + disp_id + i + "_" + next_id,
    );

    if (next_td_obj == null) {
    } else {
      //次のIDを表示する
      next_td_obj.style.display = "";
    }
  }
  for (i = 0; i <= int_td - 1; i++) {
    //現在のIDのオブジェクトを取得

    var td_obj = document.getElementById(
      "td" + disp_id + i + "_" + tb_disp_id_min,
    );

    if (td_obj == null) {
    } else {
      //現在のIDを非表示にする
      td_obj.style.display = "none";
    }
  }

  //表示IDの更新
  tb_disp_id_min = tb_disp_id_min + 1;
  tb_disp_id_max = tb_disp_id_max + 1;

  //ボタンの表示チェック
  butonCheck();
}

function butonCheck() {
  initButton();

  var left_obj = document.getElementById("leftbutton");
  if (tb_disp_id_min <= 1) {
    left_obj.style.display = "none";
  } else {
    if (left_obj.style.display == "none") {
      left_obj.style.display = "";
    }
  }
  var right_obj = document.getElementById("rightbutton");
  if (tb_disp_id_max >= 4) {
    right_obj.style.display = "none";
  } else {
    if (right_obj.style.display == "none") {
      right_obj.style.display = "";
    }
  }
}

//確定ボタン押下処理

function checkedOkButton() {
  DT = form_nm.YYYY.value;
  if (form_nm.MM.value < 10) {
    DT = DT + "0" + form_nm.MM.value;
  } else {
    DT = DT + form_nm.MM.value;
  }
  if (form_nm.DD.value < 10) {
    DT = DT + "0" + form_nm.DD.value;
  } else {
    DT = DT + form_nm.DD.value;
  }
  document.form_nm.ymd.value = DT;
  document.form_nm.action = "/stagia/reserve/gml_z_date_sel";
  document.form_nm.submit();
}

function goto_amenity_display() {
  document.form_nm.action = "gml_z_amenity_display";
  document.form_nm.u_genzai_idx.value = 7;

  if (
    typeof document.HIDUKEFORM.yoyakuinfo != "undefined" &&
    typeof document.HIDUKEFORM.yoyakuinfo.value != "undefined"
  ) {
    document.form_nm.yoyakuinfo.value = document.HIDUKEFORM.yoyakuinfo.value;
  }

  document.form_nm.submit();
}

function clickCANCEL(index) {
  document.form_nm.action = "gml_z_datetime_cancel#list";
  document.form_nm.u_genzai_idx.value = 6;
  document.form_nm.g_index.value = index;
  document.form_nm.submit();
}

function gotoFutesise(index) {
  document.form_nm.g_index.value = index;
  document.form_nm.action = "gml_z_attach_list";
  document.form_nm.submit();
}
function clickOK() {
  document.form_nm.action = "gml_z_money_conf";
  // ↓Add 2015.11.04 Stagia1.0.0開発(23区カスタマイズ)  by ou 42-1
  if (document.getElementById("ryosyuhhSelect") != undefined) {
    document.form_nm.ryosyuhh.value =
      document.getElementById("ryosyuhhSelect").value;
  }
  // ↑Add 2015.11.04 Stagia1.0.0開発(23区カスタマイズ)  by ou 42-1

  document.form_nm.submit();
}

// click yobi
function clickYobi(index) {
  var youbi = document.fmDate.u_yobi;
  var ckbox = document.fmDate.chkbox;

  //Set youbi value
  if (youbi[index].value == "") {
    if (index == 7) {
      youbi[index].value = "10";
      ckbox[index].checked = true;
    } else {
      youbi[index].value = "" + index;
      ckbox[index].checked = true;
    }
  } else {
    youbi[index].value = "";
  }
}

var selYear;
var selMonth;
var selDay;

var min_year = 2025;
var min_month = "04"; // original was 04 not sure why it worked
var min_day = "01"; // original was 01 not sure why it worked
var max_year = 2025;
var max_month = "06"; // original was 06 not sure why it worked
var max_day = 30;

function initDate(year, month) {
  //予約状況チェック
  butonCheck();

  selYear = window.document.getElementById("YYYY");
  selMonth = window.document.getElementById("MM");
  selDay = window.document.getElementById("DD");

  //Init year

  var aryYear = new Array();
  var aryYearJp = new Array();
  aryYear[0] = 2025;
  aryYearJp[0] = "令和07";
  for (var i = 0; i < aryYear.length; i++) {
    var op = document.createElement("OPTION");
    op.value = aryYear[i];
    op.innerHTML = aryYearJp[i];

    if (20250330 != null) {
      if (op.value == 2025) {
        op.selected = true;
      }
    }

    selYear.appendChild(op);
  }

  //Init other dates
  changeYear();
}
function changeYear() {
  year = selYear.value;
  if (max_year == min_year) {
    writeMonth(min_month, max_month);
  } else {
    if (year == min_year) {
      writeMonth(min_month, 12);
    } else if (year == max_year) {
      writeMonth(1, max_month);
    } else {
      writeMonth(1, 12);
    }
  }
  changeDay();
}
function changeDay() {
  year = selYear.value;
  month = selMonth.value;
  //ChangeDay
  var maxDate = new Date(year, month, 0).getDate();
  if (min_year == max_year && min_month == max_month) {
    writeDay(min_day, max_day);
  } else {
    if (year == min_year && month == min_month) {
      writeDay(min_day, maxDate);
    } else if (year == max_year && month == max_month) {
      writeDay(1, max_day);
    } else {
      writeDay(1, maxDate);
    }
  }
}

function writeMonth(min, max) {
  selMonth.length = 0;
  for (var i = min; i < max + 1; i++) {
    var op = document.createElement("OPTION");
    op.value = i;
    if (i < 10) {
      op.innerHTML = "0" + i;
    } else {
      op.innerHTML = "" + i;
    }

    if (20250330 != null) {
      if (op.value == 3) {
        op.selected = true;
      }
    }

    selMonth.appendChild(op);
  }
}

function writeDay(min, max) {
  selDay.length = 0;
  for (var i = min; i < max + 1; i++) {
    var op = document.createElement("OPTION");
    op.value = i;
    if (i < 10) {
      op.innerHTML = "0" + i;
    } else {
      op.innerHTML = "" + i;
    }

    if (20250330 != null) {
      if (op.value == 30) {
        op.selected = true;
      }
    }

    selDay.appendChild(op);
  }
}

function initYoubi() {}

function search() {
  var date = document.fmDate.ymd;

  var selectdate = document.fmDate.selectdate;

  var _month = selMonth.value;
  var month = "";
  var _day = selDay.value;
  var day = "";
  if (_day < 10) {
    day = "0" + _day;
  } else {
    day = "" + _day;
  }
  if (_month < 10) {
    month = "0" + _month;
  } else {
    month = "" + _month;
  }
  date.value = "" + selYear.value + month + day;
  selectdate.value = "" + selYear.value + month + day;
  document.fmDate.submit();
}

function changeDspDay(url, idx, flg, dspDay) {
  document.chgDspDateFrm.action = url;
  document.chgDspDateFrm.u_genzai_idx.value = idx;

  document.chgDspDateFrm.hiduke_sousa_flg.value = flg;

  document.chgDspDateFrm.u_hyojibi.value = dspDay;

  document.chgDspDateFrm.showStartKoma.value = tb_disp_id_min;
  document.chgDspDateFrm.showEndKoma.value = tb_disp_id_max;

  if (document.HIDUKEFORM.yoyakuinfo) {
    document.chgDspDateFrm.yoyakuinfo.value =
      document.HIDUKEFORM.yoyakuinfo.value;
  }
  document.chgDspDateFrm.submit();
  return true;
}

function returnPrevPage() {
  if (true) {
    if (false) {
      document.bkFrm.action =
        "/stagia/reserve/gml_s_favorites_conf?u_genzai_idx=0&g_kinonaiyo=41";
    } else {
      document.bkFrm.action = "/stagia/reserve/gml_z_date_sel#gml_z_date_sel";
    }
    document.bkFrm.submit();
    return;
  }

  var isFlag = window.confirm("予約内容が破棄されます｡よろしいですか?");

  if (isFlag) {
    if (false) {
      document.bkFrm.action =
        "/stagia/reserve/gml_s_favorites_conf?u_genzai_idx=0&g_kinonaiyo=41";
    } else {
      document.bkFrm.action = "/stagia/reserve/gml_z_date_sel#gml_z_date_sel";
    }

    document.bkFrm.submit();
    return;
  }
}

function selChangeEiri(index) {
  var selectedEiri =
    document.getElementsByClassName("eirikasan")[index].selectedIndex;
  document.getElementsByClassName("g_erikasankbn")[index].options[
    selectedEiri
  ].selected = true;
  document.getElementsByClassName("g_erikasan")[index].options[
    selectedEiri
  ].selected = true;
}
