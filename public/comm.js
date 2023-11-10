
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


function check_for_drawables_after_delay(delay) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      let allDone = true
      for (const key in drawable) {
        allDone &= drawable[key].complete && drawable[key].naturalWidth !== 0
      }
      resolve(allDone)
    }, delay)
  })
}


async function getAllAssets() {
    assets = JSON.parse(await get("get_all_assets"))
    const drawable_files_obj = JSON.parse(await get("get_drawable_filenames"))
    for (const dr in drawable_files_obj) {
      drawable[dr] = new Image()
      drawable[dr].src = drawable_files_obj[dr]
    }
    let allDrawablesLoaded = false;
    do {
      allDrawablesLoaded = await check_for_drawables_after_delay(50)
    } while (!allDrawablesLoaded)

}