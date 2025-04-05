
import { useEffect, useState } from "react";
import { getMaterialsByStatus, updateMaterialStatus } from "@/services/materialService";
import { Material } from "@/types/material";
import PageHeader from "@/components/layout/PageHeader";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "@/components/common/StatusBadge";
import { useAuth } from "@/hooks/useAuth";

const TaskList = () => {
  const [pendingMaterials, setPendingMaterials] = useState<Material[]>([]);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPendingMaterials();
  }, []);

  const loadPendingMaterials = () => {
    const materials = getMaterialsByStatus("pending");
    setPendingMaterials(materials);
  };

  const handleApprove = (material: Material) => {
    if (!user) return;
    
    const updated = updateMaterialStatus(material.id, "approved", user.name);
    
    if (updated) {
      toast.success(`已批准资料: ${material.title}`);
      loadPendingMaterials();
    } else {
      toast.error("操作失败，请稍后再试");
    }
  };

  const handleReject = (material: Material) => {
    if (!user) return;
    
    const updated = updateMaterialStatus(material.id, "rejected", user.name);
    
    if (updated) {
      toast.info(`已拒绝资料: ${material.title}`);
      loadPendingMaterials();
    } else {
      toast.error("操作失败，请稍后再试");
    }
  };

  const openPreview = (material: Material) => {
    setPreviewMaterial(material);
    setPreviewDialogOpen(true);
  };

  return (
    <>
      <PageHeader 
        title="任务清单"
        description="待处理的审批任务"
      />
      
      {pendingMaterials.length > 0 ? (
        <div className="space-y-4">
          {pendingMaterials.map(material => (
            <Card key={material.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-auto">
                  <img 
                    src={material.previewUrl} 
                    alt={material.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          上传人: {material.uploader} · 
                          上传时间: {new Date(material.uploadDate).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                      <StatusBadge status={material.status} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-2">
                    <p className="text-sm">
                      {material.description || "无描述信息"}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="mt-auto">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openPreview(material)}
                      >
                        <Eye size={16} className="mr-1" />
                        预览
                      </Button>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(material)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <ThumbsUp size={16} className="mr-1" />
                        批准
                      </Button>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleReject(material)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <ThumbsDown size={16} className="mr-1" />
                        拒绝
                      </Button>
                    </div>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无待处理任务</p>
        </div>
      )}
      
      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewMaterial?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 max-h-[70vh] overflow-auto">
            {previewMaterial && (
              <img 
                src={previewMaterial.previewUrl} 
                alt={previewMaterial.title}
                className="w-full h-auto object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskList;
