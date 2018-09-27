var mongooseDrv = require("mongoose");
var schema = mongooseDrv.Schema;
mongooseDrv.connect('mongodb://localhost/filesDB', { useMongoClient: true });
var connection = mongooseDrv.connection;
 
if (connection !== "undefined") {
    console.log(connection.readyState.toString());
    var path = require("path");
    var grid = require("gridfs-stream");
    var fs = require("fs");
    var videosrc = path.join(__dirname, "./filestowrite/celibration_write.mp4");
    Grid.mongo = mongooseDrv.mongo;
    connection.once("open", () => {
        console.log("Connection Open");
        var gridfs = grid(connection.db);
        if (gridfs) {
            var fsstreamwrite = fs.createWriteStream(
                path.join(__dirname, "./filestowrite/afl.mp4")
            );
 
            var readstream = gridfs.createReadStream({
                filename: "afl.mp4"
            });
            readstream.pipe(fsstreamwrite);
            readstream.on("close", function (file) {
                console.log("File Read successfully fro database");
            });
        } else {
            console.log("Sorry No Grid FS Object");
        }
    });
} else {
 
    console.log('Sorry not connected');
}
console.log("done");
