import { useState, useEffect } from 'react';
import axios from 'axios';


export default function useApplicationData() {

// pass an object to useState
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    const daysData = '/api/days';
    const apptData = '/api/appointments';
    const interviewersData = '/api/interviewers';

  // use Promise all to get days and appointment data
  Promise.all([
    axios.get(daysData),
    axios.get(apptData),
    axios.get(interviewersData)
  ]).then((all) => {
    setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    console.log(all);
  })
    .catch((error) => {
      console.log('ERR status: ',error.status);
      console.log('ERR message: ',error.message);
    });
  }, []);


  const bookInterview = (id, interview) => {
    console.log('bookInterview Data: ',id, interview);  
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      console.log('Status message:', res.status);
      console.log('Data:', res.data);
      setState({...state,appointments});
      console.log('Appointment Created!');
    })
    .catch(err => {
      console.log('ERR Status: ', err.status);
      console.log('ERR message: ', err.message);
      return Promise.reject(err);
    });
  }
      
  const cancelInterview = (id, interview) => {
    console.log('cancelInterview Data: ', id, interview);
    
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    return axios.delete(`/api/appointments/${id}`)
    .then(res => {
      console.log('Status message:', res.status);
      console.log('Data:', res.data);
      setState({...state,appointments});
      console.log('Appointment Deleted!');
    })
    .catch(err => {
      console.log('ERR Status: ', err.status);
      console.log('ERR Message: ', err.message);
      return Promise.reject(err);
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
}