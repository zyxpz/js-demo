function tmpl(str, data) {

  const string = "var p = []; p.push('" +
  str.innerHTML
  .replace(/[\r\t\n]/g, "")
  .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
  .replace(/<%/g, "');")
  .replace(/%>/g, "p.push('")
  + "');console.log(p)"

  eval(string);

  console.log(string);

  return p.join('');
}