function handleToolbarPlay()
{
    browser.tabs.query({currentWindow: true, active: true}).then(
        function (tabs) {
            playUrl(tabs.shift().url);
        }
    );
}

function handleMenuClick(event)
{
    if ('mediaType' in event && event.mediaType == "video") {
        playUrl(event.srcUrl);
    } else if ('linkUrl' in event) {
        playUrl(event.linkUrl);
    } else {
        console.error('No idea what to play here', event);
    }
}

function playUrl(url)
{
    browser.browserAction.setBadgeText({text: '⧗'});
    browser.browserAction.setBadgeTextColor({color: 'white'});
    browser.browserAction.setBadgeBackgroundColor({color: 'orange'});

    browser.storage.sync.get('proxyUrl').then((res) => {
        var proxyUrl = res.proxyUrl;
        console.log(url, proxyUrl);

        fetch(
            proxyUrl,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                //mode: 'no-cors',
                body: url
            }
        ).then(function (response) {
            console.log(response.ok);
            if (response.ok) {
                videoPlayOk(response);
            } else {
                videoPlayError(response);
            }
        }).catch(function (error) {
            //e.g. Network error (when no network available)
            showError(error.message);
        });
    });
}

function videoPlayOk(response)
{
    browser.notifications.create(
        'dreambox-playing',
        {
            type: 'basic',
            title: 'Play video on Dreambox',
            message: 'Video is playing now',
            iconUrl: 'icon.png'
        }
    );

    browser.browserAction.setBadgeText({text: '🗸'});
    browser.browserAction.setBadgeTextColor({color: 'white'});
    browser.browserAction.setBadgeBackgroundColor({color: 'green'});
    setBadgeRemovalTimeout();
}

function videoPlayError(response)
{
    response.text().then(function (text) {
        showError(text);
    });
}

function showError(message)
{
    console.log("Play error: ", message);

    browser.notifications.create(
        'dreambox-error',
        {
            type: 'basic',
            title: 'Error playing video',
            message: message,
            iconUrl: 'icon.png'
        }
    );

    browser.browserAction.setBadgeText({text: 'x'});
    browser.browserAction.setBadgeTextColor({color: 'white'});
    browser.browserAction.setBadgeBackgroundColor({color: 'red'});
    setBadgeRemovalTimeout();
}

function setBadgeRemovalTimeout()
{
    setTimeout(
        function () {
            browser.browserAction.setBadgeText({text:""});
        },
        5000
    );
}

//toolbar button
browser.browserAction.onClicked.addListener(handleToolbarPlay);

//context menu
browser.menus.create({
    id: "play-video-on-dreambox-link",
    title: "Play linked video on dreambox",
    contexts: ["link"],
    onclick: handleMenuClick,
    icons: {
        "16": "icon.png",
        "32": "icon.png",
    }
});
browser.menus.create({
    id: "play-video-on-dreambox-video",
    title: "Play this video on dreambox",
    contexts: ["video"],
    onclick: handleMenuClick,
    icons: {
        "16": "icon.png",
        "32": "icon.png",
    }
});
