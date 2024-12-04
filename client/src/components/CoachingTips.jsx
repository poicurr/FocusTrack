import React from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";

// ヒントのリスト
const allTips = [
  { title: "ポモドーロを活用するコツ", description: "タスクを小さく分割し、1セッション内で完了できる内容にしましょう。" },
  { title: "優先度を明確に", description: "「高」「中」「低」の優先度を付けて、重要なタスクから着手しましょう。" },
  { title: "休憩を有効活用", description: "短い休憩中にストレッチや軽い運動を取り入れると、集中力が高まります。" },
  { title: "タグで効率管理", description: "タスクに適切なタグを付けることで、進捗や時間配分を分析しやすくなります。" },
  { title: "1日の振り返り", description: "レポート画面を活用し、どのタスクが最も効率的だったか分析しましょう。" },
  { title: "短期目標を設定", description: "1日の初めに今日達成したいタスクを具体的に書き出してみましょう。" },
  { title: "長期目標の把握", description: "作業がどのように大きな目標に繋がるのかを意識することで、モチベーションが上がります。" },
  { title: "最適な作業環境を整える", description: "デスクを整理し、気が散らない環境を作ることで集中力が向上します。" },
  { title: "ポモドーロセッションを記録", description: "何セッションでどのタスクが完了したか記録し、次回の計画に役立てましょう。" },
  { title: "タスクの分類", description: "重要かつ緊急なタスクを最優先に、その他のタスクは後回しにしましょう。" },
];

// ランダムなヒントを選択
const getRandomTips = (num) => {
  const shuffled = [...allTips].sort(() => Math.random() - 0.5); // 配列をランダム化
  return shuffled.slice(0, num); // 指定数を取得
};

const CoachingTips = () => {
  const tipsToShow = getRandomTips(6); // ランダムに6つ選択

  return (
    <Container 
      maxWidth="sm" 
      sx={{
        mt: 4, 
        mb: 4, 
        maxWidth: "800px",
        marginX: "auto", // 水平中央揃え
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        作業効率を向上させるヒント
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        以下のコツを参考に、毎日の作業をもっと効率的に進めましょう！
      </Typography>
      <Grid container spacing={3}>
        {tipsToShow.map((tip, index) => (
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
