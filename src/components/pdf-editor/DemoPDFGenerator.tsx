
import React from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { usePDF } from './PDFContext';

export const DemoPDFGenerator: React.FC = () => {
  const { loadPDF } = usePDF();

  const createDemoPDF = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Embed fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      // Page 1 - Title page
      const page1 = pdfDoc.addPage([612, 792]); // Standard letter size
      const { width, height } = page1.getSize();

      // Title
      page1.drawText('Demo PDF Document', {
        x: 50,
        y: height - 100,
        size: 32,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0.8),
      });

      // Subtitle
      page1.drawText('Interactive PDF Editor Test Document', {
        x: 50,
        y: height - 140,
        size: 18,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Description box
      page1.drawRectangle({
        x: 50,
        y: height - 250,
        width: width - 100,
        height: 80,
        borderColor: rgb(0, 0, 0.8),
        borderWidth: 2,
        color: rgb(0.9, 0.95, 1),
      });

      page1.drawText('This is a demo PDF created for testing the PDF editor.', {
        x: 70,
        y: height - 190,
        size: 14,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      page1.drawText('You can annotate, highlight, add shapes, and edit this document!', {
        x: 70,
        y: height - 210,
        size: 14,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Features list
      const features = [
        '✓ Add text annotations',
        '✓ Draw shapes and lines',
        '✓ Highlight important text',
        '✓ Insert images',
        '✓ Add comments and notes',
        '✓ Save and export changes'
      ];

      page1.drawText('Available Features:', {
        x: 50,
        y: height - 300,
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      features.forEach((feature, index) => {
        page1.drawText(feature, {
          x: 70,
          y: height - 330 - (index * 25),
          size: 12,
          font: helveticaFont,
          color: rgb(0.2, 0.2, 0.2),
        });
      });

      // Decorative elements
      page1.drawCircle({
        x: width - 100,
        y: 150,
        size: 40,
        color: rgb(1, 0.8, 0.2),
        opacity: 0.7,
      });

      page1.drawRectangle({
        x: width - 150,
        y: 100,
        width: 100,
        height: 20,
        color: rgb(0.2, 0.8, 0.2),
        opacity: 0.5,
      });

      // Page 2 - Content page
      const page2 = pdfDoc.addPage([612, 792]);

      page2.drawText('Sample Content Page', {
        x: 50,
        y: height - 80,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      // Sample paragraph
      const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
officia deserunt mollit anim id est laborum.

This text can be highlighted, annotated, and marked up using the PDF editor tools.
Try selecting different tools from the toolbar and interact with this content!`;

      const lines = sampleText.split('\n');
      lines.forEach((line, index) => {
        page2.drawText(line.trim(), {
          x: 50,
          y: height - 140 - (index * 20),
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      });

      // Add some shapes for testing
      page2.drawRectangle({
        x: 400,
        y: height - 200,
        width: 150,
        height: 100,
        borderColor: rgb(0.8, 0, 0),
        borderWidth: 3,
      });

      page2.drawText('Edit Me!', {
        x: 430,
        y: height - 160,
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0.8, 0, 0),
      });

      // Table-like structure
      const tableData = [
        ['Feature', 'Status', 'Notes'],
        ['Text Editing', '✓ Available', 'Add and modify text'],
        ['Annotations', '✓ Available', 'Highlights and comments'],
        ['Shapes', '✓ Available', 'Rectangles, circles, lines'],
        ['Images', '✓ Available', 'Insert and position images']
      ];

      tableData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const isHeader = rowIndex === 0;
          page2.drawText(cell, {
            x: 50 + (colIndex * 150),
            y: height - 400 - (rowIndex * 25),
            size: isHeader ? 12 : 10,
            font: isHeader ? helveticaBoldFont : helveticaFont,
            color: isHeader ? rgb(0, 0, 0.8) : rgb(0, 0, 0),
          });
        });
      });

      // Page 3 - Interactive elements
      const page3 = pdfDoc.addPage([612, 792]);

      page3.drawText('Interactive Testing Page', {
        x: 50,
        y: height - 80,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      // Different font examples
      page3.drawText('Helvetica Font Sample', {
        x: 50,
        y: height - 140,
        size: 16,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      page3.drawText('Times Roman Font Sample', {
        x: 50,
        y: height - 170,
        size: 16,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page3.drawText('Bold Helvetica Font Sample', {
        x: 50,
        y: height - 200,
        size: 16,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      // Color samples
      const colors = [
        { name: 'Red', color: rgb(1, 0, 0) },
        { name: 'Green', color: rgb(0, 1, 0) },
        { name: 'Blue', color: rgb(0, 0, 1) },
        { name: 'Purple', color: rgb(0.5, 0, 1) },
        { name: 'Orange', color: rgb(1, 0.5, 0) }
      ];

      page3.drawText('Color Samples:', {
        x: 50,
        y: height - 250,
        size: 14,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      colors.forEach((colorSample, index) => {
        page3.drawCircle({
          x: 80 + (index * 60),
          y: height - 300,
          size: 20,
          color: colorSample.color,
        });

        page3.drawText(colorSample.name, {
          x: 60 + (index * 60),
          y: height - 340,
          size: 10,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      });

      // Test areas for different tools
      page3.drawText('Test Areas for Tools:', {
        x: 50,
        y: height - 400,
        size: 14,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      // Highlight test area
      page3.drawRectangle({
        x: 50,
        y: height - 480,
        width: 200,
        height: 50,
        color: rgb(1, 1, 0.8),
        borderColor: rgb(0.8, 0.8, 0),
        borderWidth: 1,
      });

      page3.drawText('Highlight this text area', {
        x: 60,
        y: height - 460,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Shape test area
      page3.drawRectangle({
        x: 300,
        y: height - 480,
        width: 200,
        height: 50,
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
      });

      page3.drawText('Draw shapes here', {
        x: 350,
        y: height - 460,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Footer
      [page1, page2, page3].forEach((page, index) => {
        page.drawText(`Page ${index + 1} of 3 - Demo PDF for Testing`, {
          x: 50,
          y: 30,
          size: 10,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
        });
      });

      // Serialize the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Create blob and file
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const file = new File([blob], 'demo-pdf-for-editing.pdf', { type: 'application/pdf' });
      
      // Load the PDF into the editor
      await loadPDF(file);
      
      toast.success('Demo PDF created and loaded! Start editing with the toolbar tools.');
      
    } catch (error) {
      console.error('Error creating demo PDF:', error);
      toast.error('Failed to create demo PDF');
    }
  };

  const downloadDemoPDF = async () => {
    try {
      // Create the same PDF for download
      const pdfDoc = await PDFDocument.create();
      
      // Embed fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Create a simple download version
      const page = pdfDoc.addPage([612, 792]);
      const { width, height } = page.getSize();

      page.drawText('Demo PDF Document', {
        x: 50,
        y: height - 100,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0.8),
      });

      page.drawText('This is a downloadable demo PDF that you can edit in the PDF editor.', {
        x: 50,
        y: height - 150,
        size: 14,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'demo-pdf.pdf';
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Demo PDF downloaded!');
      
    } catch (error) {
      console.error('Error downloading demo PDF:', error);
      toast.error('Failed to download demo PDF');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Demo PDF Generator
        </h3>
        <p className="text-blue-700 mb-4 text-sm">
          Create a demo PDF with sample content that you can edit, annotate, and manipulate using all the PDF editor tools.
        </p>
        
        <div className="flex gap-3">
          <Button 
            onClick={createDemoPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create & Load Demo PDF
          </Button>
          
          <Button 
            onClick={downloadDemoPDF}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Demo PDF
          </Button>
        </div>
        
        <div className="mt-3 text-xs text-blue-600">
          The demo PDF includes: sample text, shapes, colors, tables, and test areas for all editing tools.
        </div>
      </div>
    </div>
  );
};
