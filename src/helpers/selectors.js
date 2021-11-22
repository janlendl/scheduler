
export function getAppointmentsForDay(state, day) {
 
  const dayAppointments = [];
  const appointmentData = [];
  
  for (const fromDay of state.days) {
    if (fromDay.name === day) {
      dayAppointments.push(...fromDay.appointments);
    }
  }

  for (const key in state.appointments) {
    const apptID = state.appointments[key].id;
    if(dayAppointments.includes(apptID)) {
      appointmentData.push(state.appointments[key]);
    }
  }
  return appointmentData;
}

export function getInterview(state, interview) {
  if (interview !== null) {
    const interviewID = interview.interviewer;
    const interviewerData = state.interviewers[interviewID];
    
    const interviewerObj = {
      student: interview.student,
      interviewer: {...interviewerData }
    }
    return interviewerObj;
  }
  return null;
}