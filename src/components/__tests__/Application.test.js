import React from "react";
import { render, cleanup, waitForElement, fireEvent } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

it("renders defaults to Monday and changes the schedule when a new day is selectedwithout crashing", () => {
  const { getByText } = render(<Application />);

  return waitForElement(() => getByText('Monday')).then(() => {
    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
});