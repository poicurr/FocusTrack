import React from "react";
import { Container, Typography, Card, CardContent, Box, Grid } from "@mui/material";

const CoachingTips = () => {
  const tips = [
    {
      title: "ポモドーロを活用するコツ",
      description: "タスクを小さく分割し、1セッション内で完了できる内容にしましょう。",
    },
    {
      title: "優先度を明確に",
      description: "「高」「中」「低」の優先度を付けて、重要なタスクから着手しましょう。",
    },
    {
      title: "休憩を有効活用",
      description: "短い休憩中にストレッチや軽い運動を取り入れると、集中力が高まります。",
    },
    {
      title: "タグで効率管理",
      description: "タスクに適切なタグを付けることで、進捗や時間配分を分析しやすくなります。",
    },
    {
      title: "1日の振り返り",
      description: "レポート画面を活用し、どのタスクが最も効率的だったか分析しましょう。",
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        作業効率を向上させるヒント
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        以下のコツを参考に、毎日の作業をもっと効率的に進めましょう！
      </Typography>
      <Grid container spacing={3}>
        {tips.map((tip, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tip.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tip.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CoachingTips;
