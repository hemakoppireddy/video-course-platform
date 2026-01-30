import { jsPDF } from "jspdf";

export function generatePDF(courseTitle, studentName) {
  const doc = new jsPDF();

  // Background
  doc.setFillColor(240, 248, 255);
  doc.rect(0, 0, 210, 297, "F");

  // Title
  doc.setFontSize(28);
  doc.setTextColor(40, 40, 40);
  doc.text("Certificate of Completion", 105, 50, {
    align: "center"
  });

  // Body text
  doc.setFontSize(16);
  doc.text("This certifies that", 105, 90, {
    align: "center"
  });

  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text(studentName, 105, 110, {
    align: "center"
  });

  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text("has successfully completed the course", 105, 135, {
    align: "center"
  });

  doc.setFontSize(20);
  doc.text(courseTitle, 105, 155, {
    align: "center"
  });

  // Footer
  doc.setFontSize(12);
  doc.text(
    `Issued on: ${new Date().toLocaleDateString()}`,
    105,
    200,
    { align: "center" }
  );

  // Download
  doc.save(
    `certificate-${studentName.replace(" ", "_")}.pdf`
  );
}
