
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Image } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { uploadFile } from "@/services/materialService";
import PageHeader from "@/components/layout/PageHeader";

const UploadMaterial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("请上传图片文件");
      return;
    }

    setFile(selectedFile);

    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("请选择要上传的图片");
      return;
    }

    if (!title.trim()) {
      toast.error("请输入资料标题");
      return;
    }

    setLoading(true);
    try {
      await uploadFile(file, title, description, user?.name || "未知用户");
      
      toast.success("资料上传成功，等待审批");
      
      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("上传失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="上传资料"
        description="上传需要审批的图片资料"
      />
      
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">资料标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入资料标题"
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">资料描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入资料描述（可选）"
                disabled={loading}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">上传图片</Label>
              
              {!preview ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => document.getElementById("file")?.click()}>
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    点击上传图片，或将图片拖到此处
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    支持: JPG, PNG, GIF
                  </p>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative mt-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={preview}
                      alt="预览图"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                    onClick={clearFile}
                    disabled={loading}
                  >
                    <X size={16} />
                  </Button>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {file?.name} ({Math.round(file?.size / 1024)} KB)
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!file || !title || loading}
            >
              {loading ? "上传中..." : "上传资料"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default UploadMaterial;
