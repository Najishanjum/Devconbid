import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeCanvasProps {
  value: string;
  size?: number;
  className?: string;
  altText?: string;
}

export const QrCodeCanvas: React.FC<QrCodeCanvasProps> = ({
  value,
  size = 200,
  className = '',
  altText = 'Payment QR Code',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#18181B',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (err) => {
        if (err) {
          console.error('QR generation error:', err);
          setError('Failed to generate QR code');
        } else {
          setError(null);
        }
      }
    );
  }, [value, size]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl text-xs text-red-500 p-2 text-center"
      >
        {error}
      </div>
    );
  }

  return (
    <div className={`inline-block p-3 bg-white rounded-2xl border border-[#ECEBF0] shadow-saas-sm ${className}`}>
      <canvas ref={canvasRef} aria-label={altText} className="block mx-auto rounded-lg" />
    </div>
  );
};
