#!/bin/bash
echo "🚀 جاري إضافة وتحديث الملفات..."
git add src/components/common/TabNavigation.tsx
git commit -m "Build: Update navigation tabs to include Admin and Mining views"
echo "📤 جاري الدفع إلى GitHub..."
git push origin main
echo "✨ تم الرفع والتحديث بنجاح!"
