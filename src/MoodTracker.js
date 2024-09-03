// src/components/MoodTracker.js
import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';
import './MoodTracker.css'; // For styling

const moodDescriptions = {
  1: 'Very Depressed 😞: Feeling extremely down, hopeless, or in despair. Struggling to find motivation or interest in any activities.',
  2: 'Depressed 😔: Feeling very low, with a lack of energy, and persistent sadness. Daily activities feel overwhelming.',
  3: 'Very Unhappy 😢: Experiencing strong feelings of unhappiness and frustration. Struggling to enjoy things that usually bring joy.',
  4: 'Unhappy ☹️: Feeling down or sad, but able to manage daily tasks. Joy is hard to find, but not entirely absent.',
  5: 'Neutral 😐: Neither happy nor sad, feeling indifferent. Just going through the motions of the day.',
  6: 'Slightly Happy 🙂: Mild contentment, with a positive outlook. Not overly joyful, but a general sense of well-being.',
  7: 'Happy 😊: Feeling positive, with a good energy level. Engaging in daily activities with interest and enthusiasm.',
  8: 'Very Happy 😄: Feeling very good, with strong feelings of happiness. Enjoying activities and interactions with others.',
  9: 'Elated 😃: Experiencing high energy and joy. Feeling very optimistic and excited about life.',
  10: 'Euphoric 🤩: Feeling extremely happy, almost on top of the world. Very high energy, enthusiasm, and a strong sense of well-being.'
};

const MoodTracker = () => {
  const [mood, setMood] = useState(5);
  const [weeklyMoodData, setWeeklyMoodData] = useState([]);
  const [journalEntry, setJournalEntry] = useState('');
  const [sleepHours, setSleepHours] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moodResponse = await axios.get('http://localhost:9099/api/mood/weekly-report');
        const data = moodResponse.data.map(entry => ({
          day: new Date(entry.entryDate).toLocaleDateString(), // Format date
          moodScore: entry.moodScore
        }));
        setWeeklyMoodData(data);

        const recommendationsResponse = await axios.get('http://localhost:9099/api/mood/recommendations');
        setRecommendations(recommendationsResponse.data);
      } catch (err) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMoodChange = (event, newValue) => {
    setMood(newValue);
  };

  const handleSaveMood = async () => {
    try {
      await axios.post('http://localhost:9099/api/mood/save', {
        moodScore: mood,
        journalEntry: journalEntry || "",
        sleepHours: sleepHours || 0,
        waterIntake: waterIntake || 0,
        entryDate: new Date().toISOString().split('T')[0] // Current date
      });
      alert('Mood entry saved successfully!');
    } catch (error) {
      alert('Error saving mood entry.');
    }
  };

  return (
    <div className="mood-tracker">
      <h1>Daily Mood Tracker</h1>
      <div className="slider-container">
        <h2>Rate Your Mood</h2>
        <Slider
          value={mood}
          min={1}
          max={10}
          step={1}
          onChange={handleMoodChange}
          aria-labelledby="mood-slider"
          valueLabelDisplay="auto"
          sx={{ width: '80%', maxWidth: '600px' }}
        />
        <div className="mood-description">
          <h3>Mood Description:</h3>
          <p>{moodDescriptions[mood]}</p>
        </div>
      </div>
      <div className="form-container">
        <TextField
          label="Journal Entry"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          sx={{ marginBottom: '15px' }}
        />
        <div className="numeric-inputs">
          <TextField
            label="Sleep Hours"
            type="number"
            variant="outlined"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            label="Water Intake (ml)"
            type="number"
            variant="outlined"
            value={waterIntake}
            onChange={(e) => setWaterIntake(Number(e.target.value))}
            sx={{ marginBottom: '15px' }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveMood}
          sx={{ padding: '10px 20px', marginTop: '15px' }}
        >
          Save Mood Entry
        </Button>
      </div>
      <div className="mood-graph">
        <h2>Weekly Mood Report</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <LineChart width={600} height={300} data={weeklyMoodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="moodScore" stroke="#8884d8" />
          </LineChart>
        )}
      </div>
      <div className="recommendations">
        <h2>Recommendations</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{recommendations}</p>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
