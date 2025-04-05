
import { Material, MaterialStatus } from "@/types/material";

// Mock data for development
const mockMaterials: Material[] = [
  {
    id: 1,
    title: "宣传海报设计稿",
    description: "公司年度活动宣传海报",
    previewUrl: "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    originalUrl: "https://images.unsplash.com/photo-1573867639040-6dd25fa5f597?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    uploadDate: "2023-10-15T10:30:00.000Z",
    uploader: "张三",
    status: "pending",
  },
  {
    id: 2,
    title: "产品包装设计",
    description: "新产品包装设计方案",
    previewUrl: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    originalUrl: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    uploadDate: "2023-10-12T09:15:00.000Z",
    uploader: "李四",
    approver: "王经理",
    status: "approved",
    approvalDate: "2023-10-14T14:20:00.000Z",
  },
  {
    id: 3,
    title: "网站主页设计",
    description: "公司网站首页改版设计",
    previewUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    originalUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    uploadDate: "2023-10-10T16:45:00.000Z",
    uploader: "王五",
    approver: "张经理",
    status: "rejected",
    approvalDate: "2023-10-11T11:30:00.000Z",
  },
  {
    id: 4,
    title: "社交媒体广告图",
    description: "微信推广广告设计",
    previewUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    originalUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    uploadDate: "2023-10-08T13:20:00.000Z",
    uploader: "赵六",
    approver: "李总监",
    status: "published",
    approvalDate: "2023-10-09T10:15:00.000Z",
  },
  {
    id: 5,
    title: "产品展示图",
    description: "新品发布展示图",
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    originalUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    uploadDate: "2023-10-05T09:10:00.000Z",
    uploader: "刘七",
    status: "pending",
  }
];

// In development mode, use localStorage to persist data
const LOCAL_STORAGE_KEY = "approval_system_materials";

const initMaterials = () => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockMaterials));
      return [...mockMaterials];
    }
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Failed to parse stored materials:", error);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockMaterials));
      return [...mockMaterials];
    }
  }
  return [...mockMaterials];
};

let materials = initMaterials();

// Save materials to localStorage
const saveMaterials = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(materials));
  }
};

// Get all materials
export const getAllMaterials = (): Material[] => {
  return [...materials];
};

// Get materials by status
export const getMaterialsByStatus = (status: MaterialStatus | MaterialStatus[]): Material[] => {
  const statusArray = Array.isArray(status) ? status : [status];
  return materials.filter(material => statusArray.includes(material.status));
};

// Get material by ID
export const getMaterialById = (id: number): Material | undefined => {
  return materials.find(material => material.id === id);
};

// Create new material
export const createMaterial = (material: Omit<Material, "id" | "status">): Material => {
  const newMaterial: Material = {
    ...material,
    id: materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1,
    status: "pending",
  };
  
  materials = [...materials, newMaterial];
  saveMaterials();
  return newMaterial;
};

// Update material status
export const updateMaterialStatus = (
  id: number, 
  status: MaterialStatus, 
  approver?: string
): Material | null => {
  const materialIndex = materials.findIndex(m => m.id === id);
  
  if (materialIndex === -1) return null;
  
  const updatedMaterial = {
    ...materials[materialIndex],
    status,
    ...(approver && { approver }),
    ...(status !== "pending" && { approvalDate: new Date().toISOString() }),
  };
  
  materials = [
    ...materials.slice(0, materialIndex),
    updatedMaterial,
    ...materials.slice(materialIndex + 1),
  ];
  
  saveMaterials();
  return updatedMaterial;
};

// Get pending task count
export const getPendingTaskCount = (): number => {
  return materials.filter(m => m.status === "pending").length;
};

// Upload a file (mock implementation)
export const uploadFile = async (file: File, title: string, description: string, uploader: string): Promise<Material> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileUrl = reader.result as string;
      
      setTimeout(() => {
        const newMaterial = createMaterial({
          title,
          description,
          previewUrl: fileUrl,
          originalUrl: fileUrl, // In a real app, this would be a different URL
          uploadDate: new Date().toISOString(),
          uploader,
        });
        
        resolve(newMaterial);
      }, 1000); // Simulate network delay
    };
  });
};
