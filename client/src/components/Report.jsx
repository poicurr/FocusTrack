import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Report = () => {
  const [filter, setFilter] = useState('weekly');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // サンプルタスクデータ
  const taskData = [
    { title: 'Task 1', completedOn: '2024-10-01', timeSpent: '25 mins', tags: 'Work' },
    { title: 'Task 2', completedOn: '2024-10-02', timeSpent: '50 mins', tags: 'Study' },
    { title: 'Task 3', completedOn: '2024-10-03', timeSpent: '30 mins', tags: 'Exercise' },
    // 他のタスクデータ
  ];

  // 1週間分のタスクデータ
  const weeklyTaskData = {
    labels: ['10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [3, 5, 2, 6, 4, 7, 1],
        fill: false,
        borderColor: '#3f51b5',
        tension: 0.1,
      },
      {
        label: 'Pomodoro Sessions',
        data: [5, 8, 5, 9, 5, 8, 3],
        fill: false,
        borderColor: '#f44336',
        tension: 0.1,
      },
    ],
  };

  // 1ヶ月分のタスクデータ
  const monthlyTaskData = {
    labels: [
      '10/01', '10/02', '10/03', '10/04', '10/05', '10/06', '10/07',
      '10/08', '10/09', '10/10', '10/11', '10/12', '10/13', '10/14',
      '10/15', '10/16', '10/17', '10/18', '10/19', '10/20', '10/21',
      '10/22', '10/23', '10/24', '10/25', '10/26', '10/27', '10/28',
      '10/29', '10/30', '10/31'
    ],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [
          3, 5, 2, 6, 4, 7, 1, 8, 2, 5, 6, 3, 4, 7, 5, 3, 8, 4, 6, 7, 2, 5,
          3, 6, 4, 5, 8, 6, 7, 5, 4
        ],
        fill: false,
        borderColor: '#3f51b5',
        tension: 0.1,
      },
      {
        label: 'Pomodoro Sessions',
        data: [
          5, 8, 5, 9, 5, 8, 3, 10, 4, 8, 9, 6, 5, 9, 7, 5, 10, 5, 8, 9, 4, 6,
          6, 12, 7, 8, 10, 8, 9, 6, 8
        ],
        fill: false,
        borderColor: '#f44336',
        tension: 0.1,
      },
    ],
  };

  // 選択したフィルターに応じてデータを切り替える
  const taskDataByFilter = filter === 'weekly' ? weeklyTaskData : monthlyTaskData;

  return (
    <Box p={3}>
      {/* ヘッダー */}
      <Typography variant="h4" gutterBottom>Report</Typography>

      {/* フィルター */}
      <Box mb={2}>
        <Typography variant="h6">フィルター：</Typography>
        <Select value={filter} onChange={handleFilterChange}>
          <MenuItem value="weekly">1週間</MenuItem>
          <MenuItem value="monthly">1ヶ月</MenuItem>
          <MenuItem value="custom">カスタム期間</MenuItem>
        </Select>
      </Box>

      {/* 統計情報 */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">完了したタスク</Typography>
              <Typography variant="h4" color="primary">16</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">平均完了時間</Typography>
              <Typography variant="h4" color="primary">35分</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">最も利用されたタグ</Typography>
              <Typography variant="h4" color="primary">Work</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 日ごとのタスク消化数（折れ線グラフ） */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>日ごとの完了タスク数</Typography>
        <Box sx={{ height: 300 }}>
          <Line data={taskDataByFilter} options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } },
          }} />
        </Box>
      </Box>

      {/* タスク履歴 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タスク名</TableCell>
              <TableCell>完了日</TableCell>
              <TableCell>作業時間</TableCell>
              <TableCell>タグ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskData.map((task, index) => (
              <TableRow key={index}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.completedOn}</TableCell>
                <TableCell>{task.timeSpent}</TableCell>
                <TableCell>{task.tags}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Report;
