
# 资料审批系统 - 部署指南

## 系统介绍

这是一个轻量级资料审批系统，专为图片资料的审批和发布设计。系统包含以下功能：

- 仪表盘：总览统计信息
- 上传资料：提交需要审批的图片资料
- 审批资料：批准或拒绝上传的资料
- 已发布资料：浏览和下载已发布的资料
- 任务清单：查看待处理的审批任务

## 环境要求

- Web服务器：Apache/Nginx
- PHP：7.4+
- MySQL：5.7+
- Node.js：16+（仅用于构建代码）
- npm：8+（仅用于构建代码）

## 数据库设置

1. 登录到MySQL：
```
mysql -u u153151172_fuser -p
```

2. 使用数据库：
```
USE u153151172_fdat;
```

3. 运行数据库设置脚本：
```
SOURCE database_setup.sql;
```

或者通过phpMyAdmin导入`database_setup.sql`文件。

### 数据库结构

系统使用以下表：

1. **users** - 用户信息
   - id: 自增主键
   - username: 用户名（唯一）
   - password: 密码（bcrypt加密）
   - name: 显示名称
   - role: 角色（admin/approver/user）
   - created_at: 创建时间
   - updated_at: 更新时间

2. **materials** - 资料信息
   - id: 自增主键
   - title: 资料标题
   - description: 资料描述
   - preview_url: 预览图片URL
   - original_url: 原始图片URL
   - upload_date: 上传时间
   - uploader_id: 上传者ID（外键）
   - approver_id: 审批人ID（外键）
   - status: 状态（pending/approved/rejected/published）
   - approval_date: 审批时间

## 部署步骤

### 1. 准备代码

克隆项目仓库：

```bash
git clone <项目仓库URL>
cd <项目文件夹>
```

安装依赖：

```bash
npm install
```

### 2. 配置环境变量

创建或编辑`.env`文件：

```
# 数据库配置
DB_HOST=localhost
DB_USER=u153151172_fuser
DB_PASSWORD=NNXXfptx2021.
DB_NAME=u153151172_fdat

# 网站域名
VITE_APP_URL=https://f.12459.xyz
```

### 3. 构建项目

```bash
npm run build
```

### 4. 部署到服务器

使用部署脚本：

```bash
chmod +x deploy.sh
./deploy.sh
```

按提示操作，指定Hostinger的public_html目录。

或者手动部署：

1. 将`dist`文件夹的内容上传到服务器的`public_html`目录
2. 确保创建了正确的`.htaccess`文件以支持SPA路由

### 5. 创建API接口

项目需要创建以下PHP API接口，放置在public_html/api目录下：

1. login.php - 用户登录
2. upload.php - 上传资料
3. materials.php - 获取资料列表
4. approve.php - 审批资料

示例API接口文件将在单独的存储库中提供。

## 用户管理

### 默认账号

系统预设了三个账号：

1. 管理员：
   - 用户名：admin
   - 密码：admin123

2. 审批人：
   - 用户名：approver
   - 密码：approve123

3. 普通用户：
   - 用户名：user
   - 密码：user123

### 添加新用户

通过MySQL添加新用户：

```sql
INSERT INTO `users` (`username`, `password`, `name`, `role`) VALUES
('新用户名', '$2y$10$加密密码', '显示名称', '角色');
```

注意：密码需要使用bcrypt加密。可以使用在线工具或PHP的password_hash函数生成加密密码。

## 技术支持

如遇问题，请联系系统管理员。
