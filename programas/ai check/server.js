const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const zxcvbn = require('zxcvbn');

// Cargar variables de entorno primero
dotenv.config();

// Manejar errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Inicializar OpenAI de forma segura
let openai;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('OpenAI client initialized successfully');
  } else {
    console.error('OPENAI_API_KEY not found in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

app.post('/analyze-password', async (req, res) => {
  console.log('Request received:', req.body);
  
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    console.log('Processing password analysis...');
    
    // Análisis con zxcvbn
    const zxcvbnResult = zxcvbn(password);
    console.log('zxcvbn analysis complete, score:', zxcvbnResult.score);
    
    let aiAnalysis = "Análisis básico disponible";
    let improvedVersion = "No disponible";
    
    // Intentar análisis con IA
    if (openai) {
      try {
        console.log('Starting OpenAI analysis...');
        
        const prompt = `Analiza la seguridad de esta contraseña: "${password}". 
        Proporciona un análisis detallado en español incluyendo vulnerabilidades potenciales y sugerencias de mejora. 
        También sugiere una versión mejorada de la contraseña.
        Responde en formato JSON con las claves: "analysis", "improved_version".`;
        
        console.log('Sending request to OpenAI...');
        
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7
        });
        
        console.log('OpenAI response received');
        
        const content = response.choices[0].message.content;
        console.log('Raw OpenAI content:', content);
        
        try {
          const parsed = JSON.parse(content);
          aiAnalysis = parsed.analysis || content;
          improvedVersion = parsed.improved_version || "No disponible";
          console.log('Successfully parsed OpenAI response');
        } catch (parseError) {
          console.log('Could not parse as JSON, using raw content');
          aiAnalysis = content;
        }
        
      } catch (aiError) {
        console.error('OpenAI analysis failed:', aiError.message);
        aiAnalysis = `Error en análisis de IA: ${aiError.message}. Usando análisis básico.`;
        
        // Fallback a análisis básico
        if (zxcvbnResult.score <= 1) {
          aiAnalysis += "\n\nAnálisis básico: Tu contraseña es muy débil. Considera usar más caracteres, números y símbolos.";
        } else if (zxcvbnResult.score === 2) {
          aiAnalysis += "\n\nAnálisis básico: Tu contraseña tiene fuerza media. Puedes mejorarla agregando más caracteres.";
        } else {
          aiAnalysis += "\n\nAnálisis básico: Tu contraseña es fuerte. Buen trabajo en la seguridad.";
        }
      }
    } else {
      console.log('OpenAI not available, using basic analysis');
      aiAnalysis = "Análisis de IA no disponible. Usando análisis básico:\n";
      
      if (zxcvbnResult.score <= 1) {
        aiAnalysis += "Tu contraseña es muy débil. Considera usar más caracteres, números y símbolos.";
      } else if (zxcvbnResult.score === 2) {
        aiAnalysis += "Tu contraseña tiene fuerza media. Puedes mejorarla agregando más caracteres.";
      } else {
        aiAnalysis += "Tu contraseña es fuerte. Buen trabajo en la seguridad.";
      }
    }
    
    const finalResponse = {
      analysis: aiAnalysis,
      strength: zxcvbnResult.score,
      feedback: zxcvbnResult.feedback,
      improved_version: improvedVersion
    };
    
    console.log('Sending final response');
    res.json(finalResponse);
    
  } catch (error) {
    console.error('Error in route handler:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to analyze password', 
      details: error.message 
    });
  }
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000 with OpenAI integration');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});