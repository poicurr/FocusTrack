import React from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";

// ヒントのリスト
const allTips = [
  { "title": "ポモドーロごとのタスク分割", "description": "25分単位でタスクを分割し、明確なゴールを設定して取り組む。" },
  { "title": "休憩時間にリフレッシュ活動", "description": "5分休憩でストレッチや深呼吸を行い、次のセッションに備える。" },
  { "title": "1日のポモドーロ数を記録", "description": "1日に達成したポモドーロ数を記録し、作業量を可視化する。" },
  { "title": "ポモドーロを種類で色分け", "description": "タスクの種類（例: 学習、作業、読書）ごとにポモドーロを色分けし、バランスを管理する。" },
  { "title": "ポモドーロのテーマ設定", "description": "各セッションに集中するテーマを決め、効率的に取り組む。" },
  { "title": "ポモドーロ終了時の達成確認", "description": "25分ごとにタスクの進捗を確認し、達成感を味わう。" },
  { "title": "休憩後のリセットルーチン", "description": "次のポモドーロをスムーズに開始するために簡単な準備ルーチンを設ける。" },
  { "title": "ポモドーロの長さを調整", "description": "集中力やタスクに応じてセッション時間を調整（例: 15分や40分）する。" },
  { "title": "複数人でのポモドーロ実施", "description": "チームや友人と一緒にポモドーロを行い、お互いの進捗を共有する。" },
  { "title": "1日のポモドーロ計画表", "description": "朝にタスクごとのポモドーロ数を計画し、スケジュールを立てる。" },
  { "title": "ポモドーロ用音楽プレイリスト", "description": "集中力を高めるBGMやホワイトノイズを再生し、雑音を遮断する。" },
  { "title": "ポモドーロアプリの活用", "description": "タイマー機能や進捗記録があるアプリを使い、効率的に管理する。" },
  { "title": "長時間作業のポモドーロ区切り", "description": "2時間以上の作業をポモドーロ法で区切り、集中力を維持する。" },
  { "title": "ポモドーロ終了時のメモ", "description": "セッション後に進捗や気づきをメモし、次回の参考にする。" },
  { "title": "タスク優先度のポモドーロ配分", "description": "重要なタスクに多くのポモドーロを割り当て、優先的に進める。" },
  { "title": "ポモドーロ成果報告", "description": "終了後に同僚やパートナーに進捗を報告し、モチベーションを高める。" },
  { "title": "休憩時間に目を休める", "description": "画面から目を離し、遠くを眺めて視覚疲労を軽減する。" },
  { "title": "ポモドーロセッション後のご褒美", "description": "一定のポモドーロを完了したら、好きなことをする時間を設ける。" },
  { "title": "次のポモドーロの目標設定", "description": "休憩中に次のセッションの具体的な目標を設定する。" },
  { "title": "週次ポモドーロレビュー", "description": "一週間のポモドーロ数を振り返り、タスク管理の改善点を見つける。" },
  { "title": "ポモドーロの失敗原因分析", "description": "集中できなかったセッションの原因を探り、対策を立てる。" },
  { "title": "長時間タスクの分割", "description": "大きなタスクを複数のポモドーロに分けて進める。" },
  { "title": "休憩時の軽い運動", "description": "体を動かし、血流を促進して次のセッションの集中力を高める。" },
  { "title": "ポモドーロ目標の達成表", "description": "毎日やるべきポモドーロ数を記録し、進捗を視覚化する。" },
  { "title": "ポモドーロ中の作業ログ", "description": "セッション中にどのようなタスクを行ったか記録し、作業の傾向を把握する。" },
  { "title": "長期目標とポモドーロのリンク", "description": "長期的な目標を達成するために、必要なポモドーロ数を逆算する。" },
  { "title": "休憩中の小さな趣味時間", "description": "好きな本を読む、絵を描くなど、5分間楽しめる活動を取り入れる。" },
  { "title": "複数の短期プロジェクト管理", "description": "ポモドーロを使い、複数のタスクを並行して進める計画を立てる。" },
  { "title": "毎月のポモドーロ統計", "description": "1か月分のポモドーロセッションを集計し、生産性を分析する。" },
  { "title": "カスタムポモドーロインターバル", "description": "自分に最適な集中時間（例: 20分、30分）を試し、調整する。" },
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
