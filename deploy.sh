
#!/bin/bash

# 资料审批系统部署脚本
echo "====== 资料审批系统部署脚本 ======"

# 构建前端代码
echo "正在构建前端代码..."
npm run build

if [ $? -ne 0 ]; then
    echo "构建失败，请检查错误信息。"
    exit 1
fi

# 确认目标目录
echo "请确认您的Hostinger public_html目录路径:"
read -p "路径 (默认: /home/username/public_html): " TARGET_DIR
TARGET_DIR=${TARGET_DIR:-/home/username/public_html}

# 确认备份
read -p "是否备份当前网站文件? (y/n): " BACKUP
if [ "$BACKUP" = "y" ] || [ "$BACKUP" = "Y" ]; then
    BACKUP_DIR="${TARGET_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
    echo "正在备份当前网站到 $BACKUP_DIR..."
    cp -r $TARGET_DIR $BACKUP_DIR
    echo "备份完成。"
fi

# 上传前端文件
echo "正在上传文件到 $TARGET_DIR..."
cp -r ./dist/* $TARGET_DIR/

echo "部署前端代码完成！"

# 创建或更新.htaccess文件
echo "创建.htaccess文件用于单页应用路由..."
cat > "$TARGET_DIR/.htaccess" << EOL
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOL

echo "====== 部署完成 ======"
echo "网站地址: https://f.12459.xyz"
