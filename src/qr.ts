import QRCode from 'qrcode'

import { MENU_PAGE_URL } from './data'

/* Renders a genuine, scannable QR code (via the qrcode library) that
   encodes the deployed menu page URL. The on-screen canvas is drawn at
   2× CSS size for crisp phone scanning, and a separate high-resolution
   PNG is attached to the download link for printed table cards. */

const QR_ON_SCREEN = 440 // device pixels; CSS scales it down
const QR_PRINT = 1024

const QR_STYLE = {
  errorCorrectionLevel: 'M' as const,
  margin: 3, // ≥4-module quiet zone is guaranteed by the frame padding too
  color: { dark: '#140f0dff', light: '#f9f3e8ff' },
}

export const initMenuQr = async (): Promise<void> => {
  const canvas = document.getElementById('menu-qr')
  if (!(canvas instanceof HTMLCanvasElement)) return

  const download = document.getElementById('menu-qr-download')

  try {
    await QRCode.toCanvas(canvas, MENU_PAGE_URL, { ...QR_STYLE, width: QR_ON_SCREEN })
    // toCanvas stamps inline pixel sizes; hand display sizing back to CSS.
    canvas.style.width = ''
    canvas.style.height = ''

    if (download instanceof HTMLAnchorElement) {
      const print = document.createElement('canvas')
      await QRCode.toCanvas(print, MENU_PAGE_URL, { ...QR_STYLE, width: QR_PRINT })
      download.href = print.toDataURL('image/png')
    }
  } catch {
    // Never leave a broken or fake pattern: hide the code and keep the
    // plain /menu link usable instead.
    canvas.closest('.visit__qr')?.classList.add('is-qr-unavailable')
  }
}
