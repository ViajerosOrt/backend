import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GptService {
  private readonly apiKey =
    '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';
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly googleApiKey = 'AIzaSyAt_RqOCQlq2AnINH7-ULoiU_J-BskgP_A';
  private readonly googleApiUrl =
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  async getRecommendations(
    activities: string[],
    message: string,
    lugares: any[]
  ): Promise<string> {
    try {

        const lugaresFormateados = lugares.map(
        (lugar, index) =>
        `${index + 1}. ${lugar.name} - Dirección: ${lugar.address || 'N/A'}, Rating: ${
            lugar.rating || 'N/A'
        }`
        ).join('\n');
      const prompt = `Eres un asistente de viajes. El usuario está planeando un viaje.
        La api Google Places API, recomendo estos lugares de interes ${lugaresFormateados} basandose en las coordenadas donde se encuentra su destino.
        Aquí están las actividades de interes para el viaje: ${activities.join(', ')}.
        Este usuario de da la siguiente pregunta ${message}. 
        Como asistente de viajes ¿Que reponderias es ese mensaje basandote en los lugares de interes y a las actividades que le gustarian hacer hacer?`;
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
      console.error(
        'Error al obtener recomendaciones:',
        error.response?.data || error.message,
      );
      throw new Error('No se pudo obtener una respuesta de la API.');
    }
  }

  async getNearbyPlaces(location: string):Promise<any[]> {
    try {

      const types = ['point_of_interest', 'restaurant', 'tourist_attraction'];
      const results = [];

      for(const t of types){
      const response = await axios.get(this.googleApiUrl, {
        params: {
          location: location,
          radius: 1000, 
          type: t, 
          key: this.googleApiKey,
        },
      });

      results.push(...response.data.results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        type: t 
      })));

     }

     return results.filter(
      (place, index, self) =>
        index === self.findIndex((p) => p.name === place.name && p.address === place.address)
    );
    } catch (error) {
      console.error(
        'Error al obtener lugares cercanos:',
        error.response?.data || error.message,
      );
      throw new Error('No se pudieron obtener los lugares cercanos.');
    }
  }
}
