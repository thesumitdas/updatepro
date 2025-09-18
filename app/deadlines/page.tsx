"use client"

import { useState, useEffect } from 'react'
import { Calendar, Clock, Filter, School, FileText, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface Deadline {
  id: string
  title: string
  deadline_date: string
  description: string
  type: 'Application' | 'Exam' | 'Interview' | 'Result'
  bschool_id: string
  bschools: {
    name: string
    short_name: string
    type: string
  }
}

const typeIcons = {
  Application: FileText,
  Exam: School,
  Interview: Users,
  Result: CheckCircle
}

const typeColors = {
  Application: 'bg-blue-500',
  Exam: 'bg-orange-500',
  Interview: 'bg-purple-500',
  Result: 'bg-green-500'
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [filteredDeadlines, setFilteredDeadlines] = useState<Deadline[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  useEffect(() => {
    fetchDeadlines()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [deadlines, selectedType, selectedMonth])

  const fetchDeadlines = async () => {
    try {
      const { data, error } = await supabase
        .from('application_deadlines')
        .select(`
          *,
          bschools (
            name,
            short_name,
            type
          )
        `)
        .eq('is_active', true)
        .order('deadline_date', { ascending: true })

      if (error) throw error

      if (data) {
        setDeadlines(data as Deadline[])
      }
    } catch (error) {
      console.error('Error fetching deadlines:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...deadlines]

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(deadline => deadline.type === selectedType)
    }

    // Month filter
    if (selectedMonth !== 'all') {
      const monthNum = parseInt(selectedMonth)
      filtered = filtered.filter(deadline => {
        const month = new Date(deadline.deadline_date).getMonth() + 1
        return month === monthNum
      })
    }

    setFilteredDeadlines(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`
    } else if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Tomorrow'
    } else {
      return `In ${diffDays} days`
    }
  }

  const groupByMonth = (deadlines: Deadline[]) => {
    const groups: { [key: string]: Deadline[] } = {}
    
    deadlines.forEach(deadline => {
      const date = new Date(deadline.deadline_date)
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      
      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(deadline)
    })

    return groups
  }

  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 30
  }

  const upcomingDeadlines = filteredDeadlines.filter(deadline => isUpcoming(deadline.deadline_date))
  const allMonthGroups = groupByMonth(filteredDeadlines)

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
          <h1 className="text-3xl font-bold mb-4">Application Deadlines</h1>
          <p className="text-lg opacity-90">
            Stay on top of important dates for admissions, exams, and results
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Application">Applications</SelectItem>
              <SelectItem value="Exam">Exams</SelectItem>
              <SelectItem value="Interview">Interviews</SelectItem>
              <SelectItem value="Result">Results</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedType('all')
              setSelectedMonth('all')
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming (Next 30 Days)</TabsTrigger>
            <TabsTrigger value="all">All Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Deadlines</h2>
              <p className="text-gray-600">
                {upcomingDeadlines.length} deadlines in the next 30 days
              </p>
            </div>

            {upcomingDeadlines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingDeadlines.map(deadline => {
                  const IconComponent = typeIcons[deadline.type]
                  const isUrgent = isUpcoming(deadline.deadline_date) && 
                    new Date(deadline.deadline_date).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000

                  return (
                    <Card 
                      key={deadline.id} 
                      className={`hover:shadow-lg transition-shadow ${isUrgent ? 'ring-2 ring-red-500' : ''}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 ${typeColors[deadline.type]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={isUrgent ? 'destructive' : 'secondary'}
                              className="mb-1"
                            >
                              {getRelativeDate(deadline.deadline_date)}
                            </Badge>
                            <div className="text-sm text-gray-600">
                              {formatDate(deadline.deadline_date)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{deadline.title}</h3>
                            <p className="text-sm text-gray-600">{deadline.bschools?.name}</p>
                          </div>
                          
                          {deadline.description && (
                            <p className="text-sm text-gray-700">{deadline.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{deadline.type}</Badge>
                            <Badge 
                              variant={deadline.bschools?.type === 'Government' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {deadline.bschools?.type}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Deadlines</h3>
                <p className="text-gray-600">There are no deadlines in the next 30 days</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {Object.keys(allMonthGroups).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(allMonthGroups).map(([month, deadlines]) => (
                  <div key={month}>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{month}</h2>
                    <div className="space-y-4">
                      {deadlines.map(deadline => {
                        const IconComponent = typeIcons[deadline.type]
                        
                        return (
                          <Card key={deadline.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <div className={`w-12 h-12 ${typeColors[deadline.type]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">{deadline.title}</h3>
                                      <p className="text-gray-600">{deadline.bschools?.name}</p>
                                      {deadline.description && (
                                        <p className="text-sm text-gray-700 mt-1">{deadline.description}</p>
                                      )}
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                      <div className="text-lg font-semibold text-gray-900">
                                        {formatDate(deadline.deadline_date)}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {getRelativeDate(deadline.deadline_date)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 mt-3">
                                    <Badge variant="outline">{deadline.type}</Badge>
                                    <Badge 
                                      variant={deadline.bschools?.type === 'Government' ? 'secondary' : 'outline'}
                                      className="text-xs"
                                    >
                                      {deadline.bschools?.type}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Deadlines Found</h3>
                <p className="text-gray-600">No deadlines match your current filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}