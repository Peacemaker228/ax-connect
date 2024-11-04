'use client'

import { FC } from 'react'
import '@uploadthing/react/styles.css'
import { UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
import { X } from 'lucide-react'

interface IFileUploadProps {
  onChangeAction: (url?: string) => void
  value: string
  endpoint: 'messageFile' | 'serverImage'
}

export const FileUpload: FC<IFileUploadProps> = ({ endpoint, value, onChangeAction }) => {
  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          type="button"
          onClick={() => onChangeAction('')}
          className="bg-rose-500 text-white rounded-full p-1 absolute top-0 right-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChangeAction(res[0]?.url)
      }}
      onUploadError={(err: Error) => {
        console.warn(err)
      }}
    />
  )
}
