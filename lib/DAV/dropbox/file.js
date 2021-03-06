/*
 * @package jsDAV
 * @subpackage DAV
 * @copyright Copyright(c) 2011 Ajax.org B.V. <info AT ajax DOT org>
 * @author Mike de Boer <info AT mikedeboer DOT nl>
 * @license http://github.com/mikedeboer/jsDAV/blob/master/LICENSE MIT License
 */
"use strict";

var jsDAV_Dropbox_Node = require("./node").jsDAV_Dropbox_Node;
var jsDAV_iFile = require("./../iFile").jsDAV_iFile;

var Util = require("./../util");

function jsDAV_Dropbox_File(path, client) {
    this.path = path;
    this.client = client;
}

exports.jsDAV_Dropbox_File = jsDAV_Dropbox_File;

(function() {
    this.implement(jsDAV_iFile);

    /**
     * Updates the data
     *
     * @param {mixed} data
     * @return void
     */
    this.put = function(data, type, cbfsput) {
        var self = this;
        this.client.put(this.path, data, function(status, res) {
            if (self.client.isError(status))
                return cbfsput(res.error);
            cbfsput();
        });
    };

    /**
     * Returns the data
     *
     * @return Buffer
     */
    this.get = function(cbfsfileget) {
        if (this.$buffer)
            return cbfsfileget(null, this.$buffer);
        var self = this;
        this.client.get(this.path, function(status, res) {
            if (self.client.isError(status))
                return cbfsfileget(res.error);
            cbfsfileget(null, res);
        });
    };

    /**
     * Delete the current file
     *
     * @return void
     */
    this["delete"] = function(cbfsfiledel) {
        var self = this;
        this.client.rm(this.path, function(status, res) {
            if (self.client.isError(status))
                cbfsfiledel(res.error);
            cbfsfiledel();
        });
    };

    /**
     * Returns the size of the node, in bytes
     *
     * @return int
     */
    this.getSize = function(cbfsgetsize) {
        if (this.$stat)
            return cbfsgetsize(null, this.$stat.size);
        var self = this;
        this.client.metadata(this.path, function(status, stat) {
            if (self.client.isError(status))
                return cbfsgetsize(stat.error);
            cbfsgetsize(null, stat.bytes);
        });
    };

    /**
     * Returns the ETag for a file
     * An ETag is a unique identifier representing the current version of the file.
     * If the file changes, the ETag MUST change.
     * Return null if the ETag can not effectively be determined
     *
     * @return mixed
     */
    this.getETag = function(cbfsgetetag) {
        cbfsgetetag(null, null);
    };

    /**
     * Returns the mime-type for a file
     * If null is returned, we'll assume application/octet-stream
     *
     * @return mixed
     */
    this.getContentType = function(cbfsmime) {
        return cbfsmime(null, Util.mime.type(this.path));
    };
}).call(jsDAV_Dropbox_File.prototype = new jsDAV_Dropbox_Node());
