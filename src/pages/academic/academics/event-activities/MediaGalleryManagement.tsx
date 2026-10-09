import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../../../components/ui/Tabs';
import {
  UploadIcon,
  ImageIcon,
  VideoIcon,
  FolderIcon,
  TagIcon,
  LockIcon,
  UnlockIcon,
  PlusIcon } from
'lucide-react';
const albums = [
{
  id: 'ALB-001',
  name: 'Annual Sports Day 2025',
  event: 'Sports Day',
  photos: 124,
  videos: 8,
  class: 'All',
  access: 'Parents + Students',
  date: '2025-06-25'
},
{
  id: 'ALB-002',
  name: 'Science Exhibition',
  event: 'Science Expo',
  photos: 67,
  videos: 3,
  class: 'Class 8-10',
  access: 'All',
  date: '2025-06-20'
},
{
  id: 'ALB-003',
  name: 'Class 6-A Activities',
  event: 'Class Activity',
  photos: 34,
  videos: 1,
  class: 'Class 6-A',
  access: 'Class 6-A Parents',
  date: '2025-06-15'
}];

export function MediaGalleryManagement() {
  const [tab, setTab] = useState('images');
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Media & Gallery Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage event photos, videos, albums and access permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderIcon className="w-4 h-4 mr-2" />
            New Album
          </Button>
          <Button variant="primary">
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
        {
          label: 'Total Photos',
          value: '1,248',
          color: 'text-blue-600'
        },
        {
          label: 'Total Videos',
          value: '34',
          color: 'text-purple-600'
        },
        {
          label: 'Albums',
          value: '12',
          color: 'text-green-600'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="text-center p-1">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </Card>
        )}
      </div>

      <Card noPadding>
        <Tabs defaultValue="images" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="images">Image Upload</TabsTrigger>
            <TabsTrigger value="videos">Video Upload</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="class-albums">Class Albums</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="tagging">Tag Students</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Upload Images">
                <div className="space-y-4">
                  <Select
                    label="Select Album"
                    options={albums.map((a) => ({
                      value: a.id,
                      label: a.name
                    }))} />

                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Drag & drop images here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      or click to browse (JPG, PNG, WEBP — Max 10MB each)
                    </p>
                    <Button variant="outline" className="mt-3 text-sm">
                      Browse Files
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Allow Download
                    </span>
                    <button className="relative w-9 h-5 rounded-full bg-blue-500">
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow translate-x-4" />
                    </button>
                  </div>
                  <Button variant="primary" className="w-full">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </Card>
              <Card title="Recent Uploads">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({
                    length: 9
                  }).map((_, i) =>
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">

                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Upload Videos">
                <div className="space-y-4">
                  <Select
                    label="Select Album"
                    options={albums.map((a) => ({
                      value: a.id,
                      label: a.name
                    }))} />

                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all">
                    <VideoIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Drag & drop videos here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      MP4, MOV, AVI — Max 500MB
                    </p>
                    <Button variant="outline" className="mt-3 text-sm">
                      Browse Files
                    </Button>
                  </div>
                  <Input label="Video Title" placeholder="Enter video title" />
                  <Input
                    label="Video Description"
                    placeholder="Brief description" />

                  <Button variant="primary" className="w-full">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              </Card>
              <Card title="Video Library">
                <div className="space-y-3">
                  {[
                  {
                    title: 'Sports Day Highlights',
                    album: 'Annual Sports Day 2025',
                    duration: '4:32',
                    views: 234
                  },
                  {
                    title: 'Science Exhibition Tour',
                    album: 'Science Exhibition',
                    duration: '6:15',
                    views: 189
                  },
                  {
                    title: 'Class 6-A Art Activity',
                    album: 'Class 6-A Activities',
                    duration: '2:48',
                    views: 67
                  }].
                  map((v, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                      <div className="w-12 h-9 bg-gray-200 rounded flex items-center justify-center shrink-0">
                        <VideoIcon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {v.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {v.album} • {v.duration} • {v.views} views
                        </p>
                      </div>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="albums" className="p-5">
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search albums..." className="flex-1" />
              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Album
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {albums.map((album, i) =>
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">

                  <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <FolderIcon className="w-12 h-12 text-blue-400" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800 text-sm">
                      {album.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {album.event} • {album.date}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {album.photos}
                      </span>
                      <span className="flex items-center gap-1">
                        <VideoIcon className="w-3 h-3" />
                        {album.videos}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" className="flex-1 text-xs h-7">
                        View
                      </Button>
                      <Button variant="ghost" className="text-xs h-7 px-2">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="class-albums" className="p-5">
            <div className="flex gap-3 mb-4">
              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Classes'
                },
                {
                  value: '6',
                  label: 'Class 6'
                },
                {
                  value: '7',
                  label: 'Class 7'
                },
                {
                  value: '8',
                  label: 'Class 8'
                },
                {
                  value: '9',
                  label: 'Class 9'
                },
                {
                  value: '10',
                  label: 'Class 10'
                }]
                }
                className="w-40" />

              <Button variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Class Album
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
              'Class 6-A',
              'Class 6-B',
              'Class 7-A',
              'Class 8-A',
              'Class 9-A',
              'Class 10-A',
              'Class 10-B',
              'Class 11-A'].
              map((cls, i) =>
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">

                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FolderIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{cls}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.floor(Math.random() * 50 + 10)} photos
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="p-5">
            <div className="space-y-4">
              {albums.map((album, i) =>
              <Card key={i} title={album.name}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                  {
                    role: 'All Parents',
                    access: true
                  },
                  {
                    role: 'Students',
                    access: true
                  },
                  {
                    role: 'Public',
                    access: false
                  },
                  {
                    role: 'Download',
                    access: album.id !== 'ALB-003'
                  }].
                  map((p, pi) =>
                  <div
                    key={pi}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                        <div className="flex items-center gap-2">
                          {p.access ?
                      <UnlockIcon className="w-3.5 h-3.5 text-green-500" /> :

                      <LockIcon className="w-3.5 h-3.5 text-red-400" />
                      }
                          <span className="text-xs font-medium text-gray-700">
                            {p.role}
                          </span>
                        </div>
                        <button
                      className={`relative w-8 h-4 rounded-full transition-colors ${p.access ? 'bg-green-500' : 'bg-gray-300'}`}>

                          <span
                        className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${p.access ? 'translate-x-4' : 'translate-x-0'}`} />

                        </button>
                      </div>
                  )}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tagging" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Tag Students in Photos">
                <div className="space-y-4">
                  <Select
                    label="Select Album"
                    options={albums.map((a) => ({
                      value: a.id,
                      label: a.name
                    }))} />

                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({
                      length: 6
                    }).map((_, i) =>
                    <div
                      key={i}
                      className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">

                        <ImageIcon className="w-6 h-6 text-gray-400" />
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <TagIcon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Click on a photo to tag students
                  </p>
                </div>
              </Card>
              <Card title="Tagged Students">
                <div className="space-y-2">
                  {[
                  {
                    name: 'Arjun Sharma',
                    class: 'Class 8-A',
                    photos: 12
                  },
                  {
                    name: 'Priya Patel',
                    class: 'Class 6-B',
                    photos: 8
                  },
                  {
                    name: 'Rohan Mehta',
                    class: 'Class 9-A',
                    photos: 15
                  }].
                  map((s, i) =>
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">
                            {s.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-400">{s.class}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {s.photos} photos
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>);

}