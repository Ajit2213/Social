// src/utils.js
// src/utils.js
export const identifyPlatform = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        return 'YouTube';
    } else if (urlObj.hostname === 'youtu.be') {
        return 'YouTube';
    }
    return 'Unknown';
};

export const extractVideoId = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
        if (urlObj.searchParams.get('v')) {
            return urlObj.searchParams.get('v'); // Regular YouTube video URL
        } else if (urlObj.pathname.includes('/shorts/')) {
            return urlObj.pathname.split('/shorts/')[1]; // YouTube Shorts URL
        }
    } else if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1); // YouTube short URL
    }
    return null
}
















