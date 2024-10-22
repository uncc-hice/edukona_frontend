import React, { useState, useEffect } from 'react';
import { TextField, Button, Tabs, Tab, Box } from '@mui/material';
import './ProfilePage.css';
import Dashboard from '../../layouts/Dashboard/Dashboard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0); // 0 for General and 1 for Security
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  // const {id} = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Getting the user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get('https://api.edukona.com/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        if (profileResponse.status === 200) {
          const { firstName, lastName, username, email } = profileResponse.data;
          console.log('Fetched user data: ', profileResponse.data);
          setUserData({ firstName, lastName, username, email });
        }
      } catch (error) {
        console.error("Failed to gather the user's information.", error);
        if (error.response.status === 401) {
          navigate('https://api.edukona.com');
        }
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = async () => {
    try {
      const updateResponse = await axios.put(`https://api.edukona.com/profile`, userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (updateResponse.status === 200) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving the user's information.", error);
    }
  };

  return (
    <Dashboard>
      <div className="profile-container">
        <Box className="tabs-container">
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="General"></Tab>
            <Tab label="Security"></Tab>
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <h2>Profile Information</h2>
          {isEditing ? (
            <>
              <h3>First Name</h3>
              <TextField>
                label="First Name" name="firstName value={userData.firstName}
                onChange={handleInputChange}
                variant="outlined" fullWidth margin="normal"
              </TextField>
              <h3>Last Name</h3>
              <TextField>
                label="Last Name" name="lastName value={userData.lastName}
                onChange={handleInputChange}
                variant="outlined" fullWidth margin="normal"
              </TextField>
              <h3>Username</h3>
              <TextField>
                label="Username" name="firstName value={userData.username}
                onChange={handleInputChange}
                variant="outlined" fullWidth margin="normal"
              </TextField>
              <h3>Email</h3>
              <TextField>
                label="Email" name="email" value={userData.email}
                onChange={handleInputChange}
                variant="outlined" fullWidth margin="normal"
              </TextField>
              <Button className="commit-button" onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button className="commit-button" onClick={toggleEditMode}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <p>First Name: {userData.firstName}</p>
              <p>Last Name: {userData.lastName}</p>
              <p>Username: {userData.username}</p>
              <p>Email: {userData.email}</p>
              <Button className="commit-button" onClick={toggleEditMode}>
                Edit Profile
              </Button>
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <h2>Security Settings</h2>
          <Button className="commit-button">Delete Profile</Button>
        </TabPanel>
      </div>
    </Dashboard>
  );
};

// A function to help correctly render the general and security tabs.
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box id="tab-container" sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default ProfilePage;
