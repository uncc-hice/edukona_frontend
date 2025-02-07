import Main from '../../layouts/Main';
import Overview from './components/Overview';

const mock = [
  {
    name: 'Ayman Hajja',
    title: 'Principal Investigator and Chief Engineer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Ayman.jpeg',
    desc: '',
    linkedIn: 'https://www.linkedin.com/in/ayman-hajja-09032b67/',
    github: 'https://github.com/amhajja', // Added GitHub link
  },
  {
    name: 'Aryan Aladar',
    title: 'Senior Research Assistant and Senior Developer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Aryan.JPG',
    desc: '',
    linkedIn: 'https://www.linkedin.com/in/aladar/',
    github: 'https://github.com/aaladaruncc', // Added GitHub link
    // No X link
  },
  {
    name: 'Austin Hunter',
    title: 'Research Assistant and Software Developer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Austin.jpg',
    desc: '',
    linkedIn: 'https://www.linkedin.com/in/austinfhunter/',
    github: 'https://github.com/AustinfHunter',
  },
  {
    name: 'Bruh Lemma Yadecha',
    title: 'Research Assistant and Software Engineer',
    avatar: 'https://elasticbeanstalk-us-west-2-730335402099.s3.us-west-2.amazonaws.com/hice_frontend/Bruh_Lemma.jpg',
    desc: '',
    linkedIn: 'https://www.linkedin.com/in/blyadecha/',
    github: 'https://github.com/BruhLemma-Yadecha',
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
