"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Globe, Calendar, Users, BookOpen, TrendingUp, Award, ExternalLink, Phone, Mail, Building, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface BSchool {
  id: string
  name: string
  short_name: string
  logo_url: string
  location: string
  city: string
  state: string
  type: string
  website: string
  description: string
  fees_min: number
  fees_max: number
  avg_package: number
  highest_package: number
  placement_rate: number
  nirf_ranking: number
  accepted_exams: string[]
  total_seats: number
  established_year: number
  accreditation: string[]
  facilities: string[]
}

interface Program {
  id: string
  name: string
  duration: string
  fees: number
  seats: number
  specializations: string[]
}

interface Cutoff {
  id: string
  exam_name: string
  year: number
  general: number
  obc: number
  sc: number
  st: number
  ews: number
}

interface Deadline {
  id: string
  title: string
  deadline_date: string
  description: string
  type: string
}

export default function BSchoolDetailPage() {
  const params = useParams()
  const [school, setSchool] = useState<BSchool | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [cutoffs, setCutoffs] = useState<Cutoff[]>([])
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSchoolData(params.id as string)
    }
  }, [params.id])

  const fetchSchoolData = async (schoolId: string) => {
    try {
      // Fetch school details
      const { data: schoolData } = await supabase
        .from('bschools')
        .select('*')
        .eq('id', schoolId)
        .single()

      if (schoolData) {
        setSchool(schoolData)
      }

      // Fetch programs
      const { data: programsData } = await supabase
        .from('programs')
        .select('*')
        .eq('bschool_id', schoolId)

      if (programsData) {
        setPrograms(programsData)
      }

      // Fetch cutoffs
      const { data: cutoffsData } = await supabase
        .from('cutoffs')
        .select('*')
        .eq('bschool_id', schoolId)
        .order('year', { ascending: false })

      if (cutoffsData) {
        setCutoffs(cutoffsData)
      }

      // Fetch deadlines
      const { data: deadlinesData } = await supabase
        .from('application_deadlines')
        .select('*')
        .eq('bschool_id', schoolId)
        .eq('is_active', true)
        .order('deadline_date', { ascending: true })

      if (deadlinesData) {
        setDeadlines(deadlinesData)
      }
    } catch (error) {
      console.error('Error fetching school data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPackage = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)} Lakhs`
  }

  const formatFees = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Crores`
    return `₹${(amount / 100000).toFixed(1)} Lakhs`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">School Not Found</h2>
          <p className="text-gray-600 mb-4">The requested B-School could not be found.</p>
          <Link href="/bschools">
            <Button>Back to Directory</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{school.name}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{school.location}</span>
                    </div>
                    <Badge className="bg-white/20">
                      {school.type}
                    </Badge>
                    <Badge className="bg-white/20">
                      Est. {school.established_year}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">NIRF Ranking</div>
              <div className="text-3xl font-bold">#{school.nirf_ranking}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatPackage(school.avg_package)}</div>
              <div className="text-sm text-gray-600">Average Package</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{school.placement_rate}%</div>
              <div className="text-sm text-gray-600">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{school.total_seats}</div>
              <div className="text-sm text-gray-600">Total Seats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatFees(school.fees_min)}</div>
              <div className="text-sm text-gray-600">Starting Fees</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="cutoffs">Cutoffs</TabsTrigger>
                <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{school.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Establishment</h4>
                          <p className="text-gray-600">{school.established_year}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Type</h4>
                          <p className="text-gray-600">{school.type}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Location</h4>
                          <p className="text-gray-600">{school.city}, {school.state}</p>
                        </div>
                        {school.website && (
                          <div>
                            <h4 className="font-semibold text-gray-900">Website</h4>
                            <a 
                              href={school.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              Visit Website <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Fees Range</h4>
                          <p className="text-gray-600">
                            {formatFees(school.fees_min)} - {formatFees(school.fees_max)}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Package Range</h4>
                          <p className="text-gray-600">
                            Avg: {formatPackage(school.avg_package)} | 
                            Highest: {formatPackage(school.highest_package)}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Total Seats</h4>
                          <p className="text-gray-600">{school.total_seats}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Placement Rate</h4>
                          <p className="text-gray-600">{school.placement_rate}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {school.accepted_exams && school.accepted_exams.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Accepted Exams</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {school.accepted_exams.map(exam => (
                          <Badge key={exam} variant="secondary">{exam}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {school.accreditation && school.accreditation.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Accreditations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {school.accreditation.map(acc => (
                          <Badge key={acc} variant="outline">{acc}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {school.facilities && school.facilities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Facilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {school.facilities.map(facility => (
                          <div key={facility} className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-gray-700">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="programs">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Programs</CardTitle>
                    <CardDescription>Programs offered by {school.short_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {programs.length > 0 ? (
                      <div className="space-y-6">
                        {programs.map(program => (
                          <div key={program.id} className="border rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-2">{program.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-gray-600">Duration:</span>
                                <div className="font-medium">{program.duration}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Fees:</span>
                                <div className="font-medium">{formatFees(program.fees)}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Seats:</span>
                                <div className="font-medium">{program.seats}</div>
                              </div>
                            </div>
                            {program.specializations && program.specializations.length > 0 && (
                              <div>
                                <span className="text-gray-600 text-sm">Specializations:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {program.specializations.map(spec => (
                                    <Badge key={spec} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No program information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cutoffs">
                <Card>
                  <CardHeader>
                    <CardTitle>Cutoff Scores</CardTitle>
                    <CardDescription>Historical cutoff data by exam and category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cutoffs.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Exam</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>General</TableHead>
                            <TableHead>OBC</TableHead>
                            <TableHead>SC</TableHead>
                            <TableHead>ST</TableHead>
                            <TableHead>EWS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cutoffs.map(cutoff => (
                            <TableRow key={cutoff.id}>
                              <TableCell className="font-medium">{cutoff.exam_name}</TableCell>
                              <TableCell>{cutoff.year}</TableCell>
                              <TableCell>{cutoff.general}</TableCell>
                              <TableCell>{cutoff.obc}</TableCell>
                              <TableCell>{cutoff.sc}</TableCell>
                              <TableCell>{cutoff.st}</TableCell>
                              <TableCell>{cutoff.ews}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-600">No cutoff information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deadlines">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Deadlines</CardTitle>
                    <CardDescription>Important dates and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {deadlines.length > 0 ? (
                      <div className="space-y-4">
                        {deadlines.map(deadline => (
                          <div key={deadline.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{deadline.title}</h3>
                              <p className="text-gray-600 text-sm">{deadline.description}</p>
                              <div className="mt-2">
                                <Badge variant="outline">{deadline.type}</Badge>
                                <span className="ml-2 text-sm text-gray-600">
                                  {formatDate(deadline.deadline_date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No deadline information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/compare?schools=${school.id}`} className="block">
                  <Button className="w-full" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Compare with Others
                  </Button>
                </Link>
                {school.website && (
                  <a 
                    href={school.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full" variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </a>
                )}
                <Link href="/contact" className="block">
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Get More Info
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">NIRF Ranking</span>
                    <Badge variant="secondary">#{school.nirf_ranking}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Placement Rate</span>
                    <span className="font-semibold">{school.placement_rate}%</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Package</span>
                    <span className="font-semibold text-green-600">
                      {formatPackage(school.avg_package)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Seats</span>
                    <span className="font-semibold">{school.total_seats}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}