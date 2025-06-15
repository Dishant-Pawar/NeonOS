
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePDF } from './PDFContext';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { AnnotationLayer } from './AnnotationLayer';
import { toast } from 'sonner';

// Set up PDF.js worker - use a more reliable approach
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PDFViewer: React.FC = () => {
  const { state, setCurrentPage, loadPDF } = usePDF();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log('PDF loaded successfully with', numPages, 'pages');
    toast.success(`PDF loaded with ${numPages} pages`);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error);
    toast.error('Error loading PDF document');
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  }, [numPages, setCurrentPage]);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleFileDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        await loadPDF(file);
      } catch (error) {
        toast.error('Error loading dropped PDF');
      }
    }
  }, [loadPDF]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const calculatePageWidth = useCallback(() => {
    if (viewerRef.current) {
      const containerWidth = viewerRef.current.clientWidth - 80;
      const scaledWidth = Math.min(containerWidth, 800) * (state.zoom / 100);
      setPageWidth(scaledWidth);
    }
  }, [state.zoom]);

  useEffect(() => {
    calculatePageWidth();
    const handleResize = () => calculatePageWidth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePageWidth]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!state.pdfFile) {
    return (
      <div 
        className="flex-1 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg m-4"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF loaded</h3>
          <p className="text-gray-600 mb-4">
            Drop a PDF file here or click the Open button to get started
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Choose PDF File
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log('Loading PDF file:', file.name);
              try {
                await loadPDF(file);
              } catch (error) {
                console.error('Failed to load PDF:', error);
                toast.error('Error loading PDF');
              }
            }
          }}
          className="hidden"
        />
      </div>
    );
  }

  console.log('Rendering PDF with file:', state.pdfFile?.name);

  return (
    <div ref={viewerRef} className="flex-1 flex flex-col bg-gray-100">
      {/* Page Navigation */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(state.currentPage - 1)}
            disabled={state.currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={state.currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
              min={1}
              max={numPages}
            />
            <span className="text-sm text-gray-600">of {numPages}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(state.currentPage + 1)}
            disabled={state.currentPage >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreen}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4 bg-gray-200">
        <div className="flex justify-center">
          <div className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300">
            <Document
              file={state.pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                cMapPacked: true,
                standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
              }}
              loading={
                <div className="flex items-center justify-center p-12 min-h-[600px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <span className="text-gray-600">Loading PDF...</span>
                  </div>
                </div>
              }
              error={
                <div className="flex items-center justify-center p-12 min-h-[600px]">
                  <div className="text-center">
                    <div className="text-red-500 mb-2 text-2xl">⚠️</div>
                    <span className="text-red-600 block mb-2">Failed to load PDF</span>
                    <span className="text-sm text-gray-500">Try selecting a different PDF file</span>
                  </div>
                </div>
              }
            >
              <Page
                pageNumber={state.currentPage}
                width={pageWidth}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={
                  <div className="flex items-center justify-center p-8 min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center p-8 min-h-[400px]">
                    <span className="text-red-600">Error loading page</span>
                  </div>
                }
                className="shadow-lg"
              />
            </Document>
            
            {/* Annotation Layer */}
            <AnnotationLayer 
              pageNumber={state.currentPage}
              width={pageWidth}
              rotation={rotation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
