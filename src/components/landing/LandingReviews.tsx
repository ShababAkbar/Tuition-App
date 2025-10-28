import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Ahmed",
    rating: 5,
    comment: "My daughter's grades improved significantly after just 3 months! The tutor is patient and really knows how to explain complex topics.",
    role: "Parent",
  },
  {
    name: "Ali Hassan",
    rating: 5,
    comment: "Best tutoring service I've used. The online sessions are interactive and the tutors are highly qualified.",
    role: "Student",
  },
  {
    name: "Fatima Khan",
    rating: 5,
    comment: "Professional service with excellent tutors. My son is now confident in his studies and looking forward to exams.",
    role: "Parent",
  },
];

const LandingReviews = () => {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lg:text-4xl">
            What People Say About Us
          </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="font-bold text-gray-900">4.9</span>
              <span className="text-gray-600">on Google</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <Quote className="absolute -top-2 -right-2 h-24 w-24 text-blue-100" />
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-900 mb-6 leading-relaxed">
                    "{review.comment}"
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingReviews;
