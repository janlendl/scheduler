import { useState, useEffect } from 'react';
import axios from 'axios';
import { getSpots } from 'helpers/selectors';


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


  const bookInterview = (id, interview, updateSpots = false) => {
    console.log('bookInterview Data: ',id, interview);  

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
  
  // passes the new appointments
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [...state.days];
  
    // this checks if the mode is on EDIT, it will not update the spots
    if (updateSpots === true) {
      const index = state.days.findIndex(day => day.name === state.day);
      const spots = getSpots(state, state.day);
  
    // passes the new spots value to the days array
      const day = {...state.days[index], spots: spots - 1};
  
      days.splice(index, 1, day);
    }

    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      console.log('Status message:', res.status);
      setState({...state,appointments, days: days});
      console.log('Appointment Created!');
    })
    .catch(err => {
      console.log('ERR Status: ', err.status);
      console.log('ERR message: ', err.message);
      return Promise.reject(err);
    });
  };
      
  const cancelInterview = (id, interview) => {
    console.log('cancelInterview Data: ', id, interview);
    
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
  
  // passes the new appointments
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const index = state.days.findIndex(day => day.name === state.day);
    const spots = getSpots(state, state.day);
    
  // passes the new spots value to the days array
    const days = [...state.days];
    const day = {...state.days[index], spots: spots + 1};

    days.splice(index, 1, day);

    return axios.delete(`/api/appointments/${id}`)
    .then(res => {
      console.log('Status message:', res.status);
      console.log('Data:', res.data);
      setState({...state,appointments, days: days});
      console.log('Appointment Deleted!');
    })
    .catch(err => {
      console.log('ERR Status: ', err.status);
      console.log('ERR Message: ', err.message);
      return Promise.reject(err);
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
};