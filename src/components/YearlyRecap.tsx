'use client';

import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlayerState } from '../lib/gamelogic';

interface YearlyRecapProps {
  history: PlayerState['portfolioHistory'];
  onClose: () => void;
}

// This function formats the tooltip content
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
        <p className="label text-white font-bold">{`End of Year ${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: $${Number(pld.value).toFixed(2)}`}
          </p>
        ))}
         <p className="text-gray-400 mt-2 text-sm">Total: ${payload.reduce((sum: number, pld: any) => sum + pld.value, 0).toFixed(2)}</p>
      </div>
    );
  }

  return null;
};


export default function YearlyRecap({ history, onClose }: YearlyRecapProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-3xl text-white border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-2">End of Year {history.at(-1)?.year} Recap</h2>
        <p className="text-center text-gray-400 mb-6">Here is your portfolio breakdown and performance so far.</p>
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <ComposedChart data={history} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="year" stroke="#A0AEC0" />
                    <YAxis 
                        stroke="#A0AEC0" 
                        tickFormatter={(value) => `$${(Number(value) / 1000)}k`} 
                        domain={[0, 'dataMax + 5000']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="cash" stackId="1" name="Cash" stroke="#2E7D32" fill="#4CAF50" />
                    <Area type="monotone" dataKey="longTermETF" stackId="1" name="Long-Term ETF" stroke="#1976D2" fill="#2196F3" />
                    <Area type="monotone" dataKey="volatileETF" stackId="1" name="Volatile ETF" stroke="#D32F2F" fill="#F44336" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
        <div className="text-center mt-6">
            <button onClick={onClose} className="px-8 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-all transform hover:scale-105">
                Continue to Next Year
            </button>
        </div>
      </div>
    </div>
  );
}

