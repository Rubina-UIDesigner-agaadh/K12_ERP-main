import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../components/ui/Tabs';
import {
  UploadIcon,
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  LinkIcon,
  PlusIcon } from
'lucide-react';
export function MediaAttachments() {
  const [tab, setTab] = useState('images');
  const mediaItems = [
  {
    name: 'Annual Day Banner.jpg',
    type: 'Image',
    size: '2.4 MB',
    uploaded: '2025-06-10',
    post: 'Annual Day 2025'
  },
  {
    name: 'Sports Day Highlights.mp4',
    type: 'Video',
    size: '45 MB',
    uploaded: '2025-06-09',
    post: 'Sports Day'
  },
  {
    name: 'Fee Circular June 2025.pdf',
    type: 'PDF',
    size: '0.8 MB',
    uploaded: '2025-06-08',
    post: 'Fee Circular'
  },
  {
    name: 'Science Exhibition Photos.zip',
    type: 'Gallery',
    size: '124 MB',
    uploaded: '2025-06-07',
    post: 'Science Exhibition'
  }];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Media & Attachments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage images, videos, PDFs and external links for
            newsfeed posts
          </p>
        </div>
        <Button variant="primary">
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <Card noPadding>
        <Tabs defaultValue="images" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs / Circulars</TabsTrigger>
            <TabsTrigger value="gallery">Gallery Posts</TabsTrigger>
            <TabsTrigger value="links">External Links</TabsTrigger>
          </TabsList>

          {['images', 'videos', 'pdfs', 'gallery', 'links'].map((tabVal) =>
          <TabsContent key={tabVal} value={tabVal} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                title={`Upload ${tabVal === 'images' ? 'Image' : tabVal === 'videos' ? 'Video' : tabVal === 'pdfs' ? 'PDF' : tabVal === 'gallery' ? 'Gallery' : 'External Link'}`}>

                  {tabVal !== 'links' ?
                <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition-all">
                        {tabVal === 'images' ?
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" /> :
                    tabVal === 'videos' ?
                    <VideoIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" /> :

                    <FileTextIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    }
                        <p className="text-sm font-medium text-gray-600">
                          Drag & drop or click to browse
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {tabVal === 'images' ?
                      'JPG, PNG, WEBP — Max 10MB' :
                      tabVal === 'videos' ?
                      'MP4, MOV — Max 500MB' :
                      'PDF — Max 50MB'}
                        </p>
                      </div>
                      <Select
                    label="Attach to Post"
                    options={[
                    {
                      value: 'new',
                      label: 'Create New Post'
                    },
                    {
                      value: 'annual',
                      label: 'Annual Day 2025'
                    },
                    {
                      value: 'sports',
                      label: 'Sports Day'
                    },
                    {
                      value: 'science',
                      label: 'Science Exhibition'
                    }]
                    } />

                      <Button variant="primary" className="w-full">
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div> :

                <div className="space-y-3">
                      <Input label="URL" placeholder="https://example.com" />
                      <Input
                    label="Link Title"
                    placeholder="Display text for the link" />

                      <Input
                    label="Description"
                    placeholder="Brief description" />

                      <Select
                    label="Attach to Post"
                    options={[
                    {
                      value: 'new',
                      label: 'Create New Post'
                    },
                    {
                      value: 'annual',
                      label: 'Annual Day 2025'
                    }]
                    } />

                      <Button variant="primary" className="w-full">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                }
                </Card>
                <Card title="Recent Uploads">
                  <div className="space-y-2">
                    {mediaItems.map((item, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          {item.type === 'Image' ?
                      <ImageIcon className="w-4 h-4 text-blue-600" /> :
                      item.type === 'Video' ?
                      <VideoIcon className="w-4 h-4 text-purple-600" /> :

                      <FileTextIcon className="w-4 h-4 text-red-600" />
                      }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.size} • {item.uploaded}
                          </p>
                        </div>
                        <Button variant="ghost" className="text-xs h-6 px-2">
                          View
                        </Button>
                      </div>
                  )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </div>);

}