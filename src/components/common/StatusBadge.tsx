
import { Badge } from "@/components/ui/badge";

type Status = "pending" | "approved" | "rejected" | "published";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "待审批",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    approved: {
      label: "已批准",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    rejected: {
      label: "已拒绝",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    published: {
      label: "已发布",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
