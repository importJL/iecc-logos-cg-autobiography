import React, { useState, useEffect, useRef } from "react";

// MilestoneNode Component
function MilestoneNode({ isCurrent }) {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      {isCurrent && (
        <div className="absolute inset-[-4px] bg-[radial-gradient(circle,rgba(0,0,0,0.3)_10%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.3)_10%,transparent_70%)]"></div>
      )}
      <div
        className={`w-4 h-4 rounded-full ${
          isCurrent ? "bg-blue-700 dark:bg-blue-300" : "bg-blue-500 dark:bg-blue-400"
        }`}
      ></div>
    </div>
  );
}

// Timeline Component
function Timeline({ milestones, currentIndex, onNodeClick }) {
  return (
    <div className="fixed top-0 left-0 w-full h-16 flex flex-row items-center justify-around bg-white dark:bg-gray-800 z-20 shadow-md">
      {milestones.map((milestone, index) => (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onNodeClick(index)}
        >
          <MilestoneNode isCurrent={index === currentIndex} />
          <span
            className={`mt-2 text-sm text-center max-w-[100px] truncate ${
              index === currentIndex ? "opacity-100 font-bold text-blue-700 dark:text-blue-300" : "opacity-50 text-gray-700 dark:text-gray-300"
            }`}
          >
            {milestone.title}
          </span>
        </div>
      ))}
    </div>
  );
}

// Carousel Component
function Carousel({ images }) {
  const [offset, setOffset] = useState(0);
  const carouselWidth = 840;
  const carouselHeight = 472;
  const extendedImages = [...images, ...images];
  const totalWidth = images.length * carouselWidth;

  useEffect(() => {
    setOffset(0);
    const interval = setInterval(() => {
      setOffset((prev) => (prev >= totalWidth ? 0 : prev + 1.5));
    }, 30);
    return () => clearInterval(interval);
  }, [totalWidth, images.length]);

  return (
    <div
      className="mx-auto relative"
      style={{
        overflow: "hidden",
        width: `${carouselWidth}px`,
        height: `${carouselHeight}px`,
        marginBottom: "1rem",
        position: "relative",
        borderRadius: "12px",
        padding: "4px",
        background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 3s ease infinite",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#e5e7eb",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            transition: "transform 0.1s linear",
            transform: `translateX(-${offset}px)`,
          }}
        >
          {extendedImages.map((src, idx) => (
            <React.Fragment key={idx}>
              <img
                src={src}
                alt={`milestone-img-${idx}`}
                style={{
                  width: `${carouselWidth}px`,
                  height: `${carouselHeight}px`,
                  objectFit: "cover",
                  margin: 0,
                  background: "#222",
                  display: "block",
                  borderRadius: 0,
                }}
              />
              {idx < extendedImages.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    height: `${carouselHeight}px`,
                    background: "#f3f4f6",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [theme, setTheme] = useState("light");
  const sectionRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    fetch("milestone.json")
      .then((res) => res.json())
      .then((data) => setMilestones(data))
      .catch((err) => {
        console.error("Failed to load milestone.json", err);
        setMilestones([]);
      });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (el) => el === entry.target
            );
            setCurrentIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => {
      sectionRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [milestones]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        sectionRefs.current[currentIndex - 1].scrollIntoView({
          behavior: "smooth",
        });
      } else if (
        event.key === "ArrowRight" &&
        currentIndex < milestones.length - 1
      ) {
        setCurrentIndex(currentIndex + 1);
        sectionRefs.current[currentIndex + 1].scrollIntoView({
          behavior: "smooth",
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, milestones.length]);

  const scrollToSection = (index) => {
    setCurrentIndex(index);
    sectionRefs.current[index].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <div
        className="fixed top-4 right-4 cursor-pointer z-30"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-gray-800"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-gray-200"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </div>
      <Timeline
        milestones={milestones}
        currentIndex={currentIndex}
        onNodeClick={scrollToSection}
      />
      <div className="snap-y snap-mandatory overflow-y-scroll h-screen pt-16">
        {milestones.map((milestone, index) => (
          <section
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            id={`milestone${index}`}
            className="h-screen snap-start flex flex-col justify-center items-center p-8"
          >
            <div className="flex flex-col md:flex-row w-full max-w-6xl items-center justify-center gap-8">
              {/* Left: Title and Description */}
              <div className="flex-1 flex flex-col items-start justify-center text-left">
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{
                    fontSize: "2.875rem",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {milestone.title}
                </h2>
                <p
                  className="max-w-prose"
                  style={{
                    fontSize: "1.375rem",
                    fontFamily: "'Montserrat', sans-serif",
                    marginTop: "1.5rem",
                    marginBottom: "1rem",
                    lineHeight: "1.7",
                  }}
                >
                  {milestone.description}
                </p>
              </div>
              {/* Right: Carousel or Image */}
              <div className="flex-1 flex items-center justify-center">
                {Array.isArray(milestone.image) && milestone.image.length > 0 ? (
                  <Carousel images={milestone.image} />
                ) : milestone.image ? (
                  <img
                    src={milestone.image}
                    alt={milestone.title}
                    className="mb-4 rounded-lg shadow-md"
                    style={{
                      width: "560px",
                      height: "315px",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                      background: "#222",
                      display: "block",
                    }}
                  />
                ) : (
                  <div className="mb-4 w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600">
                    No image
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}