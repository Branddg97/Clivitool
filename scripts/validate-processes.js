#!/usr/bin/env node

/**
 * Script de Validación de Procesos
 * Se ejecuta automáticamente en cada deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️ ${message}`, colors.blue);
}

function validateProcessData() {
  try {
    logInfo('🔍 Iniciando validación de datos de procesos...');
    
    // Verificar que el archivo existe
    const processesDataPath = path.join(__dirname, '../lib/processes-data.ts');
    if (!fs.existsSync(processesDataPath)) {
      logError('Archivo processes-data.ts no encontrado');
      return false;
    }
    
    // Intentar cargar el archivo
    let processesData;
    try {
      // Eliminar cache de require
      delete require.cache[require.resolve('../lib/processes-data.ts')];
      processesData = require('../lib/processes-data.ts');
    } catch (error) {
      logError(`Error al cargar processes-data.ts: ${error.message}`);
      return false;
    }
    
    // Validar exportaciones requeridas
    const requiredExports = ['processCategories', 'processList', 'processSteps'];
    const missingExports = requiredExports.filter(export => !processesData[export]);
    
    if (missingExports.length > 0) {
      logError(`Exportaciones faltantes: ${missingExports.join(', ')}`);
      return false;
    }
    
    const { processCategories, processList, processSteps } = processesData;
    
    // Validar categorías
    if (!Array.isArray(processCategories) || processCategories.length === 0) {
      logError('No se encontraron categorías válidas');
      return false;
    }
    
    // Validar procesos
    const totalProcesses = Object.values(processList).flat().length;
    if (totalProcesses === 0) {
      logError('No se encontraron procesos válidos');
      return false;
    }
    
    // Validar pasos
    const totalSteps = Object.keys(processSteps).length;
    if (totalSteps === 0) {
      logError('No se encontraron pasos válidos');
      return false;
    }
    
    // Validar consistencia
    let issues = [];
    
    // Verificar que cada proceso tenga pasos
    Object.entries(processList).forEach(([category, processes]) => {
      processes.forEach(process => {
        if (!processSteps[process.id]) {
          issues.push(`Proceso ${process.id} no tiene pasos definidos`);
        }
      });
    });
    
    // Verificar IDs únicos
    const processIds = Object.values(processList).flat().map(p => p.id);
    const uniqueIds = new Set(processIds);
    if (processIds.length !== uniqueIds.size) {
      issues.push('Hay IDs de procesos duplicados');
    }
    
    // Verificar referencias nextStep
    Object.entries(processSteps).forEach(([processId, steps]) => {
      steps.forEach(step => {
        if (step.nextStep && !steps.find(s => s.id === step.nextStep)) {
          issues.push(`Referencia nextStep inválida: ${step.nextStep} en proceso ${processId}`);
        }
      });
    });
    
    // Mostrar resultados
    logSuccess('Validación completada');
    logInfo(`📊 Resumen:`);
    logInfo(`   Categorías: ${processCategories.length}`);
    logInfo(`   Procesos: ${totalProcesses}`);
    logInfo(`   Pasos: ${totalSteps}`);
    
    if (issues.length > 0) {
      logWarning(`Se encontraron ${issues.length} problemas:`);
      issues.forEach(issue => logWarning(`   - ${issue}`));
      return false;
    }
    
    logSuccess('✨ Todos los datos son válidos');
    return true;
    
  } catch (error) {
    logError(`Error en validación: ${error.message}`);
    return false;
  }
}

function validateBuild() {
  try {
    logInfo('🏗️ Verificando build...');
    
    // Ejecutar build en modo silencioso
    const result = execSync('npm run build', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (result.includes('error') || result.includes('Error')) {
      logError('Build falló');
      logError(result);
      return false;
    }
    
    logSuccess('Build exitoso');
    return true;
    
  } catch (error) {
    logError(`Build falló: ${error.message}`);
    return false;
  }
}

function main() {
  log('🚀 Script de Validación de Procesos Clivi', colors.cyan);
  log('=====================================', colors.cyan);
  
  const dataValid = validateProcessData();
  const buildValid = validateBuild();
  
  log('=====================================', colors.cyan);
  
  if (dataValid && buildValid) {
    logSuccess('🎉 Todas las validaciones pasaron exitosamente');
    process.exit(0);
  } else {
    logError('💥 Fallaron algunas validaciones');
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  validateProcessData,
  validateBuild,
  main
};
