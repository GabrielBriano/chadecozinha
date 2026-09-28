import { useEffect, useRef } from "react";

export default function IntroVideo({ onFinish }) {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia('(max-width: 700px)').matches
  )

  const videoSrc = isMobile
    ? '/videos/1080p2-ezremove.mp4'
    : '/videos/1920-ezremove.mp4'

  useEffect(() => {
    const video = videoRef.current;

    const handleEnd = () => {
      onFinish();
    };

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)')

    const updateDevice = () => {
      setIsMobile(media.matches)
    }

    media.addEventListener?.('change', updateDevice)

    return () => {
      media.removeEventListener?.('change', updateDevice)
    }
  }, [])

    video.addEventListener("ended", handleEnd);

    return () => {
      video.removeEventListener("ended", handleEnd);
    };
  }, [onFinish]);

  return (
    <div className="intro-video">
      <video
        key={videoSrc}
        ref={videoRef}
        className="intro-film"
        src={videoSrc}
        preload="auto"
        autoPlay
        playsInline
        muted
        loop={false}
        controls={false}
        onLoadedData={() => setIsLoaded(true)}
        onCanPlay={handleCanPlay}
        onEnded={handleVideoEnded}
        onError={handleVideoError}
      />
    </div>
  );
}