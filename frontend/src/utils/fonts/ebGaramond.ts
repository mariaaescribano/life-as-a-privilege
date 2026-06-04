import type jsPDF from "jspdf";
import {
  GARAMOND_REGULAR,
  GARAMOND_BOLD,
  GARAMOND_ITALIC,
  GARAMOND_BOLD_ITALIC,
} from "./ebGaramondData";

/** Font family name to pass to doc.setFont(...) once registered. */
export const GARAMOND = "EBGaramond";

/**
 * Registers EB Garamond (the site's brand serif) into a jsPDF document so the
 * downloaded PDF matches the web typography instead of falling back to Helvetica.
 *
 * Call once right after `new jsPDF(...)`, then use:
 *   doc.setFont(GARAMOND, "normal" | "bold" | "italic" | "bolditalic")
 */
export function registerEbGaramond(doc: jsPDF): void {
  doc.addFileToVFS("EBGaramond-Regular.ttf", GARAMOND_REGULAR);
  doc.addFont("EBGaramond-Regular.ttf", GARAMOND, "normal");

  doc.addFileToVFS("EBGaramond-Bold.ttf", GARAMOND_BOLD);
  doc.addFont("EBGaramond-Bold.ttf", GARAMOND, "bold");

  doc.addFileToVFS("EBGaramond-Italic.ttf", GARAMOND_ITALIC);
  doc.addFont("EBGaramond-Italic.ttf", GARAMOND, "italic");

  doc.addFileToVFS("EBGaramond-BoldItalic.ttf", GARAMOND_BOLD_ITALIC);
  doc.addFont("EBGaramond-BoldItalic.ttf", GARAMOND, "bolditalic");

  doc.setFont(GARAMOND, "normal");
}
