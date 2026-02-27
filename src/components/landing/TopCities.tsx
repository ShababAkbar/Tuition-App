import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

// Import city images
import lahoreImg from "@/assets/cities/LAHORE.jpg";
import karachiImg from "@/assets/cities/Karachi.jpg";
import islamabadImg from "@/assets/cities/Islamabad.png";
import rawalpindiImg from "@/assets/cities/Rawalpindi.webp";
import gujranwalaImg from "@/assets/cities/Gujranwala.jpg";
import sheikhupuraImg from "@/assets/cities/Sheikhupura.webp";
import kasurImg from "@/assets/cities/Kasur.webp";
import pattokiImg from "@/assets/cities/Pattoki.jpg";
import hafizabadImg from "@/assets/cities/Hafizabad.jpg";
import bhawalpurImg from "@/assets/cities/Bhawalpur.jpg";
import jhangImg from "@/assets/cities/Jhang.jpg";
import kamraImg from "@/assets/cities/Kamra.jpg";
import sukkurImg from "@/assets/cities/Sukkur.webp";
import bannuImg from "@/assets/cities/Bannu.jpg";
import mandiBahauddinImg from "@/assets/cities/Mandi Bahauddin.jpg";
import wahCanttImg from "@/assets/cities/Wah Cantt.jpg";
import faisalabadImg from "@/assets/cities/Faisalabad.jpg";
import peshawarImg from "@/assets/cities/Peshawar.jpg";
import sargodhaImg from "@/assets/cities/Sargodha.jpg";

interface City {
  city: string;
  tutor_count: string;
}

// City images mapped by city name (lowercase key)
const CITY_IMAGES: Record<string, string> = {
  lahore:       lahoreImg,
  karachi:      karachiImg,
  islamabad:    islamabadImg,
  rawalpindi:   rawalpindiImg,
  gujranwala:   gujranwalaImg,
  sheikhupura:  sheikhupuraImg,
  kasur:        kasurImg,
  pattoki:      pattokiImg,
  hafizabad:    hafizabadImg,
  bahawalpur:   bhawalpurImg,
  bhawalpur:    bhawalpurImg,
  jhang:        jhangImg,
  // Fallback URLs for missing cities
  faisalabad:       faisalabadImg,
  peshawar:         peshawarImg,
  kamra:            kamraImg,
  sukkur:           sukkurImg,
  bannu:            bannuImg,
  banu:             bannuImg,
  "mandi bahauddin": mandiBahauddinImg,
  "wah cantt":      wahCanttImg,
  sargodha:         sargodhaImg,
  multan:       "https://images.unsplash.com/photo-1565117157007-6e9e18e1ad8c?w=400&h=260&fit=crop&auto=format",
  quetta:       "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=260&fit=crop&auto=format",
  hyderabad:    "https://images.unsplash.com/photo-1571771709-b3ee8ded9a7e?w=400&h=260&fit=crop&auto=format",
  sialkot:      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=260&fit=crop&auto=format",
};

const DEFAULT_IMAGE = lahoreImg;

const CARD_WIDTH = 200; // px - matches the w-[200px] below
const CARD_GAP   = 20;  // px - matches gap-5

const TopCities = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities_stats')
        .select('*');

      if (error) throw error;
      setCities(data && data.length > 0 ? data : []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  // Update arrow visibility
  const syncArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);
    return () => {
      el.removeEventListener('scroll', syncArrows);
      window.removeEventListener('resize', syncArrows);
    };
  }, [cities]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const step = (CARD_WIDTH + CARD_GAP) * 2;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide shadow-md">
            Our Reach
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Find Tutors in Your City
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We connect students with qualified home and online tutors across major cities in Pakistan
          </p>
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Scrollable track */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading cities...</div>
          ) : cities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No cities available yet</div>
          ) : (
            <div
              ref={trackRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-3 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {cities.map((city, index) => {
                const imgSrc =
                  CITY_IMAGES[city.city.toLowerCase()] || DEFAULT_IMAGE;
                return (
                  <div
                    key={city.city + index}
                    onClick={() => navigate('/tuition-request')}
                    className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 bg-white"
                  >
                    {/* City image — full card height equivalent */}
                    <div className="relative h-[200px] overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={`Home tutors in ${city.city}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    {/* City info */}
                    <div className="px-4 py-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors">
                        <MapPin className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                          {city.city}
                        </p>
                        <p className="text-xs text-gray-500">{city.tutor_count} tutors</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't see your city?{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Contact us
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopCities;
