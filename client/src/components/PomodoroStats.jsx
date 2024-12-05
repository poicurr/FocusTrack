import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { subDays, format } from 'date-fns';

// ダミーデータ生成関数
const generateDummyData = (days) => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    return {
      date: format(date, 'MM/dd'),
      pomodoros: Math.floor(Math.random() * 10) + 1,
      tasks: Math.floor(Math.random() * 5) + 1,
    };
  });
};

const PomodoroStats = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const data = generateDummyData(timeRange === '7days' ? 7 : 28);

  const handleTimeRangeChange = (
    event,
    newTimeRange,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }} elevation={2}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          ポモドーロ統計
        </Typography>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="時間範囲"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="7days" aria-label="過去7日間">
            過去7日間
          </ToggleButton>
          <ToggleButton value="28days" aria-label="過去28日間">
            過去28日間
          </ToggleButton>
        </ToggleButtonGroup>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="pomodoros" name="ポモドーロ回数" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="tasks" name="完了タスク数" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PomodoroStats;
