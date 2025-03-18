import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const YouTubeData = ({ data, value }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!data || !data.snippet || !data.statistics) {
            setError('Failed to load video data. Please try again.');
        } else {
            setError(null);
        }
    }, [data]);

    const truncateDescription = (description, maxLength) => {
        return description.length > maxLength
            ? description.slice(0, maxLength) + '...'
            : description;
    };

    const formatNumber = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number;
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!data) {
        return <div>Loading video data...</div>;
    }

    return (
        <div className="video-data-container">
            <div className="video-content">
                <iframe
                    src={`https://www.youtube.com/embed/${data.id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube Video"
                ></iframe>
                <div className="video-description">
                    <h3>YouTube Video</h3>
                    <p><strong>Title:</strong> {data.snippet.title}</p>
                    <p><strong>Description:</strong> {truncateDescription(data.snippet.description, 140)}</p>
                    <p><strong>Published Date:</strong> {new Date(data.snippet.publishedAt).toLocaleDateString()}</p>
                    <p><strong><i className="fas fa-thumbs-up"></i> Likes:</strong> {formatNumber(data.statistics.likeCount)}</p>
                    <p><strong><i className="fas fa-comment"></i> Comments:</strong> {formatNumber(data.statistics.commentCount)}</p>
                    <p><strong><i className="fas fa-eye"></i> Views:</strong> {formatNumber(data.statistics.viewCount)}</p>
                </div>
            </div>
            {value && value.snippet && value.statistics && (
                <div className="channel-details">
                    <h3>Channel Details</h3>
                    <p><strong>Channel Name:</strong> {value.snippet.title}</p>
                    <p><strong>Total Subscribers:</strong> {formatNumber(value.statistics.subscriberCount)}</p>
                </div>
            )}
        </div>
    );
};

export default YouTubeData;
