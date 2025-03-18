import React, { useState } from 'react';
import axios from 'axios';
import { identifyPlatform, extractVideoId } from './Util';
import YouTubeData from './YouTube';
import './Style.css'; // Import the styles

export const Input = () => {
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState('');
    const [videoId, setVideoId] = useState(null);
    const [data, setData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleFetchData();
        }
    };

    // const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    // Replace with your actual API key

    const handleFetchData = async () => {
        setData(null);
        setChannelData(null);
        setVideoId(null);
        setLoading(true);
        setError(null);

        try {
            const detectedPlatform = identifyPlatform(url);
            setPlatform(detectedPlatform);

            if (detectedPlatform === 'Unknown') {
                setError('Unsupported platform. Please provide a valid YouTube URL.');
                setLoading(false);
                return;
            }

            if (detectedPlatform === 'YouTube') {
                const id = extractVideoId(url);
                if (!id) {
                    setError('Failed to extract YouTube video ID. Please check the URL and try again.');
                    setLoading(false);
                    return;
                }
                setVideoId(id);

                const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${YOUTUBE_API_KEY}`);
                const videoDetails = response.data.items[0];
                if (!videoDetails) {
                    setError('Failed to fetch YouTube video details. The video may not exist or be private.');
                    setLoading(false);
                    return;
                }
                setData(videoDetails);

                const channelId = videoDetails.snippet.channelId;
                const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`);
                if (channelResponse.data.items.length > 0) {
                    setChannelData(channelResponse.data.items[0]);
                }
            } else {
                setError('Unsupported platform. Please provide a valid YouTube URL.');
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error(`Error fetching ${platform} data:`, error);
            setError(`An error occurred while fetching data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>You Tube Scraper</h1>
            <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter YouTube URL"
            />
            <button onClick={handleFetchData}>Fetch Data</button>
            {loading && <p>Loading data...</p>}
            {error && <p>{error}</p>}
            {platform && <h2>Detected Platform: {platform}</h2>}
            {data && !loading && !error && <YouTubeData data={data} value={channelData} />}
        </div>
    );
};
