// AccordionQuizzes.stories.tsx

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse, delay } from 'msw';
import AccordionQuizzes from './AccordionQuizzes';
import { MemoryRouter } from 'react-router-dom';

// Mock data for successful fetch
const mockQuizzes = [
  {
    id: 111,
    title: 'Intro to Linux',
    start_time: null,
    end_time: null,
    timer: true,
    instructor_recording: '5fdfbfc9-41a9-418a-a6ee-84095a6bc767',
    created_at: '2025-01-21T19:13:39.339575Z',
    num_questions: 5,
    num_sessions: 2,
  },
  {
    id: 494,
    title: 'File Management Basics in Terminal',
    start_time: null,
    end_time: null,
    timer: true,
    instructor_recording: '5fdfbfc9-41a9-418a-a6ee-84095a6bc767',
    created_at: '2025-01-21T19:13:39.339575Z',
    num_questions: 5,
    num_sessions: 2,
  },
];

// Meta configuration for the AccordionQuizzes component
const meta: Meta<typeof AccordionQuizzes> = {
  title: 'Components/AccordionQuizzes',
  component: AccordionQuizzes,
  argTypes: {
    recordingId: { control: 'text' },
    expanded: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AccordionQuizzes>;

// Story: No Quizzes Available
export const Quizzes: Story = {
  args: {
    recordingId: 'recording-456',
    expanded: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`https://api.edukona.com/recordings/recording-456/quizzes`, async () => {
          await delay(800);
          return HttpResponse.json(mockQuizzes);
        }),
        http.get(`https://api.edukona.com/quiz/494/sessions`, async () => {
          await delay(800);
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const NoQuizzes: Story = {
  args: {
    recordingId: 'recording-456',
    expanded: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(`https://api.edukona.com/recordings/recording-456/quizzes`, () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};
