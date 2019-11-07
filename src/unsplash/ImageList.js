import React from 'react';
import ImageCard from './ImageCard';

const ImageList = props => {
    // Get ImageCard with props
    // const images = props.images.map((id, urls, description) => {
    const images = props.images.map(image => {
        return <ImageCard key={image.id} image={image} />
    });

    return <div className="ui link cards" style={{width: "90%", margin: "auto"}}>{images}</div>
}

export default ImageList;