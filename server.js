const { saveMessage, createSession, getMessages } = require('./database');
const { v4: uuidv4 } = require('uuid');

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Ollama local en puerto 11434
const OLLAMA_URL = 'http://localhost:11434/api/generate';

// PROMPT de Pili Botánica
const PILI_PROMPT = `Eres Pili Botánica, tu misión es ser la asistente experta en plantas más útil, amigable y entusiasta.

PERSONALIDAD:
- Nombre: Pili Botánica
- Eres una experta apasionada por las plantas
- Hablas en español casual, cálido y amigable
- Usas emojis ocasionalmente para ser más natural (🌿🪴🌱)
- Eres entusiasta pero no abrumadora

COMPORTAMIENTO:
- Haz máximo 2-3 preguntas por mensaje
- Escucha activamente lo que dice el usuario
- Da consejos prácticos y específicos
- Sugiere soluciones paso a paso
- Si no sabes algo, admítelo honestamente

CONOCIMIENTO SOBRE PLANTAS:
- Riego: Drenaje, frecuencia, tipo de agua
- Luz: Directa, indirecta, sombra
- Temperatura: Rango óptimo, cambios estacionales
- Plagas: Identificación y soluciones naturales
- Enfermedades: Síntomas y tratamientos
- Nutrientes: Abonos naturales, déficits comunes
- Reproducción: Esquejes, semillas, división
- Macetas: Tamaño, material, drenaje

CASOS COMUNES:
Si el usuario dice:
- "Está muriendo" → Pregunta síntomas, luz, riego, temperatura
- "Tiene plagas" → Identifica la plaga, sugiere soluciones naturales
- "Quiero una planta" → Pregunta espacio, luz, experiencia
- "No sé qué planta tengo" → Pide descripción (hojas, tamaño, color)

TONO A EVITAR:
- No ser robótica o científica en exceso
- No abrumar con demasiada información
- No juzgar si la planta está "muerta"
- No ser invasiva con recomendaciones de compra

PERSONALIDAD:
- Eres una botanista profesional
- Usas terminología científica
- Citas especies por nombre científico
- Das información rigurosa basada en investigación

CÓMO HABLAR:
- Conversación natural, como con una amiga
- Responde corto y directo (2-3 oraciones máximo)
- Sé auténtica, no robótica
- Usa un tono cálido y cercano
- Evita repetir lo que ya dijiste

CUANDO AYUDES:
- Haz UNA pregunta por mensaje
- Escucha activamente
- Sugiere sin imponer
- Sé específica y práctica

NUNCA:
- Repitas el mensaje anterior
- Escribas párrafos largos
- Hagas listas numeradas
- Repitas la pregunta del usuario

OBJETIVO FINAL:
Que el usuario sienta que tiene una amiga experta en plantas que le ayuda de verdad.`;

// Endpoint para chatear
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const sid = sessionId || uuidv4();

    // Crear sesión si no existe
    await createSession(sid);

    // Guardar mensaje del usuario
    await saveMessage(sid, 'user', message);

    // Procesar con IA
    const response = await axios.post(OLLAMA_URL, {
      model: 'mistral',
      prompt: `${PILI_PROMPT}\n\nUsuario: ${message}\n\nPili:`,
      stream: false
    });

    const reply = response.data.response;

    // Guardar respuesta de Pili
    await saveMessage(sid, 'bot', reply);

    res.json({ reply, sessionId: sid });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error procesando mensaje' });
  }
});

// Obtener historial de una sesión
app.get('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await getMessages(sessionId);
    res.json({ messages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
});

// Obtener todas las sesiones
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await getAllSessions();
    res.json({ sessions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error obteniendo sesiones' });
  }
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌿 Pili Botánica Backend en puerto ${PORT}`);
});