import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import SEOHead from "@/components/SEOHead";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I find a tutor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Click on 'Find a Tutor' button, fill out the tuition request form with your requirements (subject, class, location, etc.), and we'll connect you with qualified tutors in your area."
        }
      },
      {
        "@type": "Question",
        "name": "Is there any fee for students to use Apna Tuition?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, our platform is completely free for students and parents. You only pay the agreed tuition fee directly to the tutor."
        }
      },
      {
        "@type": "Question",
        "name": "How are tutors verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All tutors go through a strict verification process including document verification (CNIC, educational certificates), background checks, and profile reviews before approval."
        }
      }
    ]
  };

  const faqs = [
    {
      category: "For Students & Parents",
      questions: [
        {
          q: "How do I find a tutor?",
          a: "Click on 'Find a Tutor' button, fill out the tuition request form with your requirements (subject, class, location, etc.), and we'll connect you with qualified tutors in your area."
        },
        {
          q: "Is there any fee for students to use ApnaTuition?",
          a: "No, our platform is completely free for students and parents. You only pay the agreed tuition fee."
        },
        {
          q: "How are tutors verified?",
          a: "All tutors go through a strict verification process including document verification (CNIC, educational certificates), background checks, and profile reviews before approval."
        },
        {
          q: "Can I choose between online and home tuition?",
          a: "Yes! You can specify your preference (online, home tuition, or both) when submitting your tuition request."
        },
        {
          q: "What if I'm not satisfied with my tutor?",
          a: "You can request a tutor change at any time. We're committed to ensuring you find the right match for your learning needs."
        },
        {
          q: "What subjects and grades do you cover?",
          a: "We cover all subjects from primary to university level, including O/A Levels, Matric, Intermediate, and professional courses."
        }
      ]
    },
    {
      category: "For Tutors",
      questions: [
        {
          q: "How do I become a tutor on ApnaTuition?",
          a: "Click on 'Become a Tutor', sign up, and complete your profile with educational qualifications and experience. Our team will review and approve your application within 24-48 hours."
        },
        {
          q: "What documents do I need to submit?",
          a: "You need to submit your CNIC (front and back), educational certificates, and provide details about your teaching experience."
        },
        {
          q: "Is there any registration fee for tutors?",
          a: "No, registration is completely free. We don't charge tutors any fees to join our platform."
        },
        {
          q: "How do I get tuition assignments?",
          a: "Once approved, you'll have access to available tuition opportunities in your area. You can view details and apply for assignments that match your expertise."
        },
        {
          q: "Can I teach both online and at home?",
          a: "Yes! You can specify your teaching mode preference (online, home tuition, or both) in your profile."
        }
      ]
    },
    {
      category: "General",
      questions: [
        {
          q: "Which cities does ApnaTuition operate in?",
          a: "We currently serve students in Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad, Gujranwala and Multan. We're rapidly expanding to more cities across Pakistan to make quality education accessible nationwide."
        },
        {
          q: "How do I contact ApnaTuition support?",
          a: "You can reach us via email at team.apnatuition@gmail.com, call us at 03194394344, or use the contact form on our Contact page."
        },
        {
          q: "Is my personal information secure?",
          a: "Yes, we take data privacy seriously. Your information is encrypted and never shared with third parties."
        },
        {
          q: "Can I have multiple tutors for different subjects?",
          a: "Absolutely! You can request multiple tutors for different subjects or even the same subject if you prefer."
        }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="FAQ - Frequently Asked Questions About Home Tuition"
        description="Get answers to common questions about finding home tutors, online tuition, tutor verification, fees, and how Apna Tuition works for students and tutors in Pakistan."
        canonical="https://apna-tuition.com/faq"
        keywords="home tuition faq, tutor questions, online tuition pakistan, how to find tutor"
        schema={faqSchema}
      />
      <LandingNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100">
              Find answers to common questions about ApnaTuition
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {section.category}
                </h2>
                
                <div className="space-y-4">
                  {section.questions.map((faq, faqIndex) => {
                    const globalIndex = sectionIndex * 100 + faqIndex;
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <div
                        key={globalIndex}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="font-semibold text-gray-900 pr-4">
                            {faq.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-600">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find the answer you're looking for? Feel free to contact our support team.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default FAQ;
