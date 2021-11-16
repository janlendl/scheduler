  import React from 'react';
  import './styles.scss'
  import classNames from 'classnames';


  export default function Appointment(props) {
    return (
      <article className='appointments'>
        {!props.time && 'No Appointments'}
        {props.time && `Appointment at ${props.time}` }
      </article>
    )
  }