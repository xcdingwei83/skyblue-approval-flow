
import { useEffect, useState } from "react";
import { Material } from "@/types/material";
import { getMaterialsByStatus, updateMaterialStatus } from "@/services/materialService";
import PageHeader from "@/components/layout/PageHeader";
import MaterialCard from "@/components/materials/MaterialCard";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Search, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

const PublishedMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [approvedMaterials, setApprovedMaterials] = useState<Material[]>([]);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const { user } = useAuth();
  
  const canPublish = user && (user.role === "admin" || user.role === "approver");

  useEffect(() => {
    // Get published materials
    const publishedMaterials = getMaterialsByStatus("published");
    setMaterials(publishedMaterials);
    setFilteredMaterials(publishedMaterials);
    
    // Get approved but not published materials
    if (canPublish) {
      const approved = getMaterialsByStatus("approved");
      setApprovedMaterials(approved);
    }
  }, [canPublish]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMaterials(materials);
    } else {
      const filtered = materials.filter(
        material => material.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMaterials(filtered);
    }
  }, [searchTerm, materials]);

  const handlePublish = (material: Material) => {
    const updated = updateMaterialStatus(material.id, "published");
    
    if (updated) {
      toast.success(`已发布资料: ${material.title}`);
      
      // Refresh material lists
      const publishedMaterials = getMaterialsByStatus("published");
      setMaterials(publishedMaterials);
      setFilteredMaterials(publishedMaterials);
      
      const approved = getMaterialsByStatus("approved");
      setApprovedMaterials(approved);
      
      setPublishDialogOpen(false);
    } else {
      toast.error("发布失败，请稍后再试");
    }
  };

  return (
    <>
      <PageHeader 
        title="已发布资料"
        description="浏览和下载已发布的图片资料"
        action={
          canPublish && approvedMaterials.length > 0 ? (
            <Button onClick={() => setPublishDialogOpen(true)}>
              <Upload size={16} className="mr-1" />
              发布已批准资料
            </Button>
          ) : null
        }
      />
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索资料..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <MaterialCard 
              key={material.id}
              material={material}
              showDownload
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {searchTerm ? (
            <p className="text-muted-foreground">没有找到匹配「{searchTerm}」的资料</p>
          ) : (
            <p className="text-muted-foreground">暂无已发布资料</p>
          )}
        </div>
      )}
      
      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>发布已批准的资料</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-h-[60vh] overflow-y-auto">
            {approvedMaterials.map(material => (
              <div key={material.id} className="border rounded-lg p-3 flex flex-col h-full">
                <div className="aspect-video rounded-md overflow-hidden mb-3">
                  <img 
                    src={material.previewUrl} 
                    alt={material.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <h3 className="font-medium text-sm mb-1 truncate">{material.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">审批人: {material.approver}</p>
                
                <div className="mt-auto">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handlePublish(material)}
                  >
                    发布
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublishedMaterials;
