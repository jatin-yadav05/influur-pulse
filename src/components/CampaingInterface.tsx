'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Zap, Target, Users, TrendingUp, Music, Eye, Heart, DollarSign, ArrowRight, Check, Mic, BarChart3, Clock, Star, Video } from 'lucide-react';
import { TextHoverEffectBackground } from '@/components/text-hover-effect';
import { PinContainer } from '@/components/3d-pin';
import { AnimatePresence, motion } from 'framer-motion';
import { CanvasRevealEffect } from '@/components/canvas-effect';
import confetti from "canvas-confetti";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof target === "number" ? target : parseInt(String(target), 10);
    if (isNaN(end) || start === end) {
      setCount(end);
      return;
    }
    let incrementTime = 50;
    let timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};
const InfluurPulse = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const audioVisualizerRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visualizerReady, setVisualizerReady] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Mouse tracking for subtle interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced campaign data
  const campaignData = {
    artist: "Drake",
    song: "God's Plan",
    genre: "Hip-Hop/Rap",
    duration: "3:19",
    confidence: 96,
    aiPredictions: {
      reach: "12.5M",
      engagement: "8.2%",
      budget: "$45,000",
      influencerCount: 23,
      roi: "340%",
      virality: "87%"
    },
    influencers: [
      {
        name: "musiclover_jay",
        followers: "1.2M",
        engagement: "9.4%",
        cost: "$2,500",
        match: 94,
        verified: true,
        imgSrc: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "hiphophead_sarah",
        followers: "850K",
        engagement: "11.2%",
        cost: "$1,800",
        match: 91,
        verified: true,
        imgSrc: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        name: "drakevibes_official",
        followers: "2.1M",
        engagement: "7.8%",
        cost: "$3,200",
        match: 88,
        verified: false,
        imgSrc: "https://randomuser.me/api/portraits/men/85.jpg"
      }
    ],
    trends: ["#DrakeChallenge", "#GodsplanVibes", "#6ixGod", "#OVOSound", "#ViralHit"],
    demographics: {
      age: "18-34",
      regions: ["North America", "Europe", "Australia"],
      peakTimes: ["7-9 PM EST", "12-2 PM EST"]
    }
  };

  // Premium audio visualization
  useEffect(() => {
    if (audioVisualizerRef.current && visualizerReady && (isAnalyzing || showResults)) {
      const canvas = audioVisualizerRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;
      let time = 0;
      const barCount = 64;
      const barWidth = (canvas.width - (barCount - 1) * 1) / barCount;
      const barHeights = Array(barCount).fill(0);

      // Assign each bar a unique phase offset for more organic movement
      const phaseOffsets = Array.from({ length: barCount }, (_, i) => Math.random() * Math.PI * 2);

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < barCount; i++) {
          const frequency = i / barCount;
          const phase = phaseOffsets[i];
          const speed = 0.004 + (i % 7) * 0.0005;
          const amplitude = Math.sin(time * speed + frequency * 8 + phase) * 0.5 + 0.5;
          const noise = (Math.random() - 0.5) * 0.08; // Slightly more noise for variety
          const targetHeight = (amplitude + noise) * 60 + 20;
          barHeights[i] += (targetHeight - barHeights[i]) * 0.12;

          const x = i * (barWidth + 1);
          const y = canvas.height - barHeights[i];

          // Enhanced gradient with glow effect
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#FF4D00');
          gradient.addColorStop(0.5, '#FF6B35');
          gradient.addColorStop(1, 'rgba(255, 107, 53, 0.1)');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth, barHeights[i]);

          // Glow effect
          ctx.shadowColor = '#FF4D00';
          ctx.shadowBlur = barHeights[i] * 10;
          ctx.fillRect(x, y, barWidth, barHeights[i]);
          ctx.shadowBlur = 0;
        }

        time += 1; // Increase time a bit faster for more lively movement
        if ((isAnalyzing || showResults) && visualizerReady) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [isAnalyzing, showResults, visualizerReady]);

  useEffect(() => {
    if (!isAnalyzing) setVisualizerReady(false);
  }, [isAnalyzing]);

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  // Update handleCampaignLaunch to use selectedFile
  const handleCampaignLaunch = () => {
    // if (!selectedFile) return;
    setUploadProgress(0);
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setTimeout(startAnalysis, 800); 
          return 100;
        }
        return prev + 8;
      });
    }, 180);
  };

  const startAnalysis = () => {
    setCurrentStep(1);
    setIsAnalyzing(true);
    let step = 1;
    const totalSteps = 5;
    const stepDuration = 2000; // ms

    const nextStep = () => {
      if (step < totalSteps) {
        step += 1;
        setCurrentStep(step);
        setTimeout(nextStep, stepDuration);
      } else {
        // After last step is shown as active, wait, then mark as complete, then show results
        setTimeout(() => {
          // Mark last step as complete visually
          setCurrentStep(totalSteps + 1); // This will make all steps complete
          setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
            setCurrentStep(6);
          }, 800); // Short delay for visual feedback (adjust as needed)
        }, stepDuration);
      }
    };
    setTimeout(nextStep, stepDuration);
  };

  const AnalysisStep = ({ step, title, description, icon: Icon, isActive, isComplete }: {
    step: number;
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
    isComplete: boolean;
  }) => (
    <div className={`relative flex items-start space-x-6 p-8 rounded-3xl transition-all duration-1000 ease-out transform ${isActive
      ? 'bg-gradient-to-r from-orange-500/10 to-red-500/5 border border-orange-500/30 scale-[1.001] shadow-2xl shadow-orange-500/10'
      : isComplete
        ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 scale-100'
        : 'bg-white/[0.01] border border-white/5 scale-95 opacity-60'
      }`}>
      <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${isComplete
        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
        : isActive
          ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/30'
          : 'bg-white/5'
        }`}>
        {isComplete ? (
          <Check className="w-7 h-7 text-white" />
        ) : (
          <Icon className={`w-7 h-7 transition-colors duration-700 ${isActive ? 'text-white' : 'text-white/40'
            }`} />
        )}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 animate-pulse opacity-50"></div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className={`font-semibold text-xl transition-all duration-700 ${isActive ? 'text-white' : isComplete ? 'text-green-400' : 'text-white/50'
          }`}>
          {title}
        </h3>
        <p className={`text-base leading-relaxed transition-all duration-700 ${isActive ? 'text-white/80' : 'text-white/40'
          }`}>
          {description}
        </p>
      </div>
      {isActive && (
        <div className="flex items-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );

  const InfluencerCard = ({ influencer, index }: { influencer: any; index: number; }) => {
    return (
      <div
        className="relative bg-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-2 transition-transform duration-300"
      >
        <div className="flex items-center justify-between mb-6 max-sm:mb-3">
          <div className="flex items-center space-x-4 max-sm:space-x-2">
            <div className="relative">
              <div className="w-16 h-16 max-sm:w-10 max-sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <img
                  src={influencer.imgSrc}
                  alt={influencer.name}
                  className="w-16 h-16 max-sm:w-10 max-sm:h-10 object-cover rounded-2xl"
                />
              </div>
              {influencer.verified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 max-sm:w-4 max-sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 max-sm:w-2 max-sm:h-2 text-white" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg max-lg:text-sm">@{influencer.name}</h4>
              <p className="text-white/60 text-sm max-sm:text-[10px]">{influencer.followers} <span className="hidden max-sm:inline">followers</span></p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg max-sm:text-base font-bold text-orange-400">{influencer.match}%</div>
            <div className="text-sm max-sm:text-xs text-white/50">AI Match</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-sm:gap-3">
          <div className="space-y-1">
            <div className="text-white/50 text-sm max-sm:text-xs">Engagement Rate</div>
            <div className="text-white font-semibold text-lg max-sm:text-base">{influencer.engagement}</div>
          </div>
          <div className="space-y-1">
            <div className="text-white/50 text-sm max-sm:text-xs">Campaign Cost</div>
            <div className="text-white font-semibold text-lg max-sm:text-base">{influencer.cost}</div>
          </div>
        </div>
      </div>
    );
  };

  const handleLaunchConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#ffb347", "#ff7f50", "#ff6a00", "#ff914d", "#ffb26b"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic background with mouse interaction */}
      <div style={{ opacity: currentStep > 0 ? 0.1 : 1, transition: "opacity 0.5s" }}>
        <TextHoverEffectBackground text="INFLUUR" />
      </div>
      {/* Enhanced, more curved and less opaque orange arc-shaped radial gradient at the bottom, spanning full width */}
      <div
        className="pointer-events-none absolute left-0 bottom-0 w-full z-10"
        style={{
          height: "220px",
          background: "radial-gradient(120% 100% at 50% 110%, rgba(255, 115, 0, 0.13) 0%, rgba(255, 115, 0, 0.06) 60%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 70%, transparent 100%)",
        }}
      ></div>
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 77, 0, 0.3) 0%, transparent 50%)`
        }}
      ></div>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-black to-red-500/5"></div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(24px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-14 gap-6 md:gap-0"
          >
            <motion.div
              initial={{ opacity: 0, filter: "blur(24px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="text-2xl sm:text-3xl font-bold">
                <span className="text-orange-500 font-medium">influur</span>
                <span className="text-white/40 ml-1 text-lg sm:text-xl font-light">pulse</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, filter: "blur(24px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 max-md:hidden"
            >
              <div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-medium text-xs sm:text-base">
                <div className="w-2 h-2 bg-[#20bb5a] rounded-full inline-block mr-2 animate-pulse shadow-[0_0_8px_#20bb5a]" />
                <span>AI Engine Active</span>
              </div>
              <button
                className="relative flex items-center px-4 sm:px-6 py-2 sm:py-2.5 border border-white/20 rounded-full text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 font-medium text-xs sm:text-base overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredVideo(true)}
                onMouseLeave={() => setHoveredVideo(false)}
              >
                Book Demo
                <span className="relative flex items-center justify-center ml-2" style={{ width: 24, height: 24 }}>
                  <motion.span
                    initial={false}
                    animate={hoveredVideo ? { y: -18, opacity: 0 } : { y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    style={{ position: 'absolute', left: 0, right: 0 }}
                  >
                    <Video className="w-5 h-5 text-white" />
                  </motion.span>
                  <motion.span
                    initial={false}
                    animate={hoveredVideo ? { y: 0, opacity: 1 } : { y: 18, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    style={{ position: 'absolute', left: 0, right: 0 }}
                  >
                    <Video className="w-5 h-5 text-white" />
                  </motion.span>
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Animated Scenes */}
          <AnimatePresence mode="wait">
            {!isAnalyzing && !showResults && (
              <motion.div
                key="upload"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, filter: "blur(24px)" },
                  visible: {
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
                  }
                }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, filter: "blur(24px)", y: 30 },
                    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                  }}
                  className="space-y-3 sm:space-y-5"
                >
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, filter: "blur(24px)", y: 20 },
                      visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                    }}
                    className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight"
                  >
                    Launch your next
                    <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                      viral campaign
                    </span>
                  </motion.h1>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, filter: "blur(24px)", y: 20 },
                      visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                    }}
                    className="text-base sm:text-lg text-white/60 leading-relaxed max-w-md sm:max-w-xl mx-auto font-light"
                  >
                    Upload your track and watch our AI create the perfect influencer strategy in seconds
                  </motion.p>
                </motion.div>

                {uploadProgress === 0 ? (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, filter: "blur(24px)", y: 30 },
                      visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                    }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, filter: "blur(24px)", y: 20 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                      }}
                    >
                      <PinContainer title={selectedFile ? 'Remove your track' : 'Upload Your Track'}>
                        <div
                          className={`group w-xl max-md:w-md max-sm:w-3xs bg-white/[0.02] backdrop-blur-xl border-2 border-dashed ${dragActive ? 'border-orange-500/60 bg-orange-500/5' : 'border-white/20'} rounded-2xl p-6 sm:p-8 md:p-10 hover:border-orange-500/40 hover:bg-white/[0.03] transition-all duration-500 cursor-pointer flex flex-col items-center justify-center`}
                          onClick={() => document.getElementById('file-upload-input')?.click()}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          tabIndex={0}
                          style={{ outline: dragActive ? '2px solid #ff6600' : 'none' }}
                        >
                          <input
                            id="file-upload-input"
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          {selectedFile ? (
                            <div className="flex flex-col items-center space-y-3 w-full">
                              <span className="text-white font-semibold text-base sm:text-lg truncate max-w-xs">{selectedFile.name}</span>
                              <button
                                className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs font-medium transition-colors duration-200"
                                onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                                type="button"
                              >
                                Remove File
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                              </div>
                              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                                Drop your track here
                              </h3>
                              <p className="text-white/50 text-sm sm:text-base">
                                MP3, WAV, FLAC • Max 100MB
                              </p>
                            </>
                          )}
                        </div>
                      </PinContainer>
                    </motion.div>
                    <motion.button
                      variants={{
                        hidden: { opacity: 0, filter: "blur(24px)", y: 20 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                      }}
                      onClick={handleCampaignLaunch}
                      className="relative group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 rounded-full font-semibold text-sm sm:text-base text-white shadow-lg hover:shadow-orange-500/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/60 overflow-hidden cursor-pointer"
                    >
                      {/* Border Trace Effect with White Glow */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full z-0 group-hover:animate-border-trail"
                        style={{
                          boxShadow: '0 0 0 0 rgba(255,255,255,0.7), 0 0 16px 4px rgba(255,255,255,0.4)',
                          transition: 'box-shadow 0.3s',
                        }}
                      ></span>
                      <span className="relative z-10 tracking-wide font-medium text-white/90">
                        Start AI Analysis
                      </span>
                      <ArrowRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, filter: "blur(24px)", y: 30 },
                      visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                    }}
                    className="space-y-4 sm:space-y-6 animate-fade-in backdrop-blur-2xl"
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, filter: "blur(24px)", y: 20 },
                        visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
                      }}
                      className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-semibold text-white text-base sm:text-lg">{selectedFile ? selectedFile.name : "God's Plan"}</h3>
                          <p className="text-white/60 text-xs sm:text-sm">3.2 MB • Processing...</p>
                        </div>
                        <span className="text-orange-500 font-bold text-base sm:text-lg">{uploadProgress}%</span>
                      </div>
                      <div className="relative w-full bg-white/5 rounded-full h-1.5 sm:h-2">
                        <div
                          className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-lg shadow-orange-500/30"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}
            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="max-w-7xl mx-auto h-[80vh] max-md:h-full flex flex-col sm:flex-row items-center justify-center animate-fade-in px-2 sm:px-0 mt-0"
                onAnimationComplete={() => setVisualizerReady(true)}
              >
                {/* Left: Audio Visualizer & Header */}
                <div className="flex flex-col items-center justify-center w-full sm:w-1/2 h-full py-8 sm:py-0">
                  <div className="w-full text-center mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">AI analyzing your track</h2>
                    <p className="text-white/60 text-base sm:text-lg font-light truncate mb-2">
                      Processing "{campaignData.song}" by {campaignData.artist}
                    </p>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-orange-400 font-medium text-xs">{'Neural networks processing...'}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex flex-col items-center">
                    <canvas
                      ref={audioVisualizerRef}
                      width={1000}
                      height={120}
                      className="w-full h-20 sm:h-28 rounded-2xl shadow-lg shadow-orange-500/10"
                    />
                    <div className="flex items-center mt-2 space-x-2">
                      <Clock className="w-4 h-4 text-orange-500 animate-spin-slow" />
                      <span className="text-white/60 text-xs">{'Analyzing audio & viral potential...'}</span>
                    </div>
                  </div>
                </div>
                {/* Right: Steps */}
                <div className="w-full sm:w-1/2 h-full flex flex-col justify-center items-center py-8 sm:py-0">
                  <div className="flex flex-col gap-2 w-full max-w-lg">
                    {[1, 2, 3, 4, 5].map((step) => {
                      if (step < currentStep) {
                        return (
                          <AnalysisStep
                            key={step}
                            step={step}
                            title={[
                              "Audio Analysis",
                              "Trend Prediction",
                              "Creator Match",
                              "Strategy Optimization",
                              "Finalization"
                            ][step - 1]}
                            description={[
                              "Extracting musical DNA, mood, and genre.",
                              "Scanning social trends and viral patterns.",
                              "Matching top influencers for your track.",
                              "Optimizing budget and timing.",
                              "Generating your campaign strategy."
                            ][step - 1]}
                            icon={[Mic, TrendingUp, Users, BarChart3, Target][step - 1]}
                            isActive={false}
                            isComplete={true}
                          />
                        );
                      } else if (step === currentStep) {
                        return (
                          <AnimatePresence mode="wait" key={step}>
                            <motion.div
                              key={step}
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -40 }}
                              transition={{ duration: 1, ease: 'easeInOut' }}
                            >
                              <AnalysisStep
                                step={step}
                                title={[
                                  "Audio Analysis",
                                  "Trend Prediction",
                                  "Creator Match",
                                  "Strategy Optimization",
                                  "Finalization"
                                ][step - 1]}
                                description={[
                                  "Extracting musical DNA, mood, and genre.",
                                  "Scanning social trends and viral patterns.",
                                  "Matching top influencers for your track.",
                                  "Optimizing budget and timing.",
                                  "Generating your campaign strategy."
                                ][step - 1]}
                                icon={[Mic, TrendingUp, Users, BarChart3, Target][step - 1]}
                                isActive={true}
                                isComplete={false}
                              />
                            </motion.div>
                          </AnimatePresence>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>
                </div>
              </motion.div>
            )}
            {showResults && (
              <motion.section
                key="results"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                id="menu"
                className="open max-w-5xl bg-gradient-to-br from-white/[0.02] to-white/0 mx-auto my-10 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-3xl px-4 py-8 sm:px-10 sm:py-12 animate-fade-in "
              >
                {/* Header */}
                <span className="shine shine-top"></span>
                <span className="shine shine-bottom"></span>
                <span className="glow glow-top"></span>
                <span className="glow glow-bottom"></span>
                <span className="glow glow-bright glow-top "></span>
                <span className="glow glow-bright glow-bottom "></span>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-green-400/20 to-green-500/10 px-4 py-2 rounded-full border border-green-400/20 text-green-300 font-semibold text-xs sm:text-sm shadow-sm">
                    <Check className="w-4 h-4" />
                    <span>Strategy Optimized</span>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 text-xs sm:text-sm">AI Confidence</span>
                    <span className="text-green-400 font-bold text-base sm:text-lg">{campaignData.confidence}%</span>
                  </div>
                </div>

                {/* Main Info Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Music className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-1">
                        {campaignData.song}
                      </h2>
                      <p className="text-white/60 text-sm sm:text-base">
                        by {campaignData.artist} &bull; {campaignData.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-white/70 text-xs mb-1">Perfect Match Found</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-300 font-semibold text-base">#1 Trending</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="max-w-3xl border border-amber-100/20 rounded-4xl flex flex-col justify-center items-start m-2 text-center p-8 shadow-md shadow-amber-700/60 hover:shadow-amber-600 transition-all duration-300 relative group bg-gradient-to-br from-white/0 to-white/5 hover:border-white/40 box-border overflow-hidden group">
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CanvasRevealEffect
                        animationSpeed={10}
                        containerClassName=""
                      />
                    </div>
                    <div className="flex items-start justify-between mb-6 w-full">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100/10 via-white/5 to-blue-200/5 shadow-inner">
                        <Eye className="w-8 h-8 text-blue-500 drop-shadow-md" />
                      </div>
                      <span className="relative text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full transition-all duration-300 group-hover:bg-transparent ">
                        +23%
                      </span>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter target={parseInt(campaignData.aiPredictions.reach.replace(/[^\d]/g, ''))} suffix="M" />
                      </div>
                      <div className="text-white/60 font-medium">Reach</div>
                    </div>
                  </div>
                  <div className="max-w-3xl border border-amber-100/20 rounded-4xl flex flex-col justify-center items-start m-2 text-center p-8 shadow-md shadow-amber-700/60 hover:shadow-amber-600 transition-all duration-300 relative group bg-gradient-to-br from-white/0 to-white/5 hover:border-white/40 box-border overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CanvasRevealEffect
                        animationSpeed={10}
                        containerClassName=""
                      />
                    </div>
                    <div className="flex items-start justify-between mb-6 w-full">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100/10 via-white/5 to-blue-200/5 shadow-inner ">
                        <Heart className="w-8 h-8 text-pink-500 drop-shadow-md" />
                      </div>
                      <span className="relative text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-emerald-400 group-hover:bg-clip-text">
                        +15%
                      </span>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter target={parseFloat(campaignData.aiPredictions.engagement.replace(/[^\d.]/g, ''))} suffix="%" />
                      </div>
                      <div className="text-white/60 font-medium">Engagement</div>
                    </div>
                  </div>
                  <div className="max-w-3xl border border-amber-100/20 rounded-4xl flex flex-col justify-center items-start m-2 text-center p-8 shadow-md shadow-amber-700/60 hover:shadow-amber-600 transition-all duration-300 relative group bg-gradient-to-br from-white/0 to-white/5 hover:border-white/40 box-border overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CanvasRevealEffect
                        animationSpeed={10}
                        containerClassName=""
                      />
                    </div>
                    <div className="flex items-start justify-between mb-6 w-full">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100/10 via-white/5 to-blue-200/5 shadow-inner">
                        <Heart className="w-8 h-8 text-yellow-500 drop-shadow-md" />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter target={parseInt(campaignData.aiPredictions.budget.replace(/[^\d]/g, ''))} prefix="$" />
                      </div>
                      <div className="text-white/60 font-medium">Budget</div>
                    </div>
                  </div>
                  <div className="max-w-3xl border border-amber-100/20 rounded-4xl flex flex-col justify-center items-start m-2 text-center p-8 shadow-md shadow-amber-700/60 hover:shadow-amber-600 transition-all duration-300 relative group bg-gradient-to-br from-white/0 to-white/5 hover:border-white/40 box-border overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CanvasRevealEffect
                        animationSpeed={10}
                        containerClassName=""
                      />
                    </div>
                    <div className="flex items-start justify-between mb-6 w-full">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100/10 via-white/5 to-blue-200/5 shadow-inner">
                        <DollarSign className="w-8 h-8 text-green-500 drop-shadow-md" />
                      </div>
                      <span className="text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full group-hover:bg-transparent">
                        +23%
                      </span>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter target={campaignData.aiPredictions.influencerCount} />
                      </div>
                      <div className="text-white/60 font-medium">Creators</div>
                    </div>
                  </div>
                  <div className="max-w-3xl border border-amber-100/20 rounded-4xl flex flex-col justify-center items-start m-2 text-center p-8 shadow-md shadow-amber-700/60 hover:shadow-amber-600 transition-all duration-300 relative group bg-gradient-to-br from-white/0 to-white/5 hover:border-white/40 box-border overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CanvasRevealEffect
                        animationSpeed={10}
                        containerClassName=""
                      />
                    </div>
                    <div className="flex items-start justify-between mb-6 w-full">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100/10 via-white/5 to-blue-200/5 shadow-inner">
                        <TrendingUp className="w-8 h-8 text-orange-400 drop-shadow-md" />
                      </div>
                      <span className="text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full group-hover:bg-transparent">
                        +45%
                      </span>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter target={parseInt(campaignData.aiPredictions.roi.replace(/[^\d]/g, ''))} suffix="%" />
                      </div>
                      <div className="text-white/60 font-medium">ROI</div>
                    </div>
                  </div>
                  <div className="max-w-3xl border border-amber-100/20 rounded-4xl flex flex-col justify-center items-start m-2 text-center p-8 shadow-md shadow-amber-700/60 hover:shadow-amber-600 transition-all duration-300 relative group bg-gradient-to-br from-white/0 to-white/5 hover:border-white/40 box-border overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CanvasRevealEffect
                        animationSpeed={10}
                        containerClassName=""
                      />
                    </div>
                    <div className="flex items-start justify-between mb-6 w-full">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100/10 via-white/5 to-blue-200/5 shadow-inner">
                        <Zap className="w-8 h-8 text-purple-500 drop-shadow-md" />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col items-start">
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter target={parseInt(campaignData.aiPredictions.virality.replace(/[^\d]/g, ''))} suffix="%" />
                      </div>
                      <div className="text-white/60 font-medium">Creators</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations & Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Creators */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Recommended Creators</h3>
                        <p className="text-white/60 text-xs">AI-matched for audience & content</p>
                      </div>
                      <button className="px-3 py-1 border border-orange-500/30 rounded-xl text-orange-400 hover:bg-orange-500/10 transition-all duration-300 font-medium text-xs">
                        View All
                      </button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {campaignData.influencers.slice(0, 2).map((influencer, index) => (
                        <InfluencerCard key={index} influencer={influencer} index={index} />
                      ))}
                    </div>
                  </div>
                  {/* Insights */}
                  <div className="flex flex-col gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        Trending Hashtags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {campaignData.trends.slice(0, 4).map((trend, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-xs font-medium"
                          >
                            {trend}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-blue-400" />
                        Audience Insights
                      </h3>
                      <div className="flex flex-col gap-2 text-xs text-white/80">
                        <div>
                          <span className="font-semibold text-white">Demographics: </span>
                          {campaignData.demographics.age}
                        </div>
                        <div>
                          <span className="font-semibold text-white">Regions: </span>
                          {campaignData.demographics.regions.slice(0, 2).join(", ")}
                        </div>
                        <div>
                          <span className="font-semibold text-white">Peak Times: </span>
                          {campaignData.demographics.peakTimes.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="flex flex-col items-center gap-4 pt-4">
                  <button
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl font-bold text-lg text-white shadow-xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer"
                    onClick={(() => {
                      let lastClick = 0;
                      return (e: React.MouseEvent<HTMLButtonElement>) => {
                        const now = Date.now();
                        if (now - lastClick < 1700) return;
                        lastClick = now;
                        handleLaunchConfetti();
                      };
                    })()}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none"></div>
                    <span className="relative z-10">Launch Campaign</span>
                    <span className="relative z-10 flex items-center gap-1 text-white/80 text-base">
                      {campaignData.aiPredictions.budget}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </button>
                  <div className="flex flex-wrap items-center justify-center gap-4 text-white/60 text-xs mt-2">
                    <div className="flex items-center gap-1">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>30-day money back</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>96% success rate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span>Launch in 24h</span>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Minimal designer credit bottom left */}
      <a
        href="https://x.com/jatinyadav_05"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 z-50 text-xs text-white/40 hover:text-orange-400 transition-colors duration-200 font-mono"
        style={{letterSpacing: '0.01em'}}
        aria-label="Designed by @jatinyadav (Twitter)"
      >
        Designed by <span className="font-semibold">@jatinyadav</span>
      </a>
    </div>
  );
};

export default InfluurPulse;