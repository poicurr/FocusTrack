import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";

import html2canvas from "html2canvas";

import PomodoroShare from "./PomodoroShare";
import PomodoroStats from "./PomodoroStats";
import TaskDistributionCharts from "./TaskDistributionCharts";

const Report = () => {

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

      <Divider sx={{ marginY: 2 }} />

      <PomodoroStats />

      <Divider sx={{ marginY: 2 }} />

      <TaskDistributionCharts />

      {/* Heatmap Section */}

    </Box>
  );
};

export default Report;
