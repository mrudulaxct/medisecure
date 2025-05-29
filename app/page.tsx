import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Shield, 
  Users, 
  Calendar, 
  FileText, 
  Activity,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Modern Healthcare
                <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Streamline your healthcare operations with our secure, role-based EHR system. 
                Manage patients, appointments, and medical records with ease.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/auth/signup">
                  <Button className="glass-button bg-white/20 hover:bg-white/30 text-white border border-white/20 px-8 py-3 text-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost" className="glass-button bg-transparent hover:bg-white/10 text-white px-8 py-3 text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
              Everything you need to manage your healthcare facility efficiently and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Patient Management",
                description: "Comprehensive patient profiles with medical history, contact information, and personal details."
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Appointment Scheduling",
                description: "Efficient appointment booking system with automated reminders and calendar integration."
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Medical Records",
                description: "Secure digital medical records with easy access for authorized healthcare providers."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Role-Based Access",
                description: "Advanced security with role-based permissions for admins, doctors, staff, and patients."
              },
              {
                icon: <Activity className="h-8 w-8" />,
                title: "Real-time Updates",
                description: "Live updates and notifications keep everyone informed about important changes."
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Care Coordination",
                description: "Seamless collaboration between healthcare providers for better patient outcomes."
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-card hover-lift animate-scale-in border-white/20 bg-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Access Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Designed for Every Role
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
              Tailored experiences for different healthcare professionals and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: "Administrators",
                color: "from-red-500 to-pink-600",
                features: ["User Management", "System Oversight", "Analytics & Reports", "Role Assignment"]
              },
              {
                role: "Doctors",
                color: "from-blue-500 to-indigo-600",
                features: ["Patient Records", "Appointment Schedule", "Medical Notes", "Prescription Management"]
              },
              {
                role: "Staff",
                color: "from-green-500 to-emerald-600",
                features: ["Patient Registration", "Appointment Booking", "Basic Records", "Communication Tools"]
              },
              {
                role: "Patients",
                color: "from-purple-500 to-violet-600",
                features: ["View Records", "Book Appointments", "Medical History", "Secure Messaging"]
              }
            ].map((roleInfo, index) => (
              <Card key={index} className="glass-card hover-lift border-white/20 bg-white/10">
                <CardContent className="p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${roleInfo.color} text-white mb-4`}>
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {roleInfo.role}
                  </h3>
                  <ul className="space-y-2">
                    {roleInfo.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/70">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="glass-card border-white/20 bg-white/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Healthcare Management?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Join healthcare facilities worldwide that trust MediSecure for their patient management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/signup">
                  <Button className="glass-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost" className="glass-button bg-white/20 hover:bg-white/30 text-white px-8 py-3 text-lg">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">MediSecure</span>
            </div>
            <div className="flex items-center space-x-6 text-white/60">
              <span>&copy; 2024 MediSecure. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-400" />
                <span>for healthcare</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
