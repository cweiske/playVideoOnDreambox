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
    var ytdl = child_process.spawn(youtubedlPath, ['--get-url', pageUrl]);

    var videoUrl = null;
    ytdl.stdout.on('data', function (data) {
        videoUrl = data;
        console.log('youtube-dl URL: ' + data);
    });

    ytdl.stderr.on('data', function (data) {
        console.error('youtube-dl error: ' + data);
    });

    ytdl.on('close', function (code) {
        if (code == 0) {
            //we have a url. run dreambox
            playVideoOnDreambox(videoUrl);
        } else {
            console.error('youtube-dl exited with code ' + code);
        }
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
            if (response.status == 412) {
                //web interface requires an access token
                // fetch it and try to play the video again
                fetchAccessToken(
                    function() {
                        playVideoOnDreambox(videoUrl);
                    }
                );
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
                console.error('Could not parse token XML');
                return;
            }

            dbTokenFails = 0;
            dbToken = response.text.substring(nStart, nEnd);
            console.log('Acquired access token: ' + dbToken);
            replayFunc();
        }
    }).post();
}
