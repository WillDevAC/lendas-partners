import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeekData {
  name: string;
  withoutBlackList: { deposit_amount: number; signups: number };
  withBlackList: { deposit_amount: number; signups: number };
}

interface Props {
  data: WeekData[];
  type: "deposits" | "registers";
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const IndicatorsChart: React.FC<Props> = ({ data, type }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((week, index) => ({
    name: `Semana ${index + 1}`,
    [type === "deposits" ? "Depósitos" : "Registros"]:
      type === "deposits"
        ? week.withoutBlackList.deposit_amount
        : week.withoutBlackList.signups,
    [type === "deposits" ? "Depósitos (Blacklist)" : "Registros (Blacklist)"]:
      type === "deposits"
        ? week.withBlackList.deposit_amount
        : week.withBlackList.signups,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => {
            if (typeof value === "number") {
              return [
                type === "deposits" ? formatCurrency(value) : value,
                name,
              ];
            }
            return [value, name];
          }}
        />
        <Legend />
        <Bar
          dataKey={type === "deposits" ? "Depósitos" : "Registros"}
          fill="#ffc658"
        />
        <Bar
          dataKey={
            type === "deposits"
              ? "Depósitos (Blacklist)"
              : "Registros (Blacklist)"
          }
          fill="#ff7300"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IndicatorsChart;
