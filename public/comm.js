
function get(url, time_limit_ms=5000) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

    xhttp.open("GET", url);
    xhttp.send(); 
    setTimeout(() => {
      reject(`error GETting "${url}" after ${time_limit_ms} ms`);
    }, time_limit_ms);
  });
}

function post(url, dataStr, time_limit_ms=5000) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(this.responseText);
        }
      };

    xhttp.open("POST", url);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(dataStr); 
    setTimeout(() => {
      reject(`error POSTing "${url}" after ${time_limit_ms} ms`);
    }, time_limit_ms);
  });
}

let assets = null
const drawable = {}

async function getAllAssets() {
    assets = JSON.parse(await get("get_all_assets"))
}