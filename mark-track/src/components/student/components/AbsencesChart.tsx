import React from "react";

interface AbsencesChartProps {
    total: number;
    absences: { is_motivated: boolean }[];
}

const AbsencesChart: React.FC<AbsencesChartProps> = ({ total, absences }) => {
    const motivated = absences.filter((a) => a.is_motivated).length;

    return (
        <div className="p-4 bg-red-100 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Absences Overview</h3>
            <p className="text-sm text-gray-600">Total Absences: {total}</p>
            <p className="text-sm text-gray-600">Motivated: {motivated}</p>
            <p className="text-sm text-gray-600">Unmotivated: {total - motivated}</p>
        </div>
    );
};

export default AbsencesChart;
