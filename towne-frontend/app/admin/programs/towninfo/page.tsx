'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

function TownInfoManagement() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">마을 관리</h1>
          <p className="text-gray-600 mt-1">마을 정보를 관리합니다.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <p>마을 관리 기능은 준비 중입니다.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function TownInfoPage() {
  return (
    <AdminProtectedRoute>
      <TownInfoManagement />
    </AdminProtectedRoute>
  );
}
