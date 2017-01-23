var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
require("sdk/simple-prefs").on("", reloadPrefs);

//IP or hostname of dreambox
var dreamboxHost;
//Full file path to "youtube-dl" binary
var youtubedlPath;
//dreambox web interface access token
var dbToken;
//number of failures fetching the access token
var dbTokenFails = 0;

reloadPrefs();

function reloadPrefs()
{
    var prefs = require("sdk/simple-prefs").prefs;
    youtubedlPath = prefs.youtubedlPath;
    dreamboxHost  = prefs.dreamboxHost;
}

//toolbar button
var button = buttons.ActionButton({
  id: "dreambox-play-link",
  label: "Play video on Dreambox",
  icon: "./play-32.png",
  onClick: playCurrentTab
});
//context menu for links
var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
    label:   'Play linked video on Dreambox',
    context: contextMenu.SelectorContext('a[href]'),
    contentScript: 'self.on("click", function(node) {' +
                 '    self.postMessage(node.href);' +
                 '});',
    accesskey: 'x',
    onMessage: function (linkUrl) {
        playPageUrl(linkUrl);
    }
});

function playCurrentTab(state)
{
    console.log('active tab', tabs.activeTab.url);
    var pageUrl = tabs.activeTab.url;
    playPageUrl(pageUrl);
}

function playPageUrl(pageUrl)
{
    var child_process = require("sdk/system/child_process");
    var ytdl = child_process.spawn(
        youtubedlPath, ['--quiet', '--dump-json', pageUrl]
    );

    var json = '';
    var errors = '';
    ytdl.stdout.on('data', function (data) {
        json = json + data;
    });

    ytdl.stderr.on('data', function (data) {
        console.debug('youtube-dl stderr: ' + data.trim());
        if (data.substr(0, 7) != 'WARNING') {
            errors += "\n" + data.trim();
        }
    });

    ytdl.on('close', function (code) {
        if (code == -1) {
            showError('youtube-dl not found');
            return
        } else if (code != 0) {
            console.log('youtube-dl exit code ' + code);
            showError(
                'Failed to extract video URL with youtube-dl'
                + errors
            );
            return;
        }

        var data;
        try {
            data = JSON.parse(json);
        } catch (e) {
            showError('youtube-dl returned invalid JSON');
            return;
        }

        var videoUrl = null;
        data.formats.forEach(function (format) {
            if (format.format.toLowerCase().indexOf('hls') != -1) {
                return;
            }
            videoUrl = format.url;
        });

        if (videoUrl === null) {
            showError('No video URL found in youtube-dl JSON');
            return;
        }
        //we have a url. run dreambox
        playVideoOnDreambox(videoUrl);
    });
}

function playVideoOnDreambox(videoUrl)
{
    var dreamboxUrl = 'http://' + dreamboxHost
        + '/web/mediaplayerplay?file=4097:0:1:0:0:0:0:0:0:0:'
        + encodeURIComponent(videoUrl).replace('%3A', '%253A');
    console.log('dreambox url: ' + dreamboxUrl);

    var Request = require("sdk/request").Request;
    Request({
        url: dreamboxUrl,
        content: {
            sessionid: dbToken
        },
        onComplete: function (response) {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes
            if (response.status == 412) {
                //web interface requires an access token
                // fetch it and try to play the video again
                fetchAccessToken(
                    function() {
                        playVideoOnDreambox(videoUrl);
                    }
                );
            } else if (response.status == 0) {
                showError('Failed to connect to dreambox. Maybe wrong IP?');
            } else if (response.status > 399) {
                showError('Dreambox failed to play the movie');
                console.error('Dreambox play response status: ' + response.status);
            } else {
                //all fine
                console.log('Dreambox play response status: ' + response.status);
            }
        }
    }).post();
}

/**
 * Obtain an access token from the dreambox and store it
 * in the global dbToken variable.
 *
 * @param function replayFunc Function to call when the token has
 *                            been acquired successfully
 */
function fetchAccessToken(replayFunc)
{
    if (dbTokenFails > 0) {
        return;
    }

    dbTokenFails++;
    var Request = require("sdk/request").Request;
    Request({
        url: 'http://' + dreamboxHost + '/web/session',
        onComplete: function (response) {
            if (response.status != 200) {
                return;
            }
            var nStart = response.text.indexOf('<e2sessionid>') + 13;
            var nEnd   = response.text.indexOf('</e2sessionid>');
            if (nStart == -1 || nEnd == -1) {
                showError('Could not parse web interface token XML');
                return;
            }

            dbTokenFails = 0;
            dbToken = response.text.substring(nStart, nEnd);
            console.log('Acquired access token: ' + dbToken);
            replayFunc();
        }
    }).post();
}

/**
 * Show the error message in a notification popup window
 * @link https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
 */
function showError(msg)
{
    require("sdk/notifications").notify({
        title: "Error - Play video on Dreambox",
        text: encodeXmlEntities(msg.trim()),
        iconURL: "./play-32.png"
    });
    console.error('showError: ' + msg.trim());
}

/**
 * Encoding XML entities is necessary on Ubuntu 14.04 with Mate 1.8.2
 * If I don't do it, the message is empty.
 */
function encodeXmlEntities(str)
{
    return str.replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace('"', '&quot;')
        .replace("'", '&apos;');
};
