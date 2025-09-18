"use client"

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  Calendar, 
  Mail, 
  MessageSquare, 
  TrendingUp,
  BookOpen,
  Eye,
  Award
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface Stats {
  totalSchools: number
  totalPrograms: number
  totalDeadlines: number
  totalSubscribers: number
  totalContacts: number
  unreadContacts: number
  recentSchools: any[]
  recentContacts: any[]
  recentSubscribers: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0,
    totalPrograms: 0,
    totalDeadlines: 0,
    totalSubscribers: 0,
    totalContacts: 0,
    unreadContacts: 0,
    recentSchools: [],
    recentContacts: [],
    recentSubscribers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch counts
      const [
        schoolsResult,
        programsResult,
        deadlinesResult,
        subscribersResult,
        contactsResult,
        unreadContactsResult
      ] = await Promise.all([
        supabase.from('bschools').select('id', { count: 'exact' }),
        supabase.from('programs').select('id', { count: 'exact' }),
        supabase.from('application_deadlines').select('id', { count: 'exact' }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' }),
        supabase.from('contact_submissions').select('id', { count: 'exact' }),
        supabase.from('contact_submissions').select('id', { count: 'exact' }).eq('is_read', false)
      ])

      // Fetch recent data
      const [
        recentSchoolsResult,
        recentContactsResult,
        recentSubscribersResult
      ] = await Promise.all([
        supabase.from('bschools').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }).limit(5)
      ])

      setStats({
        totalSchools: schoolsResult.count || 0,
        totalPrograms: programsResult.count || 0,
        totalDeadlines: deadlinesResult.count || 0,
        totalSubscribers: subscribersResult.count || 0,
        totalContacts: contactsResult.count || 0,
        unreadContacts: unreadContactsResult.count || 0,
        recentSchools: recentSchoolsResult.data || [],
        recentContacts: recentContactsResult.data || [],
        recentSubscribers: recentSubscribersResult.data || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-blue-600 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-lg opacity-90">
            Welcome back! Here's what's happening with your B-School portal.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total B-Schools</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalSchools}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Programs</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalPrograms}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Active Deadlines</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalDeadlines}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Newsletter Subscribers</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.totalSubscribers}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Contact Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs">
                    {stats.unreadContacts} unread
                  </Badge>
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Platform Health</p>
                  <p className="text-2xl font-bold text-green-600">Excellent</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Tabs defaultValue="schools" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schools">Recent B-Schools</TabsTrigger>
            <TabsTrigger value="contacts">Recent Contacts</TabsTrigger>
            <TabsTrigger value="subscribers">Recent Subscribers</TabsTrigger>
          </TabsList>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle>Recently Added B-Schools</CardTitle>
                <CardDescription>Latest schools added to the database</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Added On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentSchools.length > 0 ? (
                      stats.recentSchools.map((school) => (
                        <TableRow key={school.id}>
                          <TableCell className="font-medium">{school.name}</TableCell>
                          <TableCell>{school.location}</TableCell>
                          <TableCell>
                            <Badge variant={school.type === 'Government' ? 'secondary' : 'outline'}>
                              {school.type}
                            </Badge>
                          </TableCell>
                          <TableCell>#{school.nirf_ranking}</TableCell>
                          <TableCell>{formatDate(school.created_at)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No schools added recently
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Recent Contact Submissions</CardTitle>
                <CardDescription>Latest inquiries from users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentContacts.length > 0 ? (
                      stats.recentContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell>
                            <Badge variant={contact.is_read ? 'secondary' : 'destructive'}>
                              {contact.is_read ? 'Read' : 'Unread'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(contact.created_at)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No contacts submitted recently
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle>Recent Newsletter Subscribers</CardTitle>
                <CardDescription>Latest newsletter subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentSubscribers.length > 0 ? (
                      stats.recentSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">
                            {subscriber.name || 'N/A'}
                          </TableCell>
                          <TableCell>{subscriber.email}</TableCell>
                          <TableCell>{subscriber.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={subscriber.is_active ? 'secondary' : 'outline'}>
                              {subscriber.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(subscriber.subscribed_at)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No recent subscriptions
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}