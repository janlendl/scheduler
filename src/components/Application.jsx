import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "./DayList";
import 'components/Appointment';
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {

// pass an object to useState
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
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
      console.log('STATE:::', state.appointments);
      
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
    }
    
  // initiate selector function
    const appointmentList = dailyAppointments.map((appointment) => {
      const interview = getInterview(state, appointment.interview);
      const interviewers = getInterviewersForDay(state, state.day);
      console.log('GETINTERVIEWERSbyDAY:::', interviewers);
      console.log('GETINT: ', interview);
    return (
      <Appointment
        key={ appointment.id }
        id={ appointment.id }
        time={ appointment.time }
        interview={ interview }
        interviewers={ interviewers }
        bookInterview={ bookInterview }
        cancelInterview={ cancelInterview }
      />
    );
  });

// Return Application component body
  return (
    <main className="layout">
      <section className="sidebar">
        <img 
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={ state.days }
            value={ state.day }
            onChange={ setDay }
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { appointmentList }
        <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
