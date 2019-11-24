/**
 * Sync two files base on their computed hash rather than just size or timestamp
 * usage: sync(file1, file2, [algo], callback);
 * where:
 *    file1 - required string path to file 1
 *    file2 - required string path to file 2
 *    algo - option string algorithm for hash computation
 *    callback - required callaback(copied, err)
 *    where: 
 *       copied - boolean indicating if copy succeeded
 *       err - Error if there was a problem with the copy
 */
exports.sync = function() {
    var Args = require("vargs").Constructor;

    /**
     * Common argument checking for crop and resize
     */
    function checkCommonArgs(args) {
        if (args.length < 2) throw new Error("File1, File2, and callback required");
        if (typeof args.at(1) != "string") throw new Error("File2 required");
        if (typeof args.at(0) != "string") throw new Error("File1 required");
        if (!args.callbackGiven()) throw new Error("Callback required");
    }
    var args = new Args(arguments);
    checkCommonArgs(args);
    var file1 = args.at(0);
    var file2 = args.at(1);
    var algo = "sha1";
    var callback = args.callback;
    if (args.length === 3) {
        if (typeof args.at(2) !== "string") throw new Error("Algorithm must be a string");
        algo = args.at(2);
    } else if (args.length > 3) {
        throw new Error("Invalid args length: " + args.length);
    }
    var ch = require("file-compare");
    ch.compare(file1, file2, algo, function(filesSame, err) {
        if (!filesSame && !err) {
            copyFiles(file1, file2, function(filesCopied, err) {
                callback(filesCopied, err);
            });
        } else {
            callback(false, err);
        }
    });
    /**
     * Copy file1 to file2
     */
    function copyFiles(srcfile, dstfile, callback) {
        var fs = require("fs");
        var rs = fs.createReadStream(srcfile);
        var ws = fs.createWriteStream(dstfile);
        rs.on("data", function(d) {
            ws.write(d);
        });
        rs.on("end", function() {
            ws.end();
            callback(true);
        });
    }
};
