import { NextRequest, NextResponse } from 'next/server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

const SPREADSHEET_ID = '1Z1MrhBUm2cAtd6z0KXknog59fnn8b0huBVDeu9yxflg'
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

interface ProcessData {
  id: string
  title: string
  category: string
  steps: string
  avgTime: string
  difficulty: string
  description: string
  processSteps: string
}

interface FormattedProcesses {
  processList: Record<string, any[]>
  processSteps: Record<string, any[]>
  processCategories: any[]
}

export async function GET(request: NextRequest) {
  try {
    // Verificar que tengamos las credenciales
    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Service Account credentials')
    }

    // Autenticar con Google Sheets
    const jwt = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwt)
    await doc.loadInfo()
    
    // Obtener la primera hoja
    const sheet = doc.sheetsByIndex[0]
    const rows = await sheet.getRows()
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No data found in sheet' }, { status: 404 })
    }
    
    // Convertir filas a objetos
    const processes = rows.map((row: any) => ({
      id: row.id || '',
      title: row.title || '',
      category: row.category || '',
      steps: row.steps || '',
      avgTime: row.avgtime || '',
      difficulty: row.difficulty || '',
      description: row.description || '',
      processSteps: row.processsteps || ''
    }))
    
    // Formatear al formato esperado por la aplicación
    const formattedProcesses: FormattedProcesses = {
      processList: {},
      processSteps: {},
      processCategories: []
    }
    
    // Agrupar por categorías
    const categories = new Set<string>()
    
    processes.forEach((process: ProcessData) => {
      const category = process.category || 'other'
      categories.add(category)
      
      // Agregar a processList
      if (!formattedProcesses.processList[category]) {
        formattedProcesses.processList[category] = []
      }
      
      formattedProcesses.processList[category]!.push({
        id: process.id,
        title: process.title,
        description: process.description,
        category: category,
        steps: parseInt(process.steps) || 0,
        avgTime: process.avgTime,
        difficulty: process.difficulty,
        usage: Math.floor(Math.random() * 200) + 50, // Temporal
        lastUpdated: "Hoy"
      })
      
      // Parsear los pasos del proceso
      try {
        const steps = JSON.parse(process.processSteps || '[]')
        formattedProcesses.processSteps[process.id] = steps
      } catch (e) {
        console.error(`Error parsing steps for ${process.id}:`, e)
        formattedProcesses.processSteps[process.id] = []
      }
    })
    
    // Crear categorías
    formattedProcesses.processCategories = Array.from(categories).map((category) => ({
      id: category,
      title: category.charAt(0).toUpperCase() + category.slice(1),
      description: `Procesos de ${category}`,
      icon: "folder",
      color: "blue",
      processes: formattedProcesses.processList[category]?.length || 0,
      avgTime: "5-10 min",
      href: `/processes/${category}`
    }))
    
    return NextResponse.json(formattedProcesses)
    
  } catch (error) {
    console.error('Error syncing processes:', error)
    return NextResponse.json(
      { error: 'Failed to sync processes from Google Sheets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Forzar resincronización
    const response = await GET(request)
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to force sync' },
      { status: 500 }
    )
  }
}
