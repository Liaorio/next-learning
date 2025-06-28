"use client";
import { useActionState } from 'react';
import { useState, useRef } from 'react';
import { createCustomer } from '@/app/lib/actions';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function CreateCustomerPage() {
  const [state, formAction] = useActionState(createCustomer, { errors: {}, message: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  }

  async function processFile(file: File) {
    // Client-side validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed');
      return;
    }

    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 1MB');
      return;
    }

    setUploadError('');
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload-avatar', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed');
        return;
      }
      
      setAvatarUrl(data.url);
    } catch {
      setUploadError('Upload failed, please try again');
    } finally {
      setUploading(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Customer Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Customer Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter customer name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="name-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 mb-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          {/* Customer Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="email-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 mb-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          {/* Avatar Upload */}
          <div className="mb-4">
            <label htmlFor="avatar" className="mb-2 block text-sm font-medium">
              Avatar Upload
            </label>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              required
              aria-describedby="avatar-error"
            />
            
            {/* Custom upload button */}
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 hover:border-gray-400 hover:bg-gray-50
                ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`
                  rounded-full p-3 transition-colors duration-200
                  ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  {uploading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  ) : (
                    <ArrowUpTrayIcon className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG, GIF formats, file size must be less than 1MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upload Status and Preview */}
          {uploadError && (
            <div className="mb-4 rounded-md bg-red-50 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{uploadError}</p>
                </div>
              </div>
            </div>
          )}
          
          {avatarUrl && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20">
                    <Image 
                      src={avatarUrl} 
                      alt="Avatar preview" 
                      fill
                      className="rounded-full object-cover border-2 border-green-200" 
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-green-800">Upload successful</p>
                  </div>
                  <p className="mt-1 text-sm text-green-700">Your avatar has been uploaded successfully</p>
                </div>
              </div>
              <input type="hidden" name="image_url" value={avatarUrl} />
            </div>
          )}
          
          <div id="avatar-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image_url &&
              state.errors.image_url.map((error: string) => (
                <p className="mt-2 mb-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/customers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={!avatarUrl || uploading}>
            Create Customer
          </Button>
        </div>
        
        {state?.message && (
          <div className="mt-4">
            <p className="text-red-500 text-sm">{state.message}</p>
          </div>
        )}
      </form>
    </main>
  );
} 