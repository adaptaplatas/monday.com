import React from 'react';
import { render } from '@testing-library/react';
import View from './View';

test('renders learn react link', () => {
  const { getByText } = render(<View />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
