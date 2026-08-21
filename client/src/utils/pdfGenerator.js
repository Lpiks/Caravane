export const generateStudioPDF = async ({ id, data, modulesList, setCameraPreset }) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // 1. Capture 3D Images FIRST
    const views = ['iso', 'top', 'inside', 'side'];
    const images = [];
    const webglCanvas = document.querySelector('canvas');

    for (const view of views) {
      setCameraPreset(view);
      // Wait for React to re-render, camera to move, and frame to draw
      await new Promise(res => setTimeout(res, 800)); 
      images.push({ view, dataUrl: webglCanvas.toDataURL('image/jpeg', 0.9) });
    }

    // Reset camera
    setCameraPreset('iso');

    // 2. Construct PDF
    // Main Background
    doc.setFillColor(17, 18, 22); // #111216
    doc.rect(0, 0, 210, 297, 'F');

    // Top Header (Terracotta)
    doc.setFillColor(211, 84, 0); // #d35400
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text('KOUINI CARAVANE', 105, 20, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(`DESIGN ORDER: #${id.slice(-8).toUpperCase()}`, 105, 28, { align: 'center' });

    // 3. Client & Vehicle Info Panels
    let startY = 45;
    
    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(211, 84, 0);
    doc.text(data.clientInfo.name.toUpperCase(), 15, startY);
    
    startY += 10;
    
    // Panel 1: Client Details
    doc.setFillColor(26, 28, 35); // #1A1C23
    doc.roundedRect(15, startY, 85, 30, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 150, 150);
    doc.text("CLIENT CONTACT", 20, startY + 8);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(`${data.clientInfo.email}`, 20, startY + 16);
    doc.text(`${data.clientInfo.phone}`, 20, startY + 24);

    // Panel 2: Base Vehicle
    doc.setFillColor(26, 28, 35); // Explicitly set it again just in case
    doc.roundedRect(110, startY, 85, 30, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 150, 150);
    doc.text("BASE VEHICLE", 115, startY + 8);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`${data.baseVehicle.replace('-', ' ').toUpperCase()}`, 115, startY + 20);

    startY += 40;

    // Bill of Materials
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(211, 84, 0);
    doc.text("BILL OF MATERIALS", 15, startY);
    
    startY += 6;
    doc.setFillColor(26, 28, 35);
    const bomHeight = Math.max(30, modulesList.length * 8 + 10);
    doc.roundedRect(15, startY, 180, bomHeight, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(230, 230, 230);
    
    let bomY = startY + 10;
    modulesList.forEach((comp, idx) => {
      const name = comp.name || comp.type || comp.typeId;
      const dims = comp.dimensions ? `(${comp.dimensions[0]}m x ${comp.dimensions[2]}m x ${comp.dimensions[1]}m)` : '';
      doc.text(`•  ${name} ${dims}`, 20, bomY);
      bomY += 8;
      
      if (bomY > 270) {
        doc.addPage();
        doc.setFillColor(17, 18, 22);
        doc.rect(0, 0, 210, 297, 'F');
        bomY = 20;
        doc.setTextColor(230, 230, 230);
      }
    });

    startY += bomHeight + 15;

    // Message
    if (data.message) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(211, 84, 0);
      doc.text("ADDITIONAL NOTES", 15, startY);
      
      startY += 6;
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(200, 200, 200);
      const splitMsg = doc.splitTextToSize(`"${data.message}"`, 180);
      
      doc.setFillColor(26, 28, 35);
      doc.roundedRect(15, startY, 180, (splitMsg.length * 6) + 10, 3, 3, 'F');
      
      doc.text(splitMsg, 20, startY + 8);
      startY += (splitMsg.length * 6) + 20;
    }

    // 4. Add 3D snapshots
    if (startY > 160) {
      doc.addPage();
      doc.setFillColor(17, 18, 22);
      doc.rect(0, 0, 210, 297, 'F');
      // Top Header (Terracotta) on new page too
      doc.setFillColor(211, 84, 0);
      doc.rect(0, 0, 210, 15, 'F');
      startY = 30;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(211, 84, 0);
    doc.text("3D DESIGN RENDERINGS", 15, startY);
    
    startY += 8;

    const imgWidth = 85;
    const imgHeight = 55;
    
    const drawImageWithBorder = (imgData, x, y, label) => {
      if (!imgData) return;
      // Border
      doc.setDrawColor(211, 84, 0); // Terracotta border
      doc.setLineWidth(0.5);
      doc.rect(x - 1, y - 1, imgWidth + 2, imgHeight + 2);
      // Image
      doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
      // Label
      doc.setFillColor(211, 84, 0);
      doc.rect(x, y + imgHeight - 8, imgWidth, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(label, x + (imgWidth/2), y + imgHeight - 2.5, { align: 'center' });
    };

    // Iso (Top-left)
    drawImageWithBorder(images[0]?.dataUrl, 15, startY, "Isometric View");
    // Top (Top-right)
    drawImageWithBorder(images[1]?.dataUrl, 110, startY, "Top-Down View");
    
    // Inside (Bottom-left)
    drawImageWithBorder(images[2]?.dataUrl, 15, startY + imgHeight + 10, "Interior View");
    // Side (Bottom-right)
    drawImageWithBorder(images[3]?.dataUrl, 110, startY + imgHeight + 10, "Side Profile View");

    const safeName = data.clientInfo.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
    doc.save(`Order-${safeName}.pdf`);

  } catch (error) {
    console.error("PDF Gen Error:", error);
    throw error;
  }
};
