import React from "react";

interface MarksChartProps {
    average: number;
    marks: { value: number }[];
}

const MarksChart: React.FC<MarksChartProps> = ({ average, marks }) => {
    return (
        <div className="p-4 bg-blue-100 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Marks Overview</h3>
            <p className="text-sm text-gray-600">Average: {average.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Marks: {marks.length}</p>
        </div>
    );
};

export default MarksChart;
