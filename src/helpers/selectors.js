
// function to grab the appointments for that day
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

// function to get the interviewers assigned for that day
export function getInterviewersForDay(state, day) {
 
  const dayAppointments = [];
  const interviewersData = [];
  
  for (const fromDay of state.days) {
    if (fromDay.name === day) {
      dayAppointments.push(...fromDay.interviewers);
    }
  }

  for (const key in state.interviewers) {
    const intID = state.interviewers[key].id;
    if(dayAppointments.includes(intID)) {
      interviewersData.push(state.interviewers[key]);
    }
  }
  return interviewersData;
}

// function to get the interview details
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

//function to get the spots per day
export function getSpots(state, day) {
  const appointmentsForDay = [];
  let spots = 0;

  for (const dayItem of state.days) {
    if (dayItem.name === day) {
      appointmentsForDay.push(...dayItem.appointments);
    }
  }

  for (const key of appointmentsForDay) {
    console.log("::KEY:: ", key)
    if (!state.appointments[key].interview) {
      spots ++
    }
  }

return spots;
}