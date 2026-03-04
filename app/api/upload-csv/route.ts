import { NextRequest, NextResponse } from 'next/server'
import { processCSVFile } from '@/lib/csv-processor'
import { writeFileSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('csv') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No CSV file provided' }, { status: 400 })
    }

    // Leer contenido del archivo
    const csvContent = await file.text()
    
    // Procesar CSV
    const newFileContent = processCSVFile(csvContent)
    
    // Escribir al archivo processes-data.ts
    const filePath = path.join(process.cwd(), 'lib', 'processes-data.ts')
    writeFileSync(filePath, newFileContent, 'utf8')
    
    // Limpiar require cache para que Next.js recargue el módulo
    delete require.cache[require.resolve('@/lib/processes-data.ts')]
    
    return NextResponse.json({ 
      success: true, 
      message: 'Processes updated successfully',
      stats: {
        fileSize: csvContent.length,
        generatedFile: newFileContent.length
      }
    })
    
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({ 
      error: 'Failed to process CSV', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'CSV upload endpoint. Use POST to upload a CSV file.',
    usage: {
      method: 'POST',
      contentType: 'multipart/form-data',
      body: 'csv file'
    }
  })
}
