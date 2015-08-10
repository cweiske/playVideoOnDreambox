var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
require("sdk/simple-prefs").on("", reloadPrefs);

var dreamboxHost;
var youtubedlPath;
reloadPrefs();

function reloadPrefs()
{
    var prefs = require("sdk/simple-prefs").prefs;
    youtubedlPath = prefs.youtubedlPath;
    dreamboxHost  = prefs.dreamboxHost;
}

var button = buttons.ActionButton({
  id: "dreambox-play-link",
  label: "Play video on Dreambox",
  icon: "./play-32.png",
  onClick: handleClickPlay
});

function handleClickPlay(state)
{    
    console.log('active tab', tabs.activeTab.url);
    var pageUrl = tabs.activeTab.url;

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
    var latestTweetRequest = Request({
        url: dreamboxUrl/*,
        onComplete: function (response) {
            //console.error(response);
        }*/
    }).get();
}
