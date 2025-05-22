
import React, { useState } from 'react';
import { ModalForm } from '@/components/ui/modal-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormItem } from '@/components/ui/form';
import { Upload, Youtube } from 'lucide-react';
import { toast } from 'sonner';

interface CourseContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CourseContentData) => void;
}

export interface CourseContentData {
  title: string;
  description: string;
  type: 'file' | 'youtube';
  file?: File;
  youtubeUrl?: string;
  moduleNumber: number;
}

export function CourseContentUploadModal({
  isOpen,
  onClose,
  onSubmit
}: CourseContentUploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [moduleNumber, setModuleNumber] = useState(1);
  const [activeTab, setActiveTab] = useState<'file' | 'youtube'>('file');
  const [isDragActive, setIsDragActive] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (activeTab === 'file' && !file) {
      toast.error('Please upload a file');
      return;
    }
    
    if (activeTab === 'youtube' && !youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    // Create data object
    const data: CourseContentData = {
      title,
      description,
      type: activeTab,
      moduleNumber
    };
    
    if (activeTab === 'file' && file) {
      data.file = file;
    } else if (activeTab === 'youtube') {
      data.youtubeUrl = youtubeUrl;
    }
    
    onSubmit(data);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setYoutubeUrl('');
    setModuleNumber(1);
    setActiveTab('file');
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setActiveTab('file');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <ModalForm
      title="Upload Course Content"
      description="Add new content to your course"
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      onSubmit={handleSubmit}
      submitLabel="Upload Content"
    >
      <div className="space-y-4">
        <FormItem>
          <Label htmlFor="title">Content Title</Label>
          <Input
            id="title"
            placeholder="Enter content title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormItem>
        
        <FormItem>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter content description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[100px]"
          />
        </FormItem>
        
        <FormItem>
          <Label htmlFor="moduleNumber">Module Number</Label>
          <Input
            id="moduleNumber"
            type="number"
            min="1"
            value={moduleNumber}
            onChange={(e) => setModuleNumber(Number(e.target.value))}
            required
          />
        </FormItem>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'file' | 'youtube')} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload size={16} />
              File Upload
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube size={16} />
              YouTube Link
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="pt-4">
            <div
              className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <p>File selected: {file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  <p className="mb-2">Drag and drop your file here or</p>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-primary underline">Browse files</span>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Supported formats: PDF, MP4, and other common types
                  </p>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="youtube" className="pt-4">
            <FormItem>
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Please enter the full YouTube video URL
              </p>
            </FormItem>
          </TabsContent>
        </Tabs>
      </div>
    </ModalForm>
  );
}
