
import React, { createContext, useContext, useState, useCallback } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

interface PDFState {
  pdfDoc: PDFDocument | null;
  currentPage: number;
  totalPages: number;
  zoom: number;
  selectedTool: string;
  annotations: any[];
  forms: any[];
  isModified: boolean;
}

interface PDFContextType {
  state: PDFState;
  loadPDF: (file: File) => Promise<void>;
  savePDF: () => Promise<void>;
  addAnnotation: (annotation: any) => void;
  editText: (pageIndex: number, x: number, y: number, text: string) => void;
  addImage: (pageIndex: number, imageFile: File, x: number, y: number) => void;
  mergePDFs: (files: File[]) => Promise<void>;
  splitPDF: (pages: number[]) => Promise<void>;
  compressPDF: () => Promise<void>;
  addWatermark: (text: string, opacity: number) => void;
  addPassword: (password: string) => void;
  convertToWord: () => Promise<void>;
  ocrProcess: (pageIndex: number) => Promise<void>;
  addSignature: (signatureData: string, x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  setCurrentPage: (page: number) => void;
  setSelectedTool: (tool: string) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};

export const PDFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PDFState>({
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    zoom: 100,
    selectedTool: 'select',
    annotations: [],
    forms: [],
    isModified: false
  });

  const loadPDF = useCallback(async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      setState(prev => ({
        ...prev,
        pdfDoc,
        totalPages,
        currentPage: 1,
        isModified: false
      }));
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw error;
    }
  }, []);

  const savePDF = useCallback(async () => {
    if (!state.pdfDoc) return;
    
    try {
      const pdfBytes = await state.pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited-document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw error;
    }
  }, [state.pdfDoc]);

  const addAnnotation = useCallback((annotation: any) => {
    setState(prev => ({
      ...prev,
      annotations: [...prev.annotations, annotation],
      isModified: true
    }));
  }, []);

  const editText = useCallback((pageIndex: number, x: number, y: number, text: string) => {
    if (!state.pdfDoc) return;
    
    try {
      const pages = state.pdfDoc.getPages();
      const page = pages[pageIndex];
      
      page.drawText(text, {
        x,
        y,
        size: 12,
        color: rgb(0, 0, 0)
      });
      
      setState(prev => ({ ...prev, isModified: true }));
    } catch (error) {
      console.error('Error editing text:', error);
    }
  }, [state.pdfDoc]);

  const addImage = useCallback(async (pageIndex: number, imageFile: File, x: number, y: number) => {
    if (!state.pdfDoc) return;
    
    try {
      const imageBytes = await imageFile.arrayBuffer();
      const image = await state.pdfDoc.embedPng(imageBytes);
      const pages = state.pdfDoc.getPages();
      const page = pages[pageIndex];
      
      page.drawImage(image, {
        x,
        y,
        width: 100,
        height: 100
      });
      
      setState(prev => ({ ...prev, isModified: true }));
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }, [state.pdfDoc]);

  const mergePDFs = useCallback(async (files: File[]) => {
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      setState(prev => ({
        ...prev,
        pdfDoc: mergedPdf,
        totalPages: mergedPdf.getPageCount(),
        isModified: true
      }));
    } catch (error) {
      console.error('Error merging PDFs:', error);
    }
  }, []);

  const splitPDF = useCallback(async (pages: number[]) => {
    if (!state.pdfDoc) return;
    
    try {
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(state.pdfDoc, pages);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'split-document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error splitting PDF:', error);
    }
  }, [state.pdfDoc]);

  const compressPDF = useCallback(async () => {
    // PDF compression logic would go here
    console.log('Compressing PDF...');
  }, []);

  const addWatermark = useCallback((text: string, opacity: number) => {
    if (!state.pdfDoc) return;
    
    try {
      const pages = state.pdfDoc.getPages();
      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2 - 50,
          y: height / 2,
          size: 50,
          color: rgb(0.7, 0.7, 0.7),
          opacity
        });
      });
      
      setState(prev => ({ ...prev, isModified: true }));
    } catch (error) {
      console.error('Error adding watermark:', error);
    }
  }, [state.pdfDoc]);

  const addPassword = useCallback((password: string) => {
    // Password protection logic would go here
    console.log('Adding password protection...');
  }, []);

  const convertToWord = useCallback(async () => {
    // Word conversion logic would go here
    console.log('Converting to Word...');
  }, []);

  const ocrProcess = useCallback(async (pageIndex: number) => {
    // OCR processing logic would go here
    console.log('Processing OCR for page:', pageIndex);
  }, []);

  const addSignature = useCallback((signatureData: string, x: number, y: number) => {
    // Signature addition logic would go here
    console.log('Adding signature at:', x, y);
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setSelectedTool = useCallback((tool: string) => {
    setState(prev => ({ ...prev, selectedTool: tool }));
  }, []);

  const value: PDFContextType = {
    state,
    loadPDF,
    savePDF,
    addAnnotation,
    editText,
    addImage,
    mergePDFs,
    splitPDF,
    compressPDF,
    addWatermark,
    addPassword,
    convertToWord,
    ocrProcess,
    addSignature,
    setZoom,
    setCurrentPage,
    setSelectedTool
  };

  return (
    <PDFContext.Provider value={value}>
      {children}
    </PDFContext.Provider>
  );
};
