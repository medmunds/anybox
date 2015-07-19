var child_process = require('child_process');
var escapeRegExp = require('lodash.escaperegexp');
var expandHomeDir = require('expand-home-dir');
var fs = require('fs');
var gulp = require('gulp');
var identity = require('lodash.identity');
var mkdirp = require('mkdirp');
var ncp = require('ncp');
var os = require('os');
var packager = require('electron-packager');
var path = require('path');
var rimraf = require('rimraf');

var currentPlatform = os.platform();

var electronVersion = require('electron-prebuilt/package.json').version;
var appName = require('./src/config.js').appName;
var projectName = require('./package.json').name;
var appVersion = require('./package.json').version;


var srcDir = '.'; // everything from here will get copied into the app (filtered by ignore and prune below)
var buildDir = './build';

var iconFiles = {
    'darwin': './' + projectName + '.icns',
    'linux': undefined,
    'windows': './' + projectName + '.ico'
};

var installDirs = {
    'darwin': expandHomeDir('~/Applications'), // LOCALIZATION ISSUE?
    'linux': expandHomeDir('~/bin'),
    'windows': undefined // GetFolderPath(Environment.ProgramFiles)
};

// Ugh. Needs to match electron-packager output:
var executableNames = {
    'darwin': appName + '.app',
    'linux': appName,
    'windows': appName + '.exe'
};


gulp.task('default', ['build']);


gulp.task('clean', function(cb) {
    rimraf(buildDir, cb);
});


gulp.task('build', ['clean'], function(cb) {
    return build(currentPlatform, cb);
});

gulp.task('build-mac', function(cb) {
    return build('darwin', cb);
});

gulp.task('build-win', function(cb) {
    return build('windows', cb);
});

gulp.task('build-linux', function(cb) {
    return build('linux', cb);
});


gulp.task('install', function(cb) {
    return install(currentPlatform, cb);
});


gulp.task('list-ignored', function() {
    // helpful for debugging ignore list
    console.log(getIgnored());
});



function build(platform, cb) {
    var ignored = getIgnored(),
        arch = 'x64';  // just always build x64 for now
    mkdirp(buildDir, function(err) {
        if (err) return cb(err);
        packager({
            // Input
            dir: '.', // source dir
            ignore: ignored, // array of regexps for sources to exclude -- *not* cwd-relative
            prune: true, // npm prune devDependencies out of app
            version: electronVersion,

            // Output
            out: buildDir, // dest dir -- must exist
            platform: platform,
            arch: arch,
            name: appName,
            icon: iconFiles[platform],
            asar: false, // bundles app source into an asar

            // Mac-specific packaging:
            //'app-bundle-id': "com.example.myapp", // default 'com.electron.' + opts.name.toLowerCase()
            //'helper-bundle-id': "com.example.myapp.helper",  // default 'com.electron.' + opts.name.toLowerCase() + '.helper'
            'app-version': appVersion // default none
            //sign: '' // OS X codesign identity

            // Windows-specific packaging:
            // 'version-string': { 'ProductVersion': appVersion, 'ProductName': projectName, etc. }

        }, function(err, finalPath) {
            if (err) return cb(err);
            console.log("Completed building " + finalPath);
            return cb(null, finalPath);
        });
    });
}

function install(platform, cb) {
    var installDir = installDirs[platform],
        executableName = executableNames[platform];
    if (!installDir || !executableName) {
        return cb(new Error("Don't know how to install on platform " + platform));
    }

    var buildSubDir = projectName + '-' + platform + '-x64'; // Grr: electron-packager started auto-creating subdirs of build

    var builtApp = path.join(buildDir, buildSubDir, executableName),
        installedApp = path.join(installDir, executableName);
    // Make sure it's built before we delete the old one...
    fs.access(builtApp, fs.R_OK, function(err) {
        if (err) return cb(err);
        rimraf(installedApp, function(err) {
            if (err) return cb(err);
            ncp(builtApp, installedApp, function(err) {
                if (err) return cb(err);
                console.log("Installed to " + installedApp);
                return cb(null, installedApp);
            });
        });
    });
}


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
    ignored.push(makeIgnoreRegExp(buildDir));

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

