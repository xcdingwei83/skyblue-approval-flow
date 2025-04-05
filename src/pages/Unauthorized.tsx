
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <div className="text-center p-6">
        <ShieldAlert className="h-20 w-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">访问被拒绝</h1>
        <p className="text-gray-600 mb-6">您没有权限访问此页面</p>
        <Button onClick={() => navigate("/")}>返回首页</Button>
      </div>
    </div>
  );
};

export default Unauthorized;
