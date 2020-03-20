const express = require("express");

const app = express()

app.use(express.static('./public'))
app.use("/test_images", express.static('./test_images'))

app.listen(8080, (e) => {
    if (e) {
        throw e
    }

    console.log("Listen on port 8080.")
})