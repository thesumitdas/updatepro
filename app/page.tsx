"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Users, BookOpen, Calendar, ChevronRight, Star, MapPin, IndianRupee, GraduationCap, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

interface BSchool {
  id: string
  name: string
  short_name: string
  logo_url: string
  location: string
  city: string
  state: string
  type: string
  avg_package: number
  nirf_ranking: number
  placement_rate: number
}

export default function Homepage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [featuredSchools, setFeaturedSchools] = useState<BSchool[]>([])
  const [stats, setStats] = useState({
    totalSchools: 0,
    avgPackage: 0,
    topPlacement: 0,
    totalPrograms: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch featured schools (top 6 by ranking)
      const { data: schools } = await supabase
        .from('bschools')
        .select('*')
        .order('nirf_ranking', { ascending: true })
        .limit(6)

      if (schools) {
        setFeaturedSchools(schools)
      }

      // Fetch statistics
      const { data: allSchools } = await supabase
        .from('bschools')
        .select('avg_package, placement_rate')

      const { data: programs } = await supabase
        .from('programs')
        .select('id')

      if (allSchools && programs) {
        const avgPackage = allSchools.reduce((sum, school) => sum + (school.avg_package || 0), 0) / allSchools.length
        const maxPlacement = Math.max(...allSchools.map(school => school.placement_rate || 0))
        
        setStats({
          totalSchools: allSchools.length,
          avgPackage: avgPackage / 100000, // Convert to lakhs
          topPlacement: maxPlacement,
          totalPrograms: programs.length
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/bschools?search=${encodeURIComponent(searchTerm)}`
    }
  }

  const formatPackage = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-600">
                {" "}B-School
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover and compare India's top business schools. Get detailed information about programs, 
              cutoffs, placements, and application deadlines all in one place.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search B-Schools by name, location, or exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-24 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-full shadow-lg"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 rounded-full px-6"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalSchools}</div>
                <div className="text-sm text-gray-600">B-Schools</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.avgPackage.toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Avg Package</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.topPlacement}%</div>
                <div className="text-sm text-gray-600">Top Placement</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</div>
                <div className="text-sm text-gray-600">Programs</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured B-Schools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured B-Schools</h2>
            <p className="text-lg text-gray-600">Top-ranked business schools in India</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSchools.map((school) => (
                <Card key={school.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                      </div>
                      <Badge variant={school.type === 'Government' ? 'secondary' : 'outline'}>
                        {school.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                      {school.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {school.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">NIRF Rank</span>
                      <Badge variant="outline">#{school.nirf_ranking}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Avg Package</span>
                      <span className="font-semibold text-green-600">{formatPackage(school.avg_package)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Placement</span>
                      <span className="font-semibold">{school.placement_rate}%</span>
                    </div>
                    <Link href={`/bschools/${school.id}`}>
                      <Button className="w-full mt-4 bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 group-hover:shadow-lg transition-all">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/bschools">
              <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                View All B-Schools
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-50 to-blue-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-lg text-gray-600">Everything you need for your B-School journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/bschools" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group-hover:bg-gradient-to-br group-hover:from-pink-50 group-hover:to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Schools</h3>
                  <p className="text-sm text-gray-600">Explore all B-Schools with detailed information</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/compare" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare</h3>
                  <p className="text-sm text-gray-600">Side-by-side comparison of B-Schools</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/deadlines" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Deadlines</h3>
                  <p className="text-sm text-gray-600">Important application and exam dates</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact" className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Help</h3>
                  <p className="text-sm text-gray-600">Contact us for guidance and support</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}