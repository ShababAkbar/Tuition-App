import { Star, Quote, PlayCircle } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    name: "Sarah Ahmed",
    rating: 5,
    comment:
      "My daughter's grades improved significantly after just 3 months! The tutor is patient and really knows how to explain complex topics. Highly recommend Apna Tuition!",
    role: "Parent",
    subject: "O-Level Maths",
    avatar: "SA",
    avatarColor: "bg-blue-600",
  },
  {
    name: "Ali Hassan",
    rating: 5,
    comment:
      "Best tutoring service I've used. The online sessions are interactive and the tutors are highly qualified. My MDCAT preparation improved massively!",
    role: "Student",
    subject: "Entry Test Prep",
    avatar: "AH",
    avatarColor: "bg-purple-600",
  },
  {
    name: "Fatima Khan",
    rating: 5,
    comment:
      "Professional service with excellent tutors. My son is now confident in his studies and looking forward to exams. The free demo class was a great start.",
    role: "Parent",
    subject: "FSc Physics",
    avatar: "FK",
    avatarColor: "bg-green-600",
  },
  {
    name: "Usman Raza",
    rating: 5,
    comment:
      "Apna Tuition made it incredibly easy to find a qualified tutor near me. No hidden fees, no commission — exactly what parents need. 100% recommended!",
    role: "Parent",
    subject: "A-Level Sciences",
    avatar: "UR",
    avatarColor: "bg-orange-500",
  },
  {
    name: "Ayesha Tariq",
    rating: 5,
    comment:
      "The female tutor they arranged for my daughter was exceptional. She connects well with students and explains concepts in a very simple, engaging way.",
    role: "Parent",
    subject: "Matric Biology",
    avatar: "AT",
    avatarColor: "bg-pink-600",
  },
  {
    name: "Hamza Siddiqui",
    rating: 5,
    comment:
      "I found a great home tutor for my A-Level Economics within 24 hours! The platform is completely free and the tutors are thorougly verified.",
    role: "Student",
    subject: "A-Level Economics",
    avatar: "HS",
    avatarColor: "bg-teal-600",
  },
];

// Video testimonials — replace `videoId` with real YouTube video IDs when available
const videoTestimonials = [
  {
    name: "Hira Baig",
    role: "Parent · Lahore",
    videoId: "", // e.g. "dQw4w9WgXcQ"
    thumbnail: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=480&h=270&fit=crop&auto=format",
    quote: "Found the perfect O-Level tutor within a day. Absolutely love this platform!",
  },
  {
    name: "Bilal Ahmed",
    role: "Student · Islamabad",
    videoId: "",
    thumbnail: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=480&h=270&fit=crop&auto=format",
    quote: "My ECAT score improved by 30 marks after joining Apna Tuition. Game changer!",
  },
  {
    name: "Sadia Malik",
    role: "Parent · Karachi",
    videoId: "",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=270&fit=crop&auto=format",
    quote: "The tutor verification process gave me full confidence. Trusted platform.",
  },
];

const VideoCard = ({ item }: { item: typeof videoTestimonials[0] }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 group">
      {/* Thumbnail / Player */}
      <div className="relative h-44 overflow-hidden bg-gray-900">
        {playing && item.videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={item.name}
          />
        ) : (
          <>
            <img
              src={item.thumbnail}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
            />
            {/* Play button */}
            <button
              onClick={() => item.videoId && setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play video"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 ${item.videoId ? "group-hover:scale-110 cursor-pointer" : "opacity-60 cursor-default"}`}>
                <PlayCircle className="h-8 w-8 text-blue-600" />
              </div>
            </button>
            {!item.videoId && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                Coming Soon
              </span>
            )}
          </>
        )}
      </div>
      {/* Info */}
      <div className="p-5">
        <p className="text-gray-700 text-sm italic leading-relaxed mb-4">"{item.quote}"</p>
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
        <p className="text-xs text-gray-500">{item.role}</p>
      </div>
    </div>
  );
};

const LandingReviews = () => {
  return (
    <>
      {/* ── Text Reviews ── */}
      <section className="bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide shadow-md">
              Reviews
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lg:text-4xl">
              What Parents & Students Say
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 shadow-md border border-yellow-200">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1 font-bold text-gray-900">4.9</span>
                <span className="text-gray-500 text-sm">on Google</span>
              </div>
              <div className="rounded-full bg-green-100 px-5 py-2.5 text-sm font-semibold text-green-700 border border-green-300 shadow-md">
                5,000+ Happy Families
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-6 border border-orange-200 shadow-lg hover:shadow-2xl hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative quote */}
                <Quote className="absolute -top-1 -right-1 h-20 w-20 text-orange-50" />

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 leading-relaxed mb-5 text-sm">
                    "{review.comment}"
                  </p>

                  {/* Subject tag */}
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
                    {review.subject}
                  </span>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${review.avatarColor} text-white text-sm font-bold`}>
                      {review.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                      <div className="text-xs text-gray-500">{review.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Testimonials ── */}
      <section className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide shadow-md">
              Video Stories
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lg:text-4xl">
              Hear It Directly From Them
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Real parents and students sharing their experience with Apna Tuition — in their own words.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videoTestimonials.map((item, index) => (
              <VideoCard key={index} item={item} />
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            More video testimonials coming soon · Share your experience with us on WhatsApp
          </p>
        </div>
      </section>
    </>
  );
};

export default LandingReviews;
