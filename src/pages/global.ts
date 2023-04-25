

if (process.env.NODE_ENV === 'development') {
}else{
  console.log = function () { };
  //禁用右键菜单;
  document.oncontextmenu = function () { return false; };
  //禁用网页上选取的内容；
  document.onselectstart = function () { return false; };
  document.onpaste = function () { return false; };
  document.oncopy = function () { return false; };
  document.oncut = function () { return false; };
  
}

console.info(process.env.NODE_ENV, `version: ${Version}`);