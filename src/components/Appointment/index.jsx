  import React from 'react';
  import Header from './Header';
  import Show from './Show';
  import Empty from './Empty';
  import Form from './Form';
  import Status from './Status';
  import Confirm from './Confirm';
    
  import './styles.scss';
  import useVisualMode from 'hooks/useVisualMode';

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';
 
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
      .then(() => {
        transition(SHOW);
      });
    }

    const cancel = () => {
      transition(CONFIRM);
      props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      });
      transition(DELETING);
    };


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
                onDelete={() => transition(CONFIRM)}
                onEdit={() => transition(EDIT)}
            />
          )}

          {mode === SAVING && <Status message="Saving..."/>}
          {mode === DELETING && <Status message="Deleting..."/>}
          {mode === CONFIRM && 
            <Confirm 
              onConfirm={cancel}
              onCancel={() => back()}
              message="Are you sure you like to delete?"
            />
          }

          {mode === EDIT &&
            <Form 
              student={props.interview.student} 
              interviewer={props.interview.interviewer.id}
              interviewers={props.interviewers}
              onCancel={() => back(EMPTY)}
              onSave={save}
            />     
          }
      </article>
    )
  }

  