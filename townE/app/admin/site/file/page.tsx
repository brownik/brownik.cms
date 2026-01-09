'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

interface FileItem {
  key: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  filePath: string;
  fileType: string;
  insertDate: string;
}

function FileManagement() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const handleFileSelect = (fileKey: number) => {
    setSelectedFiles((prev) =>
      prev.includes(fileKey)
        ? prev.filter((key) => key !== fileKey)
        : [...prev, fileKey]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.key));
    }
  };

  const handleUpload = () => {
    if (uploadFiles.length === 0) {
      alert('업로드할 파일을 선택하세요.');
      return;
    }
    // TODO: API 호출하여 파일 업로드
    alert('파일이 업로드되었습니다.');
    setUploadFiles([]);
  };

  const handleDelete = (fileKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 파일 삭제
    alert('파일이 삭제되었습니다.');
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) {
      alert('삭제할 파일을 선택하세요.');
      return;
    }
    if (!confirm(`선택한 ${selectedFiles.length}개의 파일을 삭제하시겠습니까?`)) return;
    // TODO: API 호출하여 선택된 파일 삭제
    alert('선택한 파일이 삭제되었습니다.');
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">파일 관리</h1>
            <p className="text-gray-600 mt-1">사이트 파일을 업로드하고 관리합니다.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {viewMode === 'list' ? '그리드 보기' : '목록 보기'}
            </button>
          </div>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">파일 업로드</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setUploadFiles(Array.from(e.target.files));
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-gray-600 font-medium">
                클릭하여 파일 선택 또는 드래그 앤 드롭
              </span>
              <span className="text-sm text-gray-500 mt-2">
                여러 파일을 동시에 업로드할 수 있습니다.
              </span>
            </label>
            {uploadFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                ))}
                <button
                  onClick={handleUpload}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  업로드
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 파일 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedFiles.length === files.length && files.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span className="text-sm text-gray-600">
                선택됨: {selectedFiles.length} / 전체: {files.length}
              </span>
            </div>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              선택 삭제
            </button>
          </div>

          {viewMode === 'list' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    선택
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    파일명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    파일 타입
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    파일 크기
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    업로드일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      등록된 파일이 없습니다.
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file.key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.key)}
                          onChange={() => handleFileSelect(file.key)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {file.fileType.startsWith('image/') ? '🖼️' : '📄'}
                          </span>
                          <span>{file.originalFileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.fileType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(file.fileSize)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.insertDate).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <a
                            href={file.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            다운로드
                          </a>
                          <button
                            onClick={() => handleDelete(file.key)}
                            className="text-red-600 hover:text-red-800"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  등록된 파일이 없습니다.
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.key}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.key)}
                        onChange={() => handleFileSelect(file.key)}
                        className="rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="text-center mb-2">
                      <span className="text-4xl">
                        {file.fileType.startsWith('image/') ? '🖼️' : '📄'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate mb-1">
                      {file.originalFileName}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {formatFileSize(file.fileSize)}
                    </div>
                    <div className="flex gap-2 text-xs">
                      <a
                        href={file.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        다운로드
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.key);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function FilePage() {
  return (
    <AdminProtectedRoute>
      <FileManagement />
    </AdminProtectedRoute>
  );
}
