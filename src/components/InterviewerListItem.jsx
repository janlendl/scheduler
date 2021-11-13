import React from 'react';
import 'components/InterviewerListItem.scss';
import classNames from 'classnames';

export default function InterviewerListItem(props) {

  const interviewClass  = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected === true,
  });


  const showName = () => {
    if (props.selected === true) {
      return props.name;
    }
  };

  return (
    <li className={ interviewClass } onClick={() => props.setInterviewer(props.id)}>
      <img
        className='interviewers__item-image'
        src={ props.avatar }
        alt={ props.name }
      />
      { showName() }
    </li>
  );
};