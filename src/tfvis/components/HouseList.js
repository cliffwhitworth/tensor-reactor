import React from 'react';
import HouseCard from './HouseCard';
import useResources from './useResources';

const HouseList = props => {
    const houses = useResources('kc_house_data.csv').map(house => {
        return <HouseCard key={house.id} house={house} />
    });

    return <div className="ui cards">{houses}</div>
}

export default HouseList;