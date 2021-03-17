window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/serviceWorker.js');
        } catch (error) {
            console.error(error);
        }
    }

    await loadReleases();
});

async function loadReleases() {
    const response = await fetch('https://api.github.com/repos/microsoft/vscode/releases', {
        method: 'GET',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    const data = await response.json();
    const container = document.querySelector('#releases');

    container.innerHTML = data.map(toReleaseItem).join('\n');
}

function toReleaseItem(release) {
    return (
        `<div class="release-item">
            <a class="release-item-title" href="${release.html_url}" target="_blank">${release.name}</a>
            <div class="release-item-body">${marked(release.body)}</div>
        </div>`
    );
}
