import React from 'react';

export default function Home() {
  const data = [
    { label: 'Estimated Free Energy of Binding', value: '+2.79e+08 kcal/mol' },
    { label: 'Final Intermolecular Energy', value: '+2.79e+08 kcal/mol' },
    { label: 'vdW + Hbond + desolv Energy', value: '+1.39e+08 kcal/mol' },
    { label: 'Electrostatic Energy', value: '+1.39e+08 kcal/mol' },
    { label: 'Final Total Internal Energy', value: '+0.00 kcal/mol' },
    { label: 'Torsional Free Energy', value: '+0.00 kcal/mol' },
    { label: "Unbound System's Energy", value: '+0.00 kcal/mol' },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Binding Energy Results</h1>
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{item.label}</td>
                <td className="px-4 py-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
