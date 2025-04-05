
import { useEffect, useState } from "react";
import { MaterialStatus, Material } from "@/types/material";
import { getMaterialsByStatus, updateMaterialStatus } from "@/services/materialService";
import PageHeader from "@/components/layout/PageHeader";
import MaterialCard from "@/components/materials/MaterialCard";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ApproveMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [activeTab, setActiveTab] = useState<MaterialStatus>("pending");
  const { user } = useAuth();

  useEffect(() => {
    loadMaterials(activeTab);
  }, [activeTab]);

  const loadMaterials = (status: MaterialStatus | "all") => {
    const fetchedMaterials = status === "all" 
      ? getMaterialsByStatus(["pending", "approved", "rejected"]) 
      : getMaterialsByStatus(status);
    
    setMaterials(fetchedMaterials);
  };

  const handleApprove = (materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
      setApproveDialogOpen(true);
    }
  };

  const handleReject = (materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
      setRejectDialogOpen(true);
    }
  };

  const confirmApprove = () => {
    if (!selectedMaterial || !user) return;
    
    const updatedMaterial = updateMaterialStatus(selectedMaterial.id, "approved", user.name);
    
    if (updatedMaterial) {
      toast.success(`已批准资料: ${selectedMaterial.title}`);
      loadMaterials(activeTab);
    } else {
      toast.error("批准失败，请稍后再试");
    }
    
    setApproveDialogOpen(false);
  };

  const confirmReject = () => {
    if (!selectedMaterial || !user) return;
    
    const updatedMaterial = updateMaterialStatus(selectedMaterial.id, "rejected", user.name);
    
    if (updatedMaterial) {
      toast.info(`已拒绝资料: ${selectedMaterial.title}`);
      loadMaterials(activeTab);
    } else {
      toast.error("操作失败，请稍后再试");
    }
    
    setRejectDialogOpen(false);
  };

  return (
    <>
      <PageHeader 
        title="审批资料"
        description="审阅并批准或拒绝上传的资料"
      />
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={(value) => setActiveTab(value as MaterialStatus)}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending">待审批</TabsTrigger>
          <TabsTrigger value="approved">已批准</TabsTrigger>
          <TabsTrigger value="rejected">已拒绝</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map(material => (
                <MaterialCard 
                  key={material.id}
                  material={material}
                  onApprove={activeTab === "pending" ? handleApprove : undefined}
                  onReject={activeTab === "pending" ? handleReject : undefined}
                  showActions={activeTab === "pending"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无{activeTab === "pending" ? "待审批" : activeTab === "approved" ? "已批准" : "已拒绝"}资料</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批准资料</DialogTitle>
            <DialogDescription>
              您确定要批准「{selectedMaterial?.title}」吗？批准后，该资料将可以发布。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>取消</Button>
            <Button onClick={confirmApprove}>确认批准</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>拒绝资料</DialogTitle>
            <DialogDescription>
              您确定要拒绝「{selectedMaterial?.title}」吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={confirmReject}>确认拒绝</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApproveMaterials;
