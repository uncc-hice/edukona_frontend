import React from 'react';
import Main from '../../layouts/Main';
import Overview from './components/Overview';

const mock = [
  {
    name: 'Ayman Hajja',
    title: 'Principal Investigator and Chief Engineer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Ayman.jpeg',
    desc: '',
    linkedIn: 'https://www.linkedin.com/in/ayman-hajja/',
    x: 'https://twitter.com/aymanhajja',
  },
  {
    name: 'Aryan Aladar',
    title: 'Senior Research Assistant and Senior Developer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Aryan.JPG',
    desc: '',
    linkedIn: 'https://www.linkedin.com/in/aryan-aladar/',
    // No X link
  },
  {
    name: 'Austin Hunter',
    title: 'Research Assistant and Software Developer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Austin.jpg',
    desc: '',
    // No social links
  },
];

const Team = () => {
  return (
    <Main>
      <Overview mock={mock} />
    </Main>
  );
};

export default Team;
