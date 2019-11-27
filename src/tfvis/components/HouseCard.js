import React from 'react';
import faker from 'faker';

const HouseCard = props => {
    const { house } = props;
    return (
        <div className="card">
            <div className="content">
                <img className="right floated mini ui image" src={faker.image.avatar()} alt={faker.lorem.sentence()} />
                <div className="header">
                    Contact:<br />
                    {faker.name.findName()}                    
                </div>
                <div className="meta" style={{marginTop: "5px"}}>
                    <strong>Address:</strong><br />
                    <div style={{paddingLeft: "7px"}}>
                        {faker.address.streetAddress("###")}<br />
                        {faker.address.city()}, {faker.address.state()}
                    </div>
                    <strong>Details:</strong><br />
                    <div style={{paddingLeft: "7px"}}>
                        Bedrooms: {house.bedrooms}<br />
                        Bathrooms: {house.bathrooms}<br />
                        Price: {house.price}
                    </div>
                </div>
            </div>
            <div className="ui bottom attached button">
                Learn More
            </div>
        </div>
    )
}

export default HouseCard;