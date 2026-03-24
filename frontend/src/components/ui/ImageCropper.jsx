import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

function ImageCropper({ aspect = 1, onCropDone, onCancel, circular = false }) {
  const [imgSrc, setImgSrc]   = useState('');
  const [crop, setCrop]       = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result?.toString() || '');
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handleConfirm = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX  = imgRef.current.naturalWidth  / imgRef.current.width;
    const scaleY  = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width  = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');

    if (circular) {
      ctx.beginPath();
      ctx.arc(
        completedCrop.width / 2,
        completedCrop.height / 2,
        completedCrop.width / 2,
        0, Math.PI * 2
      );
      ctx.clip();
    }

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width  * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file    = new File([blob], 'imagen-recortada.jpg', { type: 'image/jpeg' });
      const preview = URL.createObjectURL(blob);
      onCropDone(file, preview);
    }, 'image/jpeg', 0.9);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '24px', width: '95vw', maxWidth: '95vw',
        maxHeight: '95vh', display: 'flex', flexDirection: 'column', gap: '16px',
        overflow: 'hidden'
      }}>
        <h3 style={{ margin: 0, color: '#07393c' }}>Recortar imagen</h3>

        {!imgSrc && (
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '8px', padding: '30px', border: '2px dashed #ccc',
            borderRadius: '8px', cursor: 'pointer', color: '#555'
          }}>
            <span style={{ fontSize: '32px' }}>📁</span>
            <span>Haz clic para seleccionar una imagen</span>
            <input type="file" accept="image/*" onChange={onSelectFile} hidden />
          </label>
        )}

        {imgSrc && (
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ReactCrop
                crop={crop}
                onChange={(_, pct) => setCrop(pct)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop={false}
                style={{ borderRadius: '12px' }}
            >
                <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="recortar"
                    onLoad={onImageLoad}
                    style={{ maxWidth: '100%', maxHeight: 'calc(80vh - 120px)', borderRadius: '12px' }}
                />
         </ReactCrop>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: '1px solid #ccc', background: 'white', cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          {imgSrc && (
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 20px', borderRadius: '8px',
                border: 'none', background: '#07393c',
                color: 'white', cursor: 'pointer'
              }}
            >
              Confirmar recorte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;