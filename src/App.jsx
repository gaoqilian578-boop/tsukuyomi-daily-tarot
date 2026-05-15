import React, { useMemo, useState } from "react";
import { Moon, Sparkles } from "lucide-react";
import { isSupabaseConfigured } from "./lib/supabase";

const cards = [
  { name: "月", position: "正位置", text: "見えない不安が大きくなりやすい日です。事実と想像を分けて、答えを急がないでください。" },
  { name: "悪魔", position: "逆位置", text: "執着や確認したい衝動をほどく日です。SNS確認や追いLINEの前に一度止まりましょう。" },
  { name: "審判", position: "正位置", text: "過去の流れを見直す日です。戻るかどうかより、同じ傷を繰り返さない視点を持ってください。" },
  { name: "星", position: "正位置", text: "すぐ叶える希望ではなく、消えない光を守る日です。焦らず心の回復を優先してください。" },
  { name: "女教皇", position: "正位置", text: "直感と不安を分ける日です。今すぐ動かず、静かに観察してください。" },
  { name: "死神", position: "正位置", text: "古い流れを終わらせ、新しい形へ向かう日です。終わりは失敗ではありません。" }
];

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function generateReading(userProfile, todayCard, cardPosition, situationText, currentActionText) {
  const nickname = userProfile?.nickname || "あなた";
  return {
    flowText: `${nickname}さんの今日のカードは「${todayCard.name}」${cardPosition}です。${todayCard.text}`,
    personOrSituationText: `相手や状況を今すぐ断定するより、入力した状況「${situationText || "今の悩み"}」を事実と想像に分けて見る時です。`,
    avoidText: `不安のまま動くことは避けてください。${currentActionText || "追いLINE、SNS確認、感情的な判断"}は一晩置くと見え方が変わります。`,
    actionText: "今日は、事実・想像・今日できる小さな一手を3行で書いてください。",
    messageText: "見えないものが怖い夜ほど、答えを急がなくていい。今夜は相手ではなく、あなたの心の月を静かに見てください。"
  };
}

function App() {
  const [nickname, setNickname] = useState("");
  const [situation, setSituation] = useState("");
  const [action, setAction] = useState("");
  const [draw, setDraw] = useState(() => JSON.parse(localStorage.getItem("tsukuyomi-today-draw") || "null"));
  const locked = draw?.date === todayKey();
  const reading = useMemo(() => {
    if (!draw) return null;
    return generateReading({ nickname }, draw.card, draw.card.position, situation || draw.situationText, action || draw.currentActionText);
  }, [draw, nickname, situation, action]);

  function drawCard() {
    if (locked) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    const next = { date: todayKey(), card, situationText: situation, currentActionText: action };
    localStorage.setItem("tsukuyomi-today-draw", JSON.stringify(next));
    setDraw(next);
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">月読 ─ tsukuyomi ─</p>
        <h1>月読｜今日のタロット</h1>
        <p>1日1回だけ、今の状況をカードに預ける夜のタロットです。</p>
        {!isSupabaseConfigured && <small>Supabase未設定時はlocalStorageで仮保存します。</small>}
      </section>

      <section className="panel">
        <label>ニックネーム<input value={nickname} onChange={(e) => setNickname(e.target.value)} /></label>
        <label>今の状況<textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="彼から3日返信がありません。" /></label>
        <label>今しようとしている行動<textarea value={action} onChange={(e) => setAction(e.target.value)} placeholder="追いLINEしようか迷っています。" /></label>
        <button onClick={drawCard} disabled={locked}>{locked ? "今日はもうカードを引いています" : "今日のカードを引く"}</button>
      </section>

      {reading && (
        <section className="result">
          <div className="card"><Moon /><strong>{draw.card.name}</strong><span>{draw.card.position}</span></div>
          <Block title="今の流れ" text={reading.flowText} />
          <Block title="相手や状況の見え方" text={reading.personOrSituationText} />
          <Block title="今やらない方がいいこと" text={reading.avoidText} />
          <Block title="今日の次の一手" text={reading.actionText} />
          <Block title="月読メッセージ" text={reading.messageText} />
          <p className="notice"><Sparkles size={16} />この占いは、入力内容とカードの象徴をもとに、今の感情や状況を整理するためのものです。未来や相手の気持ちを断定するものではありません。</p>
        </section>
      )}
    </main>
  );
}

function Block({ title, text }) {
  return <article className="block"><h2>{title}</h2><p>{text}</p></article>;
}

export default App;
