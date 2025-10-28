import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Video, UserCheck, GraduationCap, Code, Brain } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Home Tutoring",
    description: "Connect with expert home tutors near you for personalized learning in all grades and subjects.",
  },
  {
    icon: Video,
    title: "Online Tutoring",
    description: "Learn from top teachers via secure and interactive virtual sessions from anywhere.",
  },
  {
    icon: UserCheck,
    title: "Female Tutors",
    description: "Available for students who prefer female tutors for both online and home tutoring.",
  },
  {
    icon: GraduationCap,
    title: "Exam Preparation",
    description: "Specialized tuition for entry tests, board exams, O/A Levels, MDCAT, ECAT & more.",
  },
  {
    icon: Code,
    title: "Skillset Development",
    description: "Get industry experts for Coding, languages, mental math etc. for skill enhancement.",
  },
  {
    icon: Brain,
    title: "O/A Levels Tutors",
    description: "Expert tutors specialized in Cambridge O/A Level curriculum with proven track records.",
  },
];

const LandingServices = () => {
  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lg:text-4xl">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Personalized Learning At Your Doorstep or Online
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group transition-all hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-blue-500"
            >
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-600 transition-colors">
                  <service.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingServices;
