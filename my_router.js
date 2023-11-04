var express = require('express');
var router = express.Router();
const fs = require('fs')

router.get('/get_all_assets', async function(req, res) {
    const rtn = {}
    const dir = await fs.promises.opendir("public/assets")
    for await (const dirent of dir) {
        if (dirent.name.length == 0 || dirent.name[0] == ".") continue
        const dir2 = await fs.promises.opendir(`public/assets/${dirent.name}`)
        for await (const dirent2 of dir2) {
        const filedir = `public/assets/${dirent.name}/${dirent2.name}`
        rtn[`${dirent.name}/${dirent2.name}`] = fs.readFileSync(filedir, 'utf8')
        }
    }
    const all_assets = JSON.stringify(rtn)
    res.send(all_assets)
});

router.get('/webGL/:filename', function(req, res) {
  res.sendFile(__dirname + "/public/webGL/" + req.params.filename)
})

router.get('/Drawers/:filename', function(req, res) {
  res.sendFile(__dirname + "/public/Drawers/" + req.params.filename)
})

router.get('/:filename', function(req, res) {
  res.sendFile(__dirname + "/public/" + req.params.filename)
})

router.get('/', function(req, res){
   res.sendFile(__dirname + '/public/main.html');
});

module.exports = router;