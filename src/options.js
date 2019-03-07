function saveOptions(e)
{
    browser.storage.sync.set(
        {
            proxyUrl: document.querySelector("#proxyUrl").value
        }
    );
    e.preventDefault();
}

function restoreOptions()
{
    var gettingItem = browser.storage.sync.get('proxyUrl');
    gettingItem.then((res) => {
        document.querySelector("#proxyUrl").value = res.proxyUrl || null;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
