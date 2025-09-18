"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { X, Plus, Download, TrendingUp, Users, BookOpen, MapPin, Calendar, Award, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface BSchool {
  id: string
  name: string
  short_name: string
  location: string
  city: string
  state: string
  type: string
  website: string
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

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [allSchools, setAllSchools] = useState<BSchool[]>([])
  const [selectedSchools, setSelectedSchools] = useState<BSchool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    const schoolIds = searchParams.get('schools')
    if (schoolIds && allSchools.length > 0) {
      const ids = schoolIds.split(',')
      const schools = allSchools.filter(school => ids.includes(school.id))
      setSelectedSchools(schools)
    }
  }, [searchParams, allSchools])

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('bschools')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      if (data) {
        setAllSchools(data)
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const addSchool = (schoolId: string) => {
    if (selectedSchools.length >= 3) return

    const school = allSchools.find(s => s.id === schoolId)
    if (school && !selectedSchools.find(s => s.id === schoolId)) {
      setSelectedSchools([...selectedSchools, school])
    }
  }

  const removeSchool = (schoolId: string) => {
    setSelectedSchools(selectedSchools.filter(s => s.id !== schoolId))
  }

  const formatPackage = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  const formatFees = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(18)
    doc.text('B-School Comparison', 14, 22)
    
    // Date
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    // Comparison table data
    const headers = ['Criteria', ...selectedSchools.map(school => school.short_name)]
    const data = [
      ['Name', ...selectedSchools.map(school => school.name)],
      ['Location', ...selectedSchools.map(school => school.location)],
      ['Type', ...selectedSchools.map(school => school.type)],
      ['NIRF Ranking', ...selectedSchools.map(school => `#${school.nirf_ranking}`)],
      ['Average Package', ...selectedSchools.map(school => formatPackage(school.avg_package))],
      ['Highest Package', ...selectedSchools.map(school => formatPackage(school.highest_package))],
      ['Placement Rate', ...selectedSchools.map(school => `${school.placement_rate}%`)],
      ['Total Seats', ...selectedSchools.map(school => school.total_seats.toString())],
      ['Fees Range', ...selectedSchools.map(school => `${formatFees(school.fees_min)} - ${formatFees(school.fees_max)}`)],
      ['Established', ...selectedSchools.map(school => school.established_year.toString())],
      ['Accepted Exams', ...selectedSchools.map(school => school.accepted_exams?.join(', ') || 'N/A')],
      ['Website', ...selectedSchools.map(school => school.website || 'N/A')]
    ]

    // @ts-ignore
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8, cellPadding: 3 }
    })

    doc.save('bschool-comparison.pdf')
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
          <h1 className="text-3xl font-bold mb-4">Compare B-Schools</h1>
          <p className="text-lg opacity-90">
            Compare up to 3 business schools side by side
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* School Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Schools to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="border-2 border-dashed border-gray-300">
                <CardContent className="p-6 text-center">
                  {selectedSchools[index] ? (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-left flex-1">
                          <h3 className="font-semibold text-lg">{selectedSchools[index].name}</h3>
                          <p className="text-gray-600 flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedSchools[index].location}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSchool(selectedSchools[index].id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-left space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rank:</span>
                          <Badge variant="outline">#{selectedSchools[index].nirf_ranking}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Package:</span>
                          <span className="font-semibold text-green-600">
                            {formatPackage(selectedSchools[index].avg_package)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        School {index + 1}
                      </h3>
                      <Select onValueChange={(value) => addSchool(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a school" />
                        </SelectTrigger>
                        <SelectContent>
                          {allSchools
                            .filter(school => !selectedSchools.find(s => s.id === school.id))
                            .map(school => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedSchools.length > 1 && (
            <div className="flex justify-center">
              <Button onClick={exportToPDF} className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export to PDF
              </Button>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedSchools.length > 1 && (
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criteria</TableHead>
                      {selectedSchools.map(school => (
                        <TableHead key={school.id} className="text-center">
                          {school.short_name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Full Name</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          {school.name}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Location</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          {school.location}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Type</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          <Badge variant={school.type === 'Government' ? 'secondary' : 'outline'}>
                            {school.type}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Established</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          {school.established_year}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Website</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          {school.website ? (
                            <a 
                              href={school.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Visit
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Rankings & Placements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Rankings & Placements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criteria</TableHead>
                      {selectedSchools.map(school => (
                        <TableHead key={school.id} className="text-center">
                          {school.short_name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">NIRF Ranking</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          <Badge variant="secondary">#{school.nirf_ranking}</Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Average Package</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center font-semibold text-green-600">
                          {formatPackage(school.avg_package)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Highest Package</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center font-semibold text-blue-600">
                          {formatPackage(school.highest_package)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Placement Rate</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center font-semibold">
                          {school.placement_rate}%
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Admission Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Admission Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criteria</TableHead>
                      {selectedSchools.map(school => (
                        <TableHead key={school.id} className="text-center">
                          {school.short_name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Seats</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center font-semibold">
                          {school.total_seats}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fees Range</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          {formatFees(school.fees_min)} - {formatFees(school.fees_max)}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Accepted Exams</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {school.accepted_exams?.map(exam => (
                              <Badge key={exam} variant="outline" className="text-xs">
                                {exam}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Accreditations */}
            <Card>
              <CardHeader>
                <CardTitle>Accreditations & Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criteria</TableHead>
                      {selectedSchools.map(school => (
                        <TableHead key={school.id} className="text-center">
                          {school.short_name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Accreditations</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {school.accreditation?.map(acc => (
                              <Badge key={acc} variant="secondary" className="text-xs">
                                {acc}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Key Facilities</TableCell>
                      {selectedSchools.map(school => (
                        <TableCell key={school.id} className="text-center">
                          <div className="text-xs text-left">
                            {school.facilities?.slice(0, 3).map((facility, index) => (
                              <div key={facility} className="py-1">
                                • {facility}
                              </div>
                            ))}
                            {school.facilities && school.facilities.length > 3 && (
                              <div className="text-gray-500">
                                +{school.facilities.length - 3} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedSchools.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Comparing</h3>
            <p className="text-gray-600">Select at least 2 schools to begin comparison</p>
          </div>
        )}

        {selectedSchools.length === 1 && (
          <div className="text-center py-12">
            <Plus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Another School</h3>
            <p className="text-gray-600">Select at least one more school to compare</p>
          </div>
        )}
      </div>
    </div>
  )
}