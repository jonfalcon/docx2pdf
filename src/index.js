const mammoth = require( 'mammoth' )
const chromium = require( 'chrome-aws-lambda' )

/**
 * docx2pdfhtml
 * 
 * Converts docx to pdf or html.
 * 
 * @param  fpIn   {string}  Path to the pdf file
 * @returns {pdf: Readable, html: string}
 */
async function pdf2docx ( fpIn ) {
  let browser

  try {
    const html = ( await mammoth.convertToHtml( {path: fpIn} ) ).value
    browser = await chromium.puppeteer.launch( {
      args: chromium.args,
      defaultViewPort: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true
    } )

    const page = await browser.newPage()
    await page.emulateMediaType( 'screen' )
    await page.setContent( html, {waitUntil: 'networkidle0'} )

    const pdf = await page.createPDFStream( {
      format: 'A4',
      margin: {
        top: '50px',
        bottom: '50px',
        left: '30px',
        right: '30px',
      },
      preferCSSPageSize: true,
      printBackground: true,
    } )

    pdf.on( 'end', async () => {
      await browser.close()
    } )

    return {pdf, html}
  } catch ( err ) {
    browser && await browser.close()
    throw err
  }
}

module.exports = pdf2docx
