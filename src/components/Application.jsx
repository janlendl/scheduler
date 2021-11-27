import React from "react";
// import axios from 'axios';

import "components/Application.scss";
import DayList from "./DayList";
import 'components/Appointment';
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {


// pass functions from useApplicationData custom hook
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
    
    // initiate selector function
    const appointmentList = dailyAppointments.map((appointment) => {
      console.log('GETINTERVIEWERSbyDAY:::', interviewers);
      return (
        <Appointment
        key={ appointment.id }
        id={ appointment.id }
        time={ appointment.time }
        interview ={ getInterview(state, appointment.interview) }
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
