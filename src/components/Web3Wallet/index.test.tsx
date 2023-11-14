import { render, screen } from '@testing-library/react';
import React from 'react';

import { Web3Wallet } from '.'; // Replace with your component's actual import path

describe('<Web3Wallet />', () => {
  it('renders "connecting" text', () => {
    render(<Web3Wallet />);
    const connectingText = screen.getByText('connecting');
    expect(connectingText).toBeInTheDocument();
  });
});
