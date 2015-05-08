var child_process = require('child_process');
var escapeRegExp = require('lodash.escaperegexp');
var gulp = require('gulp');
var identity = require('lodash.identity');
var mkdirp = require('mkdirp');
var packager = require('electron-packager');
var path = require('path');

var electronVersion = require('electron-prebuilt/package.json').version;
var projectVersion = require('./package.json').version;
var projectName = require('./package.json').name;
var productName = require('./src/config.js').appName;

var srcDir = '.'; // everything from here will get copied into the app (filtered by ignore and prune below)
var distDir = './dist';


gulp.task('distdirs', function(cb) {
    mkdirp(distDir, cb);
});


gulp.task('list-ignored', function() {
    console.log(getIgnored());
});


gulp.task('build', ['distdirs'], function(cb) {
    var ignored = getIgnored();
    packager({
        dir: '.', // source dir
        out: distDir, // dest dir -- must exist
        name: productName,
        ignore: ignored, // array of regexps for sources to exclude -- *not* cwd-relative
        prune: true, // npm prune devDependencies out of app
        asar: false, // bundles app source into an asar

        // Mac-specific packaging:
        //icon: "./src/assets/app.icns",
        //'app-bundle-id': "com.example.myapp", // default 'com.electron.' + opts.name.toLowerCase()
        //'helper-bundle-id': "com.example.myapp.helper",  // default 'com.electron.' + opts.name.toLowerCase() + '.helper'
        'app-version': projectVersion // default none
        //protocols: [{ schemes: ["scheme"], name: "name" }, ... ],
    }, cb);
});


function getIgnored() {
    // Return an array of RegExp matching files that would be ignored by git,
    // and other things we don't want to include in our app bundle.
    var gitIgnorePattern = /^!!\s+(.*)$/,
        gitIgnored = child_process.execSync('git status --ignored --porcelain', {timeout: 5000}),
        ignored = gitIgnored.toString().split('\n').map(function(line) {
            var matches = gitIgnorePattern.exec(line),
                file = matches && matches[1],
                result = undefined;
            // keep node and bower packages
            if (file && !/^(node_modules|bower_components)/.test(file)) {
                result = makeIgnoreRegExp(file);
            }
            return result;
        }).filter(identity);

    // ignore our own built apps:
    ignored.push(makeIgnoreRegExp(distDir));

    // ignore .git and .gitignore anywhere in the tree:
    ignored.push(/(^|\/)\.git$/);
    ignored.push(/(^|\/)\.gitignore$/);

    return ignored;
}

function makeIgnoreRegExp(file) {
    // create a RegExp to ignore file, suitable for electron-packager.
    // electron-packager ignore requires absolute paths
    var ignorePath = path.isAbsolute(file) ? file :  path.join(process.cwd(), file);
    if (ignorePath[ignorePath.length-1] == path.sep) {
        // Remove trailing / (or we'll fail to ignore the directory itself)
        ignorePath = ignorePath.slice(0, -1);
    }
    return new RegExp('^' + escapeRegExp(ignorePath));
}
