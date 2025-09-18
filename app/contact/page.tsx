"use client"

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData])

      if (error) throw error

      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return

    setNewsletterLoading(true)

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: newsletterEmail }])

      if (error) throw error

      toast.success('Successfully subscribed to our newsletter!')
      setNewsletterEmail('')
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error)
      if (error.code === '23505') {
        toast.error('You are already subscribed to our newsletter.')
      } else {
        toast.error('Failed to subscribe. Please try again.')
      }
    } finally {
      setNewsletterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-blue-600 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-90">
            Have questions about B-Schools? We're here to help!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                We're here to help you navigate your B-School journey. Reach out to us for 
                personalized guidance, information about admissions, or any questions you might have.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Us</h3>
                      <p className="text-gray-600">info@bschoolportal.com</p>
                      <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Call Us</h3>
                      <p className="text-gray-600">+91 9999999999</p>
                      <p className="text-sm text-gray-500">Mon - Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Visit Us</h3>
                      <p className="text-gray-600">New Delhi, India</p>
                      <p className="text-sm text-gray-500">Meeting by appointment only</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Stay Updated
                </CardTitle>
                <CardDescription>
                  Subscribe to our newsletter for the latest B-School news and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="newsletter-email">Email Address</Label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={newsletterLoading}
                    className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700"
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this about?"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your question or how we can help you..."
                      required
                      rows={6}
                      className="mt-2 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I find the right B-School?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Use our comprehensive filters to search by location, fees, ranking, and accepted exams. 
                  Our comparison tool helps you evaluate multiple schools side by side.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are the cutoff scores accurate?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We regularly update our database with the latest cutoff information from official sources. 
                  However, we recommend verifying with the schools directly for the most current data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you provide admission counseling?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  While we provide comprehensive information, we don't offer direct admission counseling. 
                  Contact us for guidance on using our platform effectively.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How often is the information updated?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our team regularly updates school information, cutoffs, and deadlines. 
                  If you notice any outdated information, please let us know.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}