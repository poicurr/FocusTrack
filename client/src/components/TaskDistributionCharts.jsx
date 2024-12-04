import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, ToggleButtonGroup, ToggleButton, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

// 仮のデータ（実際のアプリケーションではpropsで渡すか、APIから取得します）
const data = {
  '7days': {
    incomplete: [
      { name: 'Work', value: 40 },
      { name: 'Private', value: 30 },
      { name: 'Vacation', value: 20 },
      { name: 'Other', value: 10 },
    ],
    completed: [
      { name: 'Work', value: 50 },
      { name: 'Private', value: 25 },
      { name: 'Vacation', value: 15 },
      { name: 'Other', value: 10 },
    ],
  },
  '28days': {
    incomplete: [
      { name: 'Work', value: 45 },
      { name: 'Private', value: 25 },
      { name: 'Vacation', value: 20 },
      { name: 'Other', value: 10 },
    ],
    completed: [
      { name: 'Work', value: 55 },
      { name: 'Private', value: 20 },
      { name: 'Vacation', value: 15 },
      { name: 'Other', value: 10 },
    ],
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TaskDistributionCharts = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const chartSize = isMobile ? 200 : isTablet ? 250 : 300;

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant={isMobile ? "h6" : "h5"} component="div" gutterBottom>
          タグ使用割合
        </Typography>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
          size={isMobile ? "small" : "medium"}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="7days" aria-label="過去7日">
            過去7日
          </ToggleButton>
          <ToggleButton value="28days" aria-label="過去28日">
            過去28日
          </ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ width: isMobile ? '100%' : '48%', mb: isMobile ? 4 : 0 }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} align="center">未完了タスク</Typography>
            <ResponsiveContainer width="100%" height={chartSize}>
              <PieChart>
                <Pie
                  data={data[timeRange].incomplete}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={chartSize / 3}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data[timeRange].incomplete.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ width: isMobile ? '100%' : '48%' }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} align="center">完了タスク</Typography>
            <ResponsiveContainer width="100%" height={chartSize}>
              <PieChart>
                <Pie
                  data={data[timeRange].completed}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={chartSize / 3}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data[timeRange].completed.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskDistributionCharts;
