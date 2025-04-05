
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/layout/PageHeader";
import { useEffect, useState } from "react";
import { FilePenLine, FileCheck, FileX, FileUp } from "lucide-react";
import { Material, MaterialStatus } from "@/types/material";
import { getAllMaterials, getPendingTaskCount } from "@/services/materialService";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    published: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch all materials
    const fetchedMaterials = getAllMaterials();
    setMaterials(fetchedMaterials);
    
    // Calculate stats
    const total = fetchedMaterials.length;
    const pending = fetchedMaterials.filter(m => m.status === "pending").length;
    const approved = fetchedMaterials.filter(m => m.status === "approved").length;
    const rejected = fetchedMaterials.filter(m => m.status === "rejected").length;
    const published = fetchedMaterials.filter(m => m.status === "published").length;
    
    setStats({ total, pending, approved, rejected, published });
    
    // Prepare chart data
    // Group by date
    const materialsByDate = fetchedMaterials.reduce((acc, material) => {
      const date = new Date(material.uploadDate).toLocaleDateString("zh-CN");
      
      if (!acc[date]) {
        acc[date] = { 
          date, 
          pending: 0, 
          approved: 0, 
          rejected: 0, 
          published: 0 
        };
      }
      
      acc[date][material.status]++;
      
      return acc;
    }, {} as Record<string, any>);
    
    // Convert to array for chart
    setChartData(Object.values(materialsByDate));
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    className 
  }: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    className: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${className}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageHeader 
        title={`您好，${user?.name || "用户"}`}
        description="欢迎使用资料审批系统"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="总资料数" 
          value={stats.total} 
          icon={FilePenLine} 
          className="text-sky-600" 
        />
        <StatCard 
          title="待审批" 
          value={stats.pending} 
          icon={FileUp} 
          className="text-yellow-600" 
        />
        <StatCard 
          title="已批准" 
          value={stats.approved} 
          icon={FileCheck} 
          className="text-green-600" 
        />
        <StatCard 
          title="已发布" 
          value={stats.published} 
          icon={FileX} 
          className="text-blue-600" 
        />
      </div>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>资料统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pending" name="待审批" fill="#eab308" />
                  <Bar dataKey="approved" name="已批准" fill="#22c55e" />
                  <Bar dataKey="rejected" name="已拒绝" fill="#ef4444" />
                  <Bar dataKey="published" name="已发布" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">暂无数据</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Dashboard;
