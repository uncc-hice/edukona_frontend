import { useEffect, useState } from 'react';
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
  Grid,
  Typography,
} from '@mui/material';
import './SettingsPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import Main from '../../layouts/Main/Main';
import { fetchQuiz, updateQuiz } from '../../services/apiService';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = () => {
      fetchQuiz(id)
        .then((response) => {
          const quiz = response.data.quiz;
          console.log('Quiz fetched successfully', quiz);
          setCurrentQuiz(quiz);
          const settings = {
            timer: quiz.timer,
            live_bar_chart: quiz.live_bar_chart,
            skip_question: quiz.skip_question,
            skip_count_per_student: quiz.skip_count_per_student,
            skip_question_logic: quiz.skip_question_logic,
            skip_question_streak_count: quiz.skip_question_streak_count,
            skip_question_percentage: quiz.skip_question_percentage,
          };
          setSettings(settings);
        })
        .catch((error) => {
          console.error('Failed to fetch settings', error);
        });
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

    updateQuiz(id, { ...currentQuiz, ...newSettings })
      .then(() => {
        console.log('Settings updated successfully', { ...currentQuiz, ...newSettings });
      })
      .catch((error) => {
        console.error('Failed to update settings', error);
      });
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    const newSettings = {
      ...settings,
      [name]: name === 'skip_question_percentage' ? parseFloat(value) : value,
    };
    setSettings(newSettings);

    updateQuiz(id, { ...currentQuiz, ...newSettings })
      .then(() => {
        console.log('Settings updated successfully', { ...currentQuiz, ...newSettings });
      })
      .catch((error) => {
        console.error('Failed to update settings', error);
      });
  };

  const handleBackButton = () => {
    navigate(`/dashboard`);
  };

  if (!settings) {
    return (
      <Main>
        <div className="settings-container">
          <CircularProgress />
        </div>
      </Main>
    );
  }

  return (
    <Main>
      <Grid container spacing={2} direction={'column'} alignItems={'left'} padding={8} columns={12}>
        <Grid item>
          <Typography variant="h4">Settings</Typography>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={settings.live_bar_chart} onChange={handleToggle} name="live_bar_chart" />}
            label="Live Bar Chart Display"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={settings.skip_question} onChange={handleToggle} name="skip_question" />}
            label="Skip Question Power-Up"
          />
        </Grid>
        {settings.skip_question && (
          <>
            <Grid item>
              <TextField
                label="Skips Per Student"
                type="number"
                name="skip_count_per_student"
                value={settings.skip_count_per_student}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{ width: 0.5 }}
              />
            </Grid>
            <Grid item>
              <FormControl variant="outlined" size="small" sx={{ width: 0.5 }}>
                <InputLabel>Skip Question Logic</InputLabel>
                <Select
                  label="Skip Question Logic"
                  name="skip_question_logic"
                  value={settings.skip_question_logic}
                  onChange={handleChange}
                  small
                >
                  <MenuItem value="streak">Streak</MenuItem>
                  <MenuItem value="random">Random</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item columns={6}>
              {settings.skip_question_logic === 'streak' ? (
                <TextField
                  label="Skip Question Streak Count"
                  type="number"
                  name="skip_question_streak_count"
                  value={settings.skip_question_streak_count}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={{ width: 0.5 }}
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
                  sx={{ width: 0.5 }}
                />
              )}
            </Grid>
          </>
        )}
        <Grid item>
          <Button type="button" onClick={handleBackButton} variant="outlined">
            Save Changes and Return
          </Button>
        </Grid>
      </Grid>
    </Main>
  );
};

export default SettingsPage;
