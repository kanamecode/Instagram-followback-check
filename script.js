let followersHtml = '';
let followingHtml = '';

function processFiles() {
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear any previous results

    if (!fileInput.files.length) {
        alert("ZIPファイルを選択してください");
        return;
    }

    const zipFile = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const zipData = event.target.result;
        JSZip.loadAsync(zipData).then(function(zip) {
            // Get the specific files inside the zip
            const followersFile = zip.file("connections/followers_and_following/followers_1.html");
            const followingFile = zip.file("connections/followers_and_following/following.html");

            if (!followersFile || !followingFile) {
                resultDiv.innerHTML = '必要なファイルがZIP内に見つかりませんでした。';
                return;
            }

            Promise.all([ 
                followersFile.async("string"),
                followingFile.async("string")
            ]).then(function([followers, following]) {
                followersHtml = followers;
                followingHtml = following;
                const followersUsernames = extractUsernames(followersHtml);
                const followingUsernames = extractUsernames(followingHtml);
                const uniqueUsernames = getUniqueUsernames(followingUsernames, followersUsernames);

                if (uniqueUsernames.length > 0) {
                    displayResult(uniqueUsernames, "フォローされていない人が見つかりました。");
                } else {
                    resultDiv.innerHTML = 'フォローされていない人は見つかりませんでした。';
                }
            });
        });
    };
    reader.readAsArrayBuffer(zipFile);
}

function processFilesReverse() {
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear any previous results

    if (!fileInput.files.length) {
        alert("ZIPファイルを選択してください");
        return;
    }

    const zipFile = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const zipData = event.target.result;
        JSZip.loadAsync(zipData).then(function(zip) {
            // Get the specific files inside the zip
            const followersFile = zip.file("connections/followers_and_following/followers_1.html");
            const followingFile = zip.file("connections/followers_and_following/following.html");

            if (!followersFile || !followingFile) {
                resultDiv.innerHTML = '必要なファイルがZIP内に見つかりませんでした。';
                return;
            }

            Promise.all([ 
                followersFile.async("string"),
                followingFile.async("string")
            ]).then(function([followers, following]) {
                followersHtml = followers;
                followingHtml = following;
                const followersUsernames = extractUsernames(followingHtml);
                const followingUsernames = extractUsernames(followersHtml);
                const uniqueUsernames = getUniqueUsernames(followingUsernames, followersUsernames);

                if (uniqueUsernames.length > 0) {
                    displayResult(uniqueUsernames, "フォローしていない人が見つかりました。");
                } else {
                    resultDiv.innerHTML = 'フォローしていない人は見つかりませんでした。';
                }
            });
        });
    };
    reader.readAsArrayBuffer(zipFile);
}

function extractUsernames(html) {
    const regex = /<a[^>]+href="https:\/\/www.instagram.com\/([^\/]+)"/g;
    let match;
    const usernames = [];
    while ((match = regex.exec(html)) !== null) {
        usernames.push(match[1]);
    }
    return usernames;
}

function getUniqueUsernames(list1, list2) {
    return list1.filter(username => !list2.includes(username));
}

function displayResult(usernames, message) {
    const resultDiv = document.getElementById('result');
    const ul = document.createElement('ul');
    resultDiv.innerHTML = message;

    usernames.forEach((username, index) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = `${index + 1}.`;

        const link = document.createElement('a');
        link.href = `https://www.instagram.com/${username}`;
        link.textContent = username;
        link.target = "_blank";

        li.appendChild(span);
        li.appendChild(link);
        ul.appendChild(li);
    });

    resultDiv.appendChild(ul);
}
