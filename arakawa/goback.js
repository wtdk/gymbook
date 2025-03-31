function goBack(eventMenuId) {
  var isFlag = "";
  if (true) {
    isFlag = window.confirm("予約内容が破棄されます｡よろしいですか?");
  } else if (false) {
    isFlag = window.confirm("抽選申込内容が破棄されます｡よろしいですか?");
  } else if (false) {
    isFlag = window.confirm("予約内容が破棄されます｡よろしいですか?");
  } else {
    isFlag = true;
  }

  if (isFlag) {
    window.location.href = eventMenuId;
  }
}
