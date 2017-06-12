var express = require('express')
var router = express.Router()
var fs = require('fs')

router.get('/test', (req, res) => {
	var filePath = 'C:\\logtest.txt'
	var content = fs.readFileSync(filePath, 'utf8')

	console.log(content)
	res.send("Test :)" + content)
})

module.exports = router