import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle, FileText, Crosshair, Share2, Plus, Save, Upload } from 'lucide-react';
import { sendCropDiagnosis } from '../../services/api';
import toast from 'react-hot-toast';

export default function ScannerPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(null);
  const [result, setResult] = useState(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      // The video element will mount on the next render, so we attach the stream in a useEffect.
      setImageCaptured(null);
      setResult(null);
    } catch (err) {
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Attach stream to video element when it renders
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Display image preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageCaptured(event.target.result);
      stopCamera();
    };
    reader.readAsDataURL(file);

    // Send to API
    setIsScanning(true);
    setResult(null);
    try {
      const analysis = await sendCropDiagnosis(file);
      setResult(analysis);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error("Failed to analyze image");
    } finally {
      setIsScanning(false);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Draw current frame to canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setImageCaptured(imageDataUrl);
    
    // Stop stream to "freeze" frame
    stopCamera();
    
    // Convert base64 to File for API
    setIsScanning(true);
    try {
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      
      const analysis = await sendCropDiagnosis(file);
      setResult(analysis);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error("Failed to analyze image");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRetake = () => {
    setImageCaptured(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] p-4 md:p-8 font-mono text-black">
      {/* HEADER */}
      <div className="border-4 border-black p-4 md:p-6 mb-8 flex flex-col md:flex-row md:items-end justify-between bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <div>
          <p className="text-[#10b981] font-bold tracking-widest text-sm mb-1 uppercase">Computer Vision Module</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ textShadow: '2px 2px 0px #a7f3d0' }}>
            Crop Scanner
          </h1>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0 font-bold">
          <div className="border-2 border-black bg-[#10b981] px-4 py-1 flex items-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            VYRA AI
          </div>
          <div className="border-2 border-black bg-black text-white px-4 py-1 flex items-center shadow-[4px_4px_0_0_rgba(16,185,129,1)]">
            VISION V1
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: CAMERA FEED */}
        <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col">
          <div className="flex items-center gap-3 font-bold text-lg border-b-4 border-black pb-4 mb-6 uppercase">
            <Camera size={24} strokeWidth={3} /> Uplink Feed
          </div>
          
          {/* Viewfinder Container */}
          <div className="flex-1 min-h-[300px] border-[6px] border-dashed border-black relative bg-[#e5e7eb] flex flex-col items-center justify-center mb-6 overflow-hidden p-4 text-center">
            {imageCaptured ? (
              <img src={imageCaptured} alt="Captured" className="w-full h-full object-contain" />
            ) : stream ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                <p className="font-bold text-gray-500 uppercase mb-2">Camera Offline</p>
                <button 
                  onClick={startCamera}
                  className="w-full border-4 border-black font-black uppercase text-lg py-3 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-transform"
                >
                  <Camera size={20} strokeWidth={3} /> Start Camera
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-4 border-black font-black uppercase text-lg py-3 flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-transform"
                >
                  <Upload size={20} strokeWidth={3} /> Upload File
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
            )}
            
            {/* Hidden canvas for capturing frame */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={imageCaptured ? handleRetake : handleCapture}
              disabled={isScanning || (!stream && !imageCaptured)}
              className={`flex-1 border-4 border-black font-black uppercase text-xl py-3 flex items-center justify-center gap-2 transition-transform shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
                isScanning || (!stream && !imageCaptured) ? 'opacity-50 cursor-not-allowed bg-gray-300' :
                imageCaptured ? 'bg-[#f59e0b] hover:bg-[#d97706] active:translate-y-1 active:translate-x-1 active:shadow-none' : 
                'bg-[#10b981] hover:bg-[#059669] active:translate-y-1 active:translate-x-1 active:shadow-none'
              }`}
            >
              {imageCaptured ? (
                <><RefreshCw size={24} strokeWidth={3} /> CLEAR</>
              ) : (
                <><Camera size={24} strokeWidth={3} /> {isScanning ? 'SCANNING...' : 'CAPTURE'}</>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: ANALYSIS */}
        <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col">
          <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-6">
            <div>
              <AlertCircle size={32} className="text-[#f59e0b] mb-2" strokeWidth={3} />
              <div className="border-2 border-black font-bold uppercase px-3 py-1 inline-block">
                {result ? result.crop : 'Unknown'}
              </div>
            </div>
            <div className={`border-4 border-black font-black uppercase px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
              !result ? 'bg-gray-200' :
              result.severity?.toLowerCase().includes('high') ? 'bg-red-500 text-white' :
              result.severity?.toLowerCase().includes('medium') ? 'bg-yellow-500' : 'bg-[#10b981]'
            }`}>
              {result ? result.severity : 'NO DATA'}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border-4 border-black p-4 relative">
              <div className="flex items-center gap-2 font-bold uppercase mb-4 text-sm border-b-2 border-black pb-2">
                <FileText size={16} /> Analysis Report
              </div>
              <p className="font-medium">
                {result ? `Disease Detected: ${result.disease}` : 'No detailed analysis provided for this condition yet. Capture an image to begin.'}
              </p>
            </div>
            <div className="border-4 border-black p-4 bg-[#ccfbf1] relative">
              <div className="flex items-center gap-2 font-bold uppercase mb-4 text-sm border-b-2 border-black pb-2">
                <Crosshair size={16} /> Action Directive
              </div>
              <p className="font-bold">
                {result ? result.recommendation : 'Please consult a local agricultural expert or upload a sample.'}
              </p>
            </div>
          </div>

          <div className="border-t-4 border-black pt-6 flex gap-4">
            <button className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] border-4 border-black font-black uppercase text-lg py-3 flex items-center justify-center gap-2 transition-transform active:translate-y-1 active:translate-x-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none">
              <Save size={20} strokeWidth={3} /> Log to Memory
            </button>
            <button className="w-14 bg-white hover:bg-gray-100 border-4 border-black flex items-center justify-center transition-transform active:translate-y-1 active:translate-x-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none">
              <Share2 size={20} strokeWidth={3} />
            </button>
            <button className="w-14 bg-white hover:bg-gray-100 border-4 border-black flex items-center justify-center transition-transform active:translate-y-1 active:translate-x-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none">
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
