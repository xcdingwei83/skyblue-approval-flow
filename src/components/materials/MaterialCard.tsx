
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  User 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import StatusBadge from "../common/StatusBadge";
import { Material } from "@/types/material";

interface MaterialCardProps {
  material: Material;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  showActions?: boolean;
  showDownload?: boolean;
}

const MaterialCard = ({ 
  material, 
  onApprove, 
  onReject, 
  showActions = false,
  showDownload = false
}: MaterialCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = () => {
    // In a real app, this would trigger a download of the original file
    window.open(material.originalUrl, "_blank");
  };

  return (
    <>
      <Card className="overflow-hidden h-full card-hover">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={material.previewUrl} 
            alt={material.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105" 
          />
          <div className="absolute top-2 right-2">
            <StatusBadge status={material.status} />
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium text-base mb-2 truncate">{material.title}</h3>
          
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{new Date(material.uploadDate).toLocaleDateString("zh-CN")}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>上传人: {material.uploader}</span>
            </div>
            
            {material.approver && (
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>审批人: {material.approver}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye size={16} className="mr-1" /> 预览
          </Button>
          
          {showDownload && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleDownload}
            >
              <Download size={16} className="mr-1" /> 下载原图
            </Button>
          )}
          
          {showActions && onApprove && onReject && (
            <>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => onApprove(material.id)}
              >
                <ThumbsUp size={16} className="mr-1" /> 批准
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={() => onReject(material.id)}
              >
                <ThumbsDown size={16} className="mr-1" /> 拒绝
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{material.title}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 max-h-[70vh] overflow-auto">
            <img 
              src={material.previewUrl} 
              alt={material.title}
              className="w-full h-auto object-contain"
            />
          </div>
          
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">上传人: {material.uploader}</p>
              <p className="text-sm text-gray-500">上传日期: {new Date(material.uploadDate).toLocaleDateString("zh-CN")}</p>
            </div>
            
            {showDownload && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-2" /> 下载原图
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaterialCard;
