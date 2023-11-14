import { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Web3Wallet } from './index';

export default {
  args: {},
  component: Web3Wallet,
  title: 'Components/Web3Wallet',
} as Meta<typeof Web3Wallet>;

const Template: StoryFn<typeof Web3Wallet> = (args) => <Web3Wallet {...args} />;

export const Default: StoryObj<typeof Web3Wallet> = {
  args: {},
  render: Template,
};
