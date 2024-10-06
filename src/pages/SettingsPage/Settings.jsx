import React, { useEffect, useState } from 'react';
import {
  Switch,
  TextField,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import './SettingsPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../blocks/Navbar';
import Dashboard from "../../layouts/Dashboard/Dashboard";

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);

  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`https://api.edukona.com/quiz/${id}/settings`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        console.log(response.data);
        setSettings(response.data.settings);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };

    fetchSettings();
  }, [id, token]);

  const handleToggle = async (event) => {
    const { name, checked } = event.target;
    const newSettings = {
      ...settings,
      [name]: checked,
    };
    setSettings(newSettings);

    try {
      const response = await axios.patch(
        `https://api.edukona.com/quiz/${id}/settings`,
        { settings: newSettings },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Settings updated successfully');
      }
    } catch (error) {
      console.error('Failed to update settings', error);
    }
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    const newSettings = {
      ...settings,
      [name]: name === 'skip_question_percentage' ? parseFloat(value) : value,
    };

    console.log(newSettings);
    setSettings(newSettings);

    try {
      const response = await axios.patch(
        `https://api.edukona.com/quiz/${id}/settings`,
        { settings: newSettings },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Settings updated successfully');
      }
    } catch (error) {
      console.error('Failed to update settings', error);
    }
  };

  const handleBackButton = () => {
    navigate(`/dashboard`);
  };

  if (!settings) {
    return (
        <Dashboard>
          <div className="settings-container">
            <CircularProgress/>
          </div>
        </Dashboard>
  )
    ;
  }

  return (
      <Dashboard>
        <div className="settings-container">
          <div className="settings-panel">
            <h2>Behavioral Settings</h2>
            <FormControlLabel
                control={<Switch checked={settings.live_bar_chart} onChange={handleToggle} name="live_bar_chart"/>}
                label="Live Bar Chart Display"
            />
            <FormControlLabel
                control={<Switch checked={settings.timer} onChange={handleToggle} name="timer"/>}
                label="Question Timer"
            />
            <TextField
                label="Timer Duration"
                name="timer_duration"
                value={settings.timer_duration}
                onChange={handleChange}
                variant="outlined"
                size="small"
            />
            <FormControlLabel
                control={<Switch checked={settings.skip_question} onChange={handleToggle} name="skip_question"/>}
                label="Skip Question Power-Up"
            />
            {settings.skip_question && (
                <>
                  <TextField
                      label="Skips Per Student"
                      type="number"
                      name="skip_count_per_student"
                      value={settings.skip_count_per_student}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                  />
                  <FormControl variant="outlined" size="small" className="MuiFormControl-root">
                    <InputLabel>Skip Question Logic</InputLabel>
                    <Select
                        label="Skip Question Logic"
                        name="skip_question_logic"
                        value={settings.skip_question_logic}
                        onChange={handleChange}
                    >
                      <MenuItem value="streak">Streak</MenuItem>
                      <MenuItem value="random">Random</MenuItem>
                    </Select>
                  </FormControl>
                  {settings.skip_question_logic === 'streak' ? (
                      <TextField
                          label="Skip Question Streak Count"
                          type="number"
                          name="skip_question_streak_count"
                          value={settings.skip_question_streak_count}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                      />
                  ) : (
                      <TextField
                          label="Skip Question Random Percentage"
                          type="number"
                          name="skip_question_percentage"
                          value={settings.skip_question_percentage || 0}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                      />
                  )}
                </>
            )}
          </div>
          <div>
            <Button type="button" onClick={handleBackButton}>
              Save and Back
            </Button>
          </div>
        </div>
      </Dashboard>
  );
};

export default SettingsPage;
