'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

interface Field {
  key: number;
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string;
  order: number;
  useYn: 'Y' | 'N';
}

function FieldManagement() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    label: '',
    required: false,
    options: '',
    order: 0,
    useYn: 'Y' as 'Y' | 'N',
  });

  const fieldTypes = [
    { value: 'text', label: '텍스트' },
    { value: 'textarea', label: '텍스트 영역' },
    { value: 'number', label: '숫자' },
    { value: 'date', label: '날짜' },
    { value: 'select', label: '선택박스' },
    { value: 'radio', label: '라디오 버튼' },
    { value: 'checkbox', label: '체크박스' },
    { value: 'file', label: '파일' },
  ];

  const handleCreate = () => {
    // TODO: API 호출하여 필드 생성
    alert('필드가 생성되었습니다.');
    setShowForm(false);
    resetForm();
  };

  const handleUpdate = () => {
    // TODO: API 호출하여 필드 수정
    alert('필드가 수정되었습니다.');
    setShowForm(false);
    setSelectedField(null);
  };

  const handleDelete = (fieldKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 필드 삭제
    alert('필드가 삭제되었습니다.');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'text',
      label: '',
      required: false,
      options: '',
      order: 0,
      useYn: 'Y',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">필드 관리</h1>
            <p className="text-gray-600 mt-1">동적 필드를 생성하고 관리합니다.</p>
          </div>
          <button
            onClick={() => {
              setSelectedField(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 필드 추가
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 필드 목록 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">필드 목록</h2>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>등록된 필드가 없습니다.</p>
                <p className="text-sm mt-2">필드를 추가하여 시작하세요.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedField(field);
                      setFormData({
                        name: field.name,
                        type: field.type,
                        label: field.label,
                        required: field.required,
                        options: field.options || '',
                        order: field.order,
                        useYn: field.useYn,
                      });
                      setShowForm(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{field.label}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          필드명: {field.name} | 타입: {fieldTypes.find((t) => t.value === field.type)?.label} | 순서: {field.order}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            field.useYn === 'Y'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {field.useYn === 'Y' ? '사용' : '미사용'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(field.key);
                          }}
                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 필드 폼 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedField ? '필드 수정' : '필드 추가'}
            </h2>
            {showForm ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  selectedField ? handleUpdate() : handleCreate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    필드명 (영문) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="field_name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    라벨 *
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="필드 라벨"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    필드 타입 *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {(formData.type === 'select' || formData.type === 'radio' || formData.type === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      옵션 (줄바꿈으로 구분)
                    </label>
                    <textarea
                      value={formData.options}
                      onChange={(e) =>
                        setFormData({ ...formData, options: e.target.value })
                      }
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="옵션1&#10;옵션2&#10;옵션3"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    순서
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.required}
                      onChange={(e) =>
                        setFormData({ ...formData, required: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">필수 입력</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사용 여부
                    </label>
                    <select
                      value={formData.useYn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          useYn: e.target.value as 'Y' | 'N',
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Y">사용</option>
                      <option value="N">미사용</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedField ? '수정' : '추가'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedField(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>필드를 선택하거나 추가 버튼을 클릭하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function FieldsPage() {
  return (
    <AdminProtectedRoute>
      <FieldManagement />
    </AdminProtectedRoute>
  );
}
