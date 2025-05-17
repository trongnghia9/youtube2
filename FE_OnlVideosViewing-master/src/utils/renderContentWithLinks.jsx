// src/utils/renderContentWithLinks.js
import React from "react";

export const renderContentWithLinks = (text) => {
    if (!text) return null;

    const result = [];
    const urlRegex = /(?:https?:\/\/|www\.)[^\s]+/g;

    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        const { index } = match;
        const url = match[0];

        // Thêm đoạn văn bản trước link
        if (lastIndex < index) {
            result.push(
                <span key={lastIndex}>{text.slice(lastIndex, index)}</span>
            );
        }

        // Thêm link
        let href = url.startsWith("http") ? url : `https://${url}`;
        result.push(
            <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="theme-text-second hover:opacity-80 italic underline duration-500 break-words">{url}</a>
        );

        lastIndex = index + url.length;
    }

    // Thêm phần còn lại (sau link cuối)
    if (lastIndex < text.length) {
        result.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return result;
};