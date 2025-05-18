"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import type { ActivityLog } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface ExportLogsProps {
  logs: ActivityLog[]
}

export function ExportLogs({ logs }: ExportLogsProps) {
  const { toast } = useToast()
  const [format, setFormat] = useState<"csv" | "pdf">("csv")
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  )
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [includeUserInfo, setIncludeUserInfo] = useState(true)
  const [includeIPAddress, setIncludeIPAddress] = useState(true)
  const [includeResourceDetails, setIncludeResourceDetails] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    // Filter logs by date range
    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.timestamp)
      return (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate)
    })

    try {
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (format === "csv") {
        exportAsCSV(filteredLogs)
      } else {
        exportAsPDF(filteredLogs)
      }

      toast({
        title: "Export Successful",
        description: `Activity logs exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the logs",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsCSV = (filteredLogs: ActivityLog[]) => {
    // Create CSV header
    const headers = ["Timestamp", "Action", "Resource"]

    if (includeUserInfo) {
      headers.push("User ID", "Username")
    }

    if (includeIPAddress) {
      headers.push("IP Address")
    }

    if (includeResourceDetails) {
      headers.push("Resource ID", "Details")
    }

    // Create CSV content
    let csvContent = headers.join(",") + "\n"

    filteredLogs.forEach((log) => {
      const row = [new Date(log.timestamp).toISOString(), log.action, log.resource]

      if (includeUserInfo) {
        row.push(log.user, log.username || "")
      }

      if (includeIPAddress) {
        row.push(log.ipAddress || "")
      }

      if (includeResourceDetails) {
        row.push(log.id || "", `"${log.details.replace(/"/g, '""')}"`)
      }

      csvContent += row.join(",") + "\n"
    })

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `activity_logs_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAsPDF = (filteredLogs: ActivityLog[]) => {
    // In a real application, you would use a library like jsPDF
    // For this example, we'll just show an alert
    toast({
      title: "PDF Export Simulated",
      description: "In a production app, this would generate a PDF file using a library like jsPDF",
    })

    // Example of how you might implement this with jsPDF:
    /*
    import { jsPDF } from 'jspdf';
    import 'jspdf-autotable';
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Activity Logs Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);
    
    // Define table columns
    const columns = ['Timestamp', 'Action', 'Resource'];
    if (includeUserInfo) columns.push('User', 'Username');
    if (includeIPAddress) columns.push('IP Address');
    if (includeResourceDetails) columns.push('Resource ID', 'Details');
    
    // Prepare table data
    const rows = filteredLogs.map(log => {
      const row = [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.resource
      ];
      
      if (includeUserInfo) row.push(log.userId, log.username || '');
      if (includeIPAddress) row.push(log.ipAddress || '');
      if (includeResourceDetails) row.push(log.resourceId || '', log.details);
      
      return row;
    });
    
    // Add table to document
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      margin: { top: 40 },
      styles: { overflow: 'linebreak' },
      columnStyles: { 
        // Adjust column widths as needed
        7: { cellWidth: 50 } // Details column
      },
      headStyles: {
        fillColor: [66, 66, 66]
      }
    });
    
    // Save the PDF
    doc.save(`activity_logs_${new Date().toISOString().split('T')[0]}.pdf`);
    */
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Activity Logs</CardTitle>
        <CardDescription>Download activity logs for auditing and compliance purposes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as "csv" | "pdf")}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>CSV</span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>PDF</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker date={startDate} setDate={setStartDate} placeholder="Start date" />
              <DatePicker date={endDate} setDate={setEndDate} placeholder="End date" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Include Information</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeUserInfo"
                checked={includeUserInfo}
                onCheckedChange={(checked) => setIncludeUserInfo(!!checked)}
              />
              <Label htmlFor="includeUserInfo">User Information</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeIPAddress"
                checked={includeIPAddress}
                onCheckedChange={(checked) => setIncludeIPAddress(!!checked)}
              />
              <Label htmlFor="includeIPAddress">IP Addresses</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeResourceDetails"
                checked={includeResourceDetails}
                onCheckedChange={(checked) => setIncludeResourceDetails(!!checked)}
              />
              <Label htmlFor="includeResourceDetails">Resource Details</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} disabled={isExporting || logs.length === 0} className="w-full sm:w-auto">
          {isExporting ? (
            <>
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export {format.toUpperCase()}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
