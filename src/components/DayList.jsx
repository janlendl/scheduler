import React from 'react';
import DayListItem from './DayListItem';

//component to render all the days on the left nav pane
export default function DayList(props) {
  const dayList = props.days.map((day) => {
    return (
        <DayListItem 
                key={day.id}
                name={day.name}
                spots={day.spots} 
                selected={day.name === props.value}
                setDay={props.onChange}
        />
    );
  });

  return (
    <ul>
      { dayList }   
    </ul>
  );
};