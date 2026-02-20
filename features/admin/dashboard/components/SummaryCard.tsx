/* eslint-disable @typescript-eslint/no-explicit-any */

export default function SummaryCard({ title, value, icon, color }: any) {
  return (
    <div className="rounded-2xl shadow-lg border-0 overflow-hidden">
      <div className={`p-4 flex justify-between items-center bg-gradient-to-r ${color} text-white`}>
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full backdrop-blur">
          {icon}
        </div>
      </div>
    </div>
  );
}