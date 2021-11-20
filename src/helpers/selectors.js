
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