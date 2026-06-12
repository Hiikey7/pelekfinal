import { useEffect, useMemo, useState } from "react";
import { backend } from "@/integrations/backend/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Banknote,
  CalendarDays,
  Download,
  Receipt,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type Order = {
  id: string;
  property_title: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  created_at: string;
};

type Property = {
  id: string;
  title: string;
  category: string;
  featured: boolean;
};

const colors = [
  "hsl(175, 94%, 40%)",
  "hsl(168, 100%, 20%)",
  "hsl(45, 93%, 47%)",
  "hsl(0, 84%, 60%)",
  "hsl(220, 70%, 50%)",
  "hsl(280, 60%, 55%)",
];

function formatMoney(value: number) {
  return `KES ${Math.round(value).toLocaleString()}`;
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-KE", {
    month: "short",
    year: "2-digit",
  });
}

function inDateRange(date: string, start: string, end: string) {
  const key = date.slice(0, 10);
  return (!start || key >= start) && (!end || key <= end);
}

function groupSum<T>(items: T[], keyFor: (item: T) => string, valueFor: (item: T) => number) {
  return Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      const key = keyFor(item) || "Unknown";
      acc[key] = (acc[key] || 0) + valueFor(item);
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export default function AdminReports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchReportData = async () => {
      const [orderResult, expenseResult, propertyResult] = await Promise.all([
        backend
          .from("orders")
          .select("id, property_title, total_amount, payment_method, status, created_at")
          .order("created_at", { ascending: false }),
        backend
          .from("expenses")
          .select("id, title, amount, category, created_at")
          .order("created_at", { ascending: false }),
        backend
          .from("properties")
          .select("id, title, category, featured")
          .order("created_at", { ascending: false }),
      ]);

      if (orderResult.data) setOrders(orderResult.data as Order[]);
      if (expenseResult.data) setExpenses(expenseResult.data as Expense[]);
      if (propertyResult.data) setProperties(propertyResult.data as Property[]);
      setLoading(false);
    };

    fetchReportData();
  }, []);

  const report = useMemo(() => {
    const filteredOrders = orders.filter((order) =>
      inDateRange(order.created_at, startDate, endDate),
    );
    const filteredExpenses = expenses.filter((expense) =>
      inDateRange(expense.created_at, startDate, endDate),
    );

    const revenue = filteredOrders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0,
    );
    const expenseTotal = filteredExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );
    const netProfit = revenue - expenseTotal;
    const averageOrderValue = filteredOrders.length ? revenue / filteredOrders.length : 0;
    const profitMargin = revenue ? (netProfit / revenue) * 100 : 0;

    const monthKeys = Array.from(
      new Set([
        ...filteredOrders.map((order) => monthKey(order.created_at)),
        ...filteredExpenses.map((expense) => monthKey(expense.created_at)),
      ]),
    ).sort();

    const monthly = monthKeys.map((key) => {
      const monthRevenue = filteredOrders
        .filter((order) => monthKey(order.created_at) === key)
        .reduce((sum, order) => sum + Number(order.total_amount), 0);
      const monthExpenses = filteredExpenses
        .filter((expense) => monthKey(expense.created_at) === key)
        .reduce((sum, expense) => sum + Number(expense.amount), 0);

      return {
        month: monthLabel(key),
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses,
      };
    });

    const byProperty = groupSum(
      filteredOrders,
      (order) => order.property_title,
      (order) => Number(order.total_amount),
    );
    const byExpenseCategory = groupSum(
      filteredExpenses,
      (expense) => expense.category,
      (expense) => Number(expense.amount),
    );
    const byPaymentMethod = groupSum(
      filteredOrders,
      (order) => order.payment_method,
      () => 1,
    );
    const byOrderStatus = groupSum(
      filteredOrders,
      (order) => order.status,
      () => 1,
    );
    const byPropertyCategory = groupSum(
      properties,
      (property) => property.category,
      () => 1,
    );

    return {
      filteredOrders,
      filteredExpenses,
      revenue,
      expenseTotal,
      netProfit,
      averageOrderValue,
      profitMargin,
      monthly,
      byProperty,
      byExpenseCategory,
      byPaymentMethod,
      byOrderStatus,
      byPropertyCategory,
    };
  }, [orders, expenses, properties, startDate, endDate]);

  const cards = [
    { label: "Gross Revenue", value: formatMoney(report.revenue), icon: Banknote },
    { label: "Total Expenses", value: formatMoney(report.expenseTotal), icon: Receipt },
    { label: "Net Profit", value: formatMoney(report.netProfit), icon: TrendingUp },
    { label: "Profit Margin", value: `${report.profitMargin.toFixed(1)}%`, icon: TrendingDown },
    { label: "Orders", value: String(report.filteredOrders.length), icon: ShoppingCart },
    { label: "Average Order", value: formatMoney(report.averageOrderValue), icon: CalendarDays },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Financial Report
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Revenue, expenses, profit, orders, and property performance.
          </p>
        </div>
        <Button onClick={() => window.print()} className="gap-2">
          <Download className="w-4 h-4" /> Print Report
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">From</span>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-40" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">To</span>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40" />
        </div>
        {(startDate || endDate) && (
          <Button variant="outline" onClick={() => { setStartDate(""); setEndDate(""); }}>
            Clear
          </Button>
        )}
      </div>

      {loading ? (
        <div className="bg-card rounded-xl shadow-card p-8 text-center text-muted-foreground">
          Loading report...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="bg-card rounded-xl p-5 shadow-card">
                <card.icon className="w-5 h-5 text-secondary mb-3" />
                <p className="text-xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-display text-base font-semibold text-foreground mb-4">
                Monthly Profit and Loss
              </h2>
              {report.monthly.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={report.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 10%, 90%)" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Line type="monotone" dataKey="revenue" stroke={colors[0]} strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke={colors[3]} strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke={colors[2]} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-20">No financial data for this period.</p>
              )}
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-display text-base font-semibold text-foreground mb-4">
                Revenue by Property
              </h2>
              {report.byProperty.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.byProperty.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 10%, 90%)" />
                    <XAxis type="number" fontSize={12} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <YAxis dataKey="name" type="category" width={130} fontSize={11} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Bar dataKey="value" fill={colors[0]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-20">No revenue data yet.</p>
              )}
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-display text-base font-semibold text-foreground mb-4">
                Expenses by Category
              </h2>
              {report.byExpenseCategory.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={report.byExpenseCategory} dataKey="value" nameKey="name" outerRadius={90} label>
                      {report.byExpenseCategory.map((_, index) => (
                        <Cell key={index} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-20">No expenses recorded.</p>
              )}
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card">
              <h2 className="font-display text-base font-semibold text-foreground mb-4">
                Payment Methods and Order Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReportList title="Payment Methods" rows={report.byPaymentMethod} valueSuffix=" orders" />
                <ReportList title="Order Status" rows={report.byOrderStatus} valueSuffix=" orders" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <ReportTable
              title="Top Revenue Properties"
              rows={report.byProperty.slice(0, 10).map((row) => ({
                name: row.name,
                value: formatMoney(row.value),
              }))}
            />
            <ReportTable
              title="Largest Expenses"
              rows={report.filteredExpenses
                .slice()
                .sort((a, b) => Number(b.amount) - Number(a.amount))
                .slice(0, 10)
                .map((expense) => ({
                  name: expense.title,
                  value: formatMoney(Number(expense.amount)),
                }))}
            />
            <ReportTable
              title="Property Inventory"
              rows={[
                { name: "Total properties", value: String(properties.length) },
                { name: "Featured properties", value: String(properties.filter((p) => p.featured).length) },
                ...report.byPropertyCategory.map((row) => ({
                  name: row.name === "commercial_spaces" ? "Commercial spaces" : row.name,
                  value: String(row.value),
                })),
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}

function ReportList({
  title,
  rows,
  valueSuffix = "",
}: {
  title: string;
  rows: { name: string; value: number }[];
  valueSuffix?: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {rows.length ? rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{row.name}</span>
            <span className="font-medium text-foreground">{row.value.toLocaleString()}{valueSuffix}</span>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        )}
      </div>
    </div>
  );
}

function ReportTable({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; value: string }[];
}) {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {rows.length ? rows.map((row) => (
          <div key={`${row.name}-${row.value}`} className="px-4 py-3 flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground truncate">{row.name}</span>
            <span className="font-medium text-foreground whitespace-nowrap">{row.value}</span>
          </div>
        )) : (
          <p className="px-4 py-8 text-sm text-center text-muted-foreground">No data yet.</p>
        )}
      </div>
    </div>
  );
}
