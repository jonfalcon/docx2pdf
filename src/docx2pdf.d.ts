declare module "docx2pdf" {
  function docx2pdf (fpIn: string): Promise<{ pdf: Readable, html: string }>;
  export default docx2pdf;
}
