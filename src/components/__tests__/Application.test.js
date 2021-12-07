import React from 'react';
import Application from 'components/Application';
import axios from 'axios';
import { 
  render, 
  cleanup, 
  waitForElement, 
  fireEvent, 
  getByText,  
  getAllByTestId, 
  getByAltText,
  getByPlaceholderText,
  queryByText,
  prettyDOM
} from '@testing-library/react';

afterEach(cleanup);

describe('Application', () => {

  it('changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));
    fireEvent.click(getByText('Tuesday'));
  
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  
  });
  
  it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container, debug } = render(<Application />);
    
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    
    fireEvent.click(getByAltText(appointment, 'Add'));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });
    
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    
    fireEvent.click(getByText(appointment, 'Save'));
    
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, 'day').find(day => 
      queryByText(day, 'Monday')
    );

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
    
  });
  
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Are you sure you like to delete?')).toBeInTheDocument();
    
    // click confirm 
    fireEvent.click(queryByText(appointment, 'Confirm'));
    
    // deleting animation
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();
    
    // wait until the day is empty and add button shows up
    await waitForElement(() => getByAltText(appointment,'Add'));

    // check day
    const day = getAllByTestId(container, 'day').find(day => 
      queryByText(day, 'Monday')
    );

    // spots needs to increment by 1
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // Render the application
    const { debug, container } = render(<Application />);

    // Wait until Archie Cohen is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    // Click the edit button
    fireEvent.click(getByAltText(appointment, 'Edit'));
    // Makes the changes by editing the name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lendl Peralta' }
    });

    // Makes the changes by selecting a new interviewer
    fireEvent.click(getByAltText(appointment, 'Tori Malcolm'));
    // Save button
    fireEvent.click(getByText(appointment, 'Save'));

    // Saving mode
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    //Show updated data
    await waitForElement(() => getByText(appointment, 'Lendl Peralta'));

    // Mondays spot will remain the same
    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining'));

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { debug, container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' }
    });

    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
    
    await waitForElement(() => getByText(appointment, 'Error'));
  
    expect(getByText(appointment, 'Could not save appointment')).toBeInTheDocument();
    
    fireEvent.click(getByAltText(appointment, 'Close'));
    
    expect(getAllByTestId(container, 'appointment'));
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { debug, container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(getByText(appointment, 'Are you sure you like to delete?')).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, 'Error'));

    expect(getByText(appointment, 'Could not cancel appointment')).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, 'Close'));

    expect(getByText(appointment, 'Archie Cohen'));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );

    expect(getByText(day, '1 spot remaining'));
  });
  
}) 