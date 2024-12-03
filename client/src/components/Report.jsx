import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";
import XIcon from '@mui/icons-material/X';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import html2canvas from "html2canvas";

import PomodoroShare from "./PomodoroShare";
import PomodoroStats from "./PomodoroStats";

// Dummy Data
const dailyData = {
  completedTasks: 12,
  pomodoros: 10,
  satisfaction: 4.2,
};

const weeklyData = [
  { name: "Mon", satisfaction: 4.3, tasks: 5, pomodoros: 7 },
  { name: "Tue", satisfaction: 3.8, tasks: 4, pomodoros: 6 },
  { name: "Wed", satisfaction: 4.0, tasks: 6, pomodoros: 8 },
];

const monthlyData = [
  { name: "Week 1", tasks: 20, pomodoros: 30 },
  { name: "Week 2", tasks: 15, pomodoros: 25 },
  { name: "Week 3", tasks: 22, pomodoros: 32 },
  { name: "Week 4", tasks: 18, pomodoros: 28 },
];

const Report = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");

  const handleDownload = async () => {
    const element = document.getElementById("daily-report");
    const canvas = await html2canvas(element);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "unnamed.png";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box sx={{ padding: 2 }}>

      {/* Daily Report Section */}
      <Box style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          Report
        </Typography>

        <div id="daily-report">
          <PomodoroShare pomodoroCount={8} completedTasks={15} satisfaction={4.5} />
        </div>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleDownload}
        >
          Download Image
        </Button>
      </Box>


      <PomodoroStats />

      <Divider sx={{ marginY: 2 }} />

      {/* Heatmap Section */}

    </Box>
  );
};

export default Report;
