import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class GptService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly apiUrl = process.env.OPENAI_API_URL;
  private readonly googleApiKey = process.env.GOOGLE_API_KEY;
  private readonly googleApiUrl = process.env.GOOGLE_API_URL;

  async getRecommendations(
    activities: string[],
    message: string,
    lugares: any[],
    oldBotPromts: Message[],
    oldBotResponses: Message[],
    travelDuration: number,
    amountOfTravelers: number,
  ): Promise<string> {
    try {
      const lugaresFormateados = lugares
        .map((lugar, index) =>
          `${index + 1}. ${lugar.name} - Dirección: ${lugar.address || 'N/A'}, Rating: ${lugar.rating || 'N/A'}`
        )
        .join('\n');

      let prompt = `
        Un viaje está asociado a un chat de viajes donde los usuarios se organizan y hacen peticiones a su asistente (vos). 
        Lugares recomendados por Google Places API (según las coordenadas del destino): ${lugaresFormateados}
        Actividades relacionadas al viaje: ${activities.join(', ')}.
        Duración del viaje: ${travelDuration} días.
        Cantidad de viajeros: ${amountOfTravelers}.
      `;

      if (oldBotPromts.length > 0) {
        prompt += `
          Peticiones anteriores de los usuarios:
          ${oldBotPromts.map((msg) => msg.content).join('\n')}

          Tus respuestas anteriores:
          ${oldBotResponses.map((msg) => msg.content).join('\n')}

          Con base en el historial anterior, responde la nueva consulta: ${message}.
        `;
      } else {
        prompt += `Esta es la primera consulta de un usuario en el chat: ${message}.`;
      }

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error.response?.data || error.message);
      throw new Error('No se pudo obtener una respuesta de la API.');
    }
  }

  async getNearbyPlaces(location: string): Promise<any[]> {
    try {
      const types = ['point_of_interest', 'restaurant', 'tourist_attraction'];
      const results = [];

      for (const type of types) {
        const response = await axios.get(this.googleApiUrl, {
          params: {
            location,
            radius: 1000,
            type,
            key: this.googleApiKey,
          },
        });

        results.push(
          ...response.data.results.map((place) => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            type,
          })),
        );
      }

      return results.filter(
        (place, index, self) =>
          index ===
          self.findIndex(
            (p) => p.name === place.name && p.address === place.address,
          ),
      );
    } catch (error) {
      console.error('Error al obtener lugares cercanos:', error.response?.data || error.message);
      throw new Error('No se pudieron obtener los lugares cercanos.');
    }
  }
}
