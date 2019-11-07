import React from 'react';

const ImageCard = props => {
    const desc = props.image.description ? props.image.description : "Description Not Available";
    // const alt = props.image.alt_description ? props.image.alt_description : "Alt Description Not Available";

    return (
        <div className="card">
            <div style={{
                width: "100%",
                height: "290px",
                backgroundImage: `url(${props.image.urls.regular})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50% 50%"
            }}>
                
            </div>
            <div className="content">
                <div className="header"><a href={props.image.links.html} target="_blank" rel="noopener noreferrer">Go To Image</a></div>
                <div className="description"><strong>Description: </strong>{desc}</div>
            </div>
        </div>
    )
}

export default ImageCard;