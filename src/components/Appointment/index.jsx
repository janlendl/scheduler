  import React from 'react';
  import Header from './Header';
  import Show from './Show';
  import Empty from './Empty';
  import Form from './Form';
  import Status from './Status';
    
  import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
 
  export default function Appointment(props) {
    const { mode, transition, back } = useVisualMode (
      props.interview ? SHOW: EMPTY
    );

    const save = (name, interviewer) => {
      const interview ={
        student: name,
        interviewer
      };
      transition(SAVING);
      props.bookInterview(props.id, interview)
      .then(res => {
        transition(SHOW);
      });
    }

    return (
      <article className='appointment'>
        <Header time={props.time} />
          {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

          {mode === CREATE && 
            <Form 
            interviewers={props.interviewers} 
            onCancel={() => back(EMPTY)}
            onSave={save}
            />
          }
          
          {mode === SHOW && (
            <Show
                student={props.interview.student}
                interviewer={props.interview.interviewer}
            />
          )}

          {mode === SAVING && <Status message="Saving..."/>}
      </article>
    )
  }