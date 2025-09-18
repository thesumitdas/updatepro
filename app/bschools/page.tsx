"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, MapPin, TrendingUp, GraduationCap, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface BSchool {
  id: string
  name: string
  short_name: string
  location: string
  city: string
  state: string
  type: string
  avg_package: number
  highest_package: number
  nirf_ranking: number
  placement_rate: number
  accepted_exams: string[]
  fees_min: number
  fees_max: number
}

interface Filters {
  type: string[]
  state: string
  examType: string[]
  feesRange: [number, number]
  rankingRange: [number, number]
}

export default function BSchoolsPage() {
  const searchParams = useSearchParams()
  const [schools, setSchools] = useState<BSchool[]>([])
  const [filteredSchools, setFilteredSchools] = useState<BSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('ranking')
  const [filters, setFilters] = useState<Filters>({
    type: [],
    state: '',
    examType: [],
    feesRange: [0, 5000000],
    rankingRange: [1, 100]
  })

  const [states, setStates] = useState<string[]>([])
  const [examTypes, setExamTypes] = useState<string[]>([])

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [schools, searchTerm, filters, sortBy])

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('bschools')
        .select('*')
        .order('nirf_ranking', { ascending: true })

      if (error) throw error

      if (data) {
        setSchools(data)
        
        // Extract unique states and exam types for filters
        const uniqueStates = [...new Set(data.map(school => school.state).filter(Boolean))]
        const uniqueExams = [...new Set(data.flatMap(school => school.accepted_exams || []))]
        
        setStates(uniqueStates.sort())
        setExamTypes(uniqueExams.sort())
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...schools]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.accepted_exams?.some(exam => 
          exam.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(school => filters.type.includes(school.type))
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter(school => school.state === filters.state)
    }

    // Exam type filter
    if (filters.examType.length > 0) {
      filtered = filtered.filter(school => 
        filters.examType.some(exam => 
          school.accepted_exams?.includes(exam)
        )
      )
    }

    // Fees range filter
    filtered = filtered.filter(school => 
      (school.fees_min || 0) >= filters.feesRange[0] && 
      (school.fees_max || 0) <= filters.feesRange[1]
    )

    // Ranking range filter
    filtered = filtered.filter(school => 
      school.nirf_ranking >= filters.rankingRange[0] && 
      school.nirf_ranking <= filters.rankingRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'ranking':
        filtered.sort((a, b) => a.nirf_ranking - b.nirf_ranking)
        break
      case 'package':
        filtered.sort((a, b) => (b.avg_package || 0) - (a.avg_package || 0))
        break
      case 'placement':
        filtered.sort((a, b) => (b.placement_rate || 0) - (a.placement_rate || 0))
        break
      case 'fees':
        filtered.sort((a, b) => (a.fees_min || 0) - (b.fees_min || 0))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredSchools(filtered)
  }

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      type: [],
      state: '',
      examType: [],
      feesRange: [0, 5000000],
      rankingRange: [1, 100]
    })
    setSearchTerm('')
  }

  const formatPackage = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  const formatFees = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    return `₹${(amount / 100000).toFixed(1)}L`
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* School Type */}
      <div>
        <Label className="text-base font-medium mb-3 block">School Type</Label>
        <div className="space-y-2">
          {['Government', 'Private', 'Autonomous'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.type.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilter('type', [...filters.type, type])
                  } else {
                    updateFilter('type', filters.type.filter(t => t !== type))
                  }
                }}
              />
              <Label htmlFor={type}>{type}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* State */}
      <div>
        <Label className="text-base font-medium mb-3 block">State</Label>
        <Select value={filters.state} onValueChange={(value) => updateFilter('state', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All States</SelectItem>
            {states.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exam Type */}
      <div>
        <Label className="text-base font-medium mb-3 block">Accepted Exams</Label>
        <div className="space-y-2">
          {examTypes.map(exam => (
            <div key={exam} className="flex items-center space-x-2">
              <Checkbox
                id={exam}
                checked={filters.examType.includes(exam)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilter('examType', [...filters.examType, exam])
                  } else {
                    updateFilter('examType', filters.examType.filter(e => e !== exam))
                  }
                }}
              />
              <Label htmlFor={exam}>{exam}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Fees Range */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Fees Range: {formatFees(filters.feesRange[0])} - {formatFees(filters.feesRange[1])}
        </Label>
        <Slider
          value={filters.feesRange}
          onValueChange={(value) => updateFilter('feesRange', value as [number, number])}
          max={5000000}
          min={0}
          step={100000}
          className="w-full"
        />
      </div>

      {/* Ranking Range */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          NIRF Ranking: {filters.rankingRange[0]} - {filters.rankingRange[1]}
        </Label>
        <Slider
          value={filters.rankingRange}
          onValueChange={(value) => updateFilter('rankingRange', value as [number, number])}
          max={100}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-blue-600 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">B-School Directory</h1>
          <p className="text-lg opacity-90">
            Explore and compare {schools.length} business schools across India
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search B-Schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">NIRF Ranking</SelectItem>
                <SelectItem value="package">Avg Package</SelectItem>
                <SelectItem value="placement">Placement Rate</SelectItem>
                <SelectItem value="fees">Fees (Low to High)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filter B-Schools</SheetTitle>
                  <SheetDescription>
                    Narrow down your search with these filters
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel />
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredSchools.length} of {schools.length} B-Schools
              </p>
              <Link href="/compare">
                <Button variant="outline">
                  Compare Schools
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSchools.map((school) => (
                  <Card key={school.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{school.name}</CardTitle>
                          <CardDescription className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {school.location}
                          </CardDescription>
                        </div>
                        <Badge variant={school.type === 'Government' ? 'secondary' : 'outline'}>
                          {school.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">NIRF Rank:</span>
                            <div className="font-semibold">#{school.nirf_ranking}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Package:</span>
                            <div className="font-semibold text-green-600">
                              {formatPackage(school.avg_package)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Placement:</span>
                            <div className="font-semibold">{school.placement_rate}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Fees:</span>
                            <div className="font-semibold">
                              {formatFees(school.fees_min)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {school.accepted_exams?.slice(0, 3).map(exam => (
                            <Badge key={exam} variant="outline" className="text-xs">
                              {exam}
                            </Badge>
                          ))}
                        </div>

                        <Link href={`/bschools/${school.id}`} className="block">
                          <Button className="w-full mt-4 bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredSchools.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}