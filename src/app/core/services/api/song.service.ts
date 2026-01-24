import { Injectable } from '@angular/core';
import { ApiConstant } from '../../constants/api-constant';
import { AuthenticationService } from '../global/authentication.service';
import { InterceptorService } from '../global/interceptor.service';
import { firstValueFrom } from 'rxjs';
import { ApiCacheService } from '../global/api-global-cache';
import { Song } from '../../models/song.model';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  constructor(
    private authenticationService: AuthenticationService,
    private axiosInterceptorService: InterceptorService,
    private apiCache: ApiCacheService

  ) { }

  // Method to ensure the token is always valid
  private async getValidToken(): Promise<string | null> {
    try {
      const token = await firstValueFrom(this.authenticationService.getToken());
      return token ?? null; // Ensure the return type is string | null
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  }

  // Fetch songs by category
  async getSongByCategory(data: any): Promise<any> {
    try {
      const token = await this.getValidToken();
      return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/admin/getSongByCategory/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching songs by category:', error);
      throw error;
    }
  }

  // Fetch song by ID
  async getSongBySlug(slug: string): Promise<any> {
    try {
      const token = await this.getValidToken();
      return this.axiosInterceptorService.getAxiosInstance().get<{ data: Song[] }>(ApiConstant.API + '/admin/single-music/' + slug, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching song by ID:', error);
      throw error;
    }
  }

  // Fetch all songs
  async getAllSongs(): Promise<any> {
    try {
      const token = await this.getValidToken();
      return this.axiosInterceptorService.getAxiosInstance().get<{ data: Song[] }>(ApiConstant.API + '/admin/list-music', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching all songs:', error);
      throw error;
    }
  }

  // Create a new song
  async createSong(data: any): Promise<void> {
    try {
      const token = await this.getValidToken();
      await this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/admin/create-music', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        // invalide tout ce qui est taggé "licence"
        this.apiCache.invalidateTags("licence");
        return res;
      });
      alert('Chanson créée avec succès.');
    } catch (error) {
      console.error('Error creating song:', error);
      alert('Erreur lors de la création de la chanson.');
    }
  }

  // Delete a song
  async deleteSong(id: string, name: string): Promise<void> {
    try {
      const token = await this.getValidToken();
      console.log('Retrieved token:', token);

      await this.axiosInterceptorService.getAxiosInstance().delete(ApiConstant.API + '/admin/delete-music/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Chanson ' + name + ' supprimée avec succès');
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Erreur lors de la suppression de la chanson.');
    }
  }

  // Modify a song
  async modifySong(data: any): Promise<void> {
    try {
      const token = await this.getValidToken();
      await this.axiosInterceptorService.getAxiosInstance().put<{ data: Song[] }>(ApiConstant.API + '/admin/update-music', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Chanson modifiée avec succès.');
    } catch (error) {
      console.error('Error modifying song:', error);
      alert('Erreur lors de la modification de la chanson.');
    }
  }

  // Fetch highlighted songs
  async highlightedSongs(): Promise<any> {
    try {
      const token = await this.getValidToken();
      return this.axiosInterceptorService.getAxiosInstance().get<{ data: Song[] }>(ApiConstant.API + '/admin/highlight-music', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching highlighted songs:', error);
      throw error;
    }
  }
}