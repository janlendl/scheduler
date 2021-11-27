  import React from 'react';
  import Header from './Header';
  import Show from './Show';
  import Empty from './Empty';
  import Form from './Form';
  import Status from './Status';
  import Confirm from './Confirm';
  import Error from './Error';
    
  import './styles.scss';
  import useVisualMode from 'hooks/useVisualMode';

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';
 
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
          transition(SHOW)
        })
        .catch((err) => {
          console.log('Error on saving: ', err);
          transition(ERROR_SAVE, true)
        });
    }

    const cancel = () => {
      transition(DELETING);
      props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        console.log('Error on deleting: ', err);
        transition(ERROR_DELETE, true);
      });
    };

  // Appointment component handles transition between modes
    return (
      <article className='appointment'>
        <Header time={props.time} />
          {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

          {mode === CREATE && 
            <Form 
            interviewers={props.interviewers} 
            onCancel={() => back()}
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

          {mode === EDIT &&
            <Form 
            student={props.interview.student} 
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onCancel={() => back()}
            onSave={save}
            />     
          }

          {mode === CONFIRM && 
            <Confirm 
            onConfirm={cancel}
            onCancel={() => back()}
            message="Are you sure you like to delete?"
            />
          }

          {mode === SAVING && <Status message="Saving..."/>}
          {mode === ERROR_SAVE &&
            <Error 
              message='Could not save appointment'
              onClose={() => back()} 
            />
          }

          {mode === DELETING && <Status message="Deleting..."/>}
          {mode === ERROR_DELETE &&
            <Error 
              message='Could not cancel appointment'
              onClose={() => back()} 
            />
          }

      </article>
    )
  }

  