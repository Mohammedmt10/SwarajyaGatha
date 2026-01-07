"use client";

import { useMemo } from "react";

type PlayerEco = {
  player: number;
  eco: {
    gold: number;
    silver: number;
    bronze: number;
  };
};

export default function EndScreen({ players }: { players: PlayerEco[] }) {
  const standings = useMemo(() => {
    return [...players]
      .map((p) => {
        const score = p.eco.gold * 10 + p.eco.silver * 5 + p.eco.bronze;
        return { ...p, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.eco.gold !== a.eco.gold) return b.eco.gold - a.eco.gold;
        if (b.eco.silver !== a.eco.silver) return b.eco.silver - a.eco.silver;
        if (b.eco.bronze !== a.eco.bronze) return b.eco.bronze - a.eco.bronze;
        return a.player - b.player;
      });
  }, [players]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
      <div className="w-[90vw] max-w-3xl rounded-2xl border-8 border-[#8e0000] bg-[#de9a35] p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <h2 className="mb-4 text-center text-3xl font-extrabold text-[#8e0000] drop-shadow">
          Game Over
        </h2>

        <p className="mb-4 text-center text-lg font-semibold text-[#4b1b00]">
          All players have reached the end. Final economy leaderboard:
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto rounded-xl bg-white/90 text-left text-sm">
            <thead className="bg-[#8e0000] text-white">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Player</th>
                <th className="px-4 py-2">Gold</th>
                <th className="px-4 py-2">Silver</th>
                <th className="px-4 py-2">Bronze</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((p, idx) => (
                <tr
                  key={p.player}
                  className={
                    idx === 0
                      ? "bg-yellow-100"
                      : idx === 1
                      ? "bg-slate-100"
                      : idx === 2
                      ? "bg-amber-100"
                      : ""
                  }
                >
                  <td className="px-4 py-2 font-bold text-[#8e0000]">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    Player {p.player}
                  </td>
                  <td className="px-4 py-2">{p.eco.gold}</td>
                  <td className="px-4 py-2">{p.eco.silver}</td>
                  <td className="px-4 py-2">{p.eco.bronze}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

