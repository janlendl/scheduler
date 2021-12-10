import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';


export default function Form(props) {
  const [ student, setStudent ] = useState(props.student || '');
  const [ interviewer, setInterviewer ] = useState(props.interviewer || null);
  const [error, setError] = useState('');

  // sets everything in the form to blank
  const reset = () => {
    setStudent('');
    setInterviewer(null);
  };

  const cancel = () => {
    setError('');
    reset();
    props.onCancel();
  };

// edge case check if student name is blank and if interviewer is not selected
  const validate = () => {
    if (student === '') {
      setError('Student name cannot be blank');
      return;
    }
    setError('');
    props.onSave(student, interviewer);
  }
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form 
          autoComplete="off" 
          onSubmit={event => {
              event.preventDefault();
              validate();
            }}
        >
          <input
            className="appointment__create-input text--semi-bold"
            name='student'
            type="text"
            placeholder="Enter Student Name"
            value={ student }
            onChange={(event) => setStudent(event.target.value)}
            data-testid='student-name-input'
            />
        </form>
        <section className='appointment__validation'>{error}</section>
        <InterviewerList
          interviewers={ props.interviewers }
          value= { interviewer }
          onChange={ setInterviewer }
          />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={ () => validate() }>Save</Button>
        </section>
      </section>
  </main>  
  );
};