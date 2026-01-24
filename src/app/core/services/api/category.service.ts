import { Injectable } from "@angular/core";
import { ApiConstant } from "../../constants/api-constant";
import { AuthenticationService } from "../global/authentication.service";
import { InterceptorService } from "../global/interceptor.service";
import { firstValueFrom } from "rxjs";
import { ApiCacheService } from "../global/api-global-cache";

@Injectable({ providedIn: "root" })
export class CategoryService {
  constructor(
    private authenticationService: AuthenticationService,
    private axiosInterceptorService: InterceptorService,
    private apiCache: ApiCacheService
  ) {
    this.authenticationService.isAuthenticated().subscribe(() => {});
  }

  // ✅ token toujours à jour
  private async getValidToken(): Promise<string | null> {
    try {
      // si ton AuthenticationService a déjà getToken() (comme dans SongService)
      // sinon remplace par localStorage.getItem(...)
      const token = await firstValueFrom(this.authenticationService.getToken());
      return token ?? null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return localStorage.getItem("firebaseToken"); // fallback
    }
  }

  private async authHeaders(): Promise<{ Authorization: string }> {
    const token = (await this.getValidToken()) ?? "";
    if (!token) throw new Error("Missing auth token");
    return { Authorization: `Bearer ${token}` };
  }

  // =========================
  // WRITE (invalidate)
  // =========================

  async createCategory(data: any): Promise<any> {
    const headers = await this.authHeaders();

    return this.axiosInterceptorService
      .getAxiosInstance()
      .post(ApiConstant.API + "/category/create-category", data, { headers })
      .then((res) => {
        this.apiCache.invalidateTags("category");
        alert("Sous catégorie créée avec succès");
        return res;
      })
      .catch((e) => {
        alert("Erreur.");
        throw e;
      });
  }

  async createBackground(data: any): Promise<any> {
    const headers = await this.authHeaders();

    const res = await this.axiosInterceptorService
      .getAxiosInstance()
      .put(ApiConstant.API + "/category/create-background", data, { headers });

    this.apiCache.invalidateTags("category");
    return res;
  }

  async deleteCategory(id: any, imagePath: any): Promise<any> {
    const headers = await this.authHeaders();

    const res = await this.axiosInterceptorService
      .getAxiosInstance()
      .post(ApiConstant.API + "/category/delete/", { id, picture: imagePath }, { headers });

    this.apiCache.invalidateTags("category");
    return res;
  }

  async modifyText(data: any): Promise<any> {
    const headers = await this.authHeaders();

    const res = await this.axiosInterceptorService
      .getAxiosInstance()
      .put(ApiConstant.API + "/category/modify-text", data, { headers });

    this.apiCache.invalidateTags("category");
    return res;
  }

  // =========================
  // READ (cached)
  // =========================

  getBackgroundImg(opts?: { force?: boolean; ttlMs?: number }): Promise<any> {
    const key = "category:backgroundImg";
    return this.apiCache.wrap(
      key,
      () => this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + "/category/getBackgroundImg/"),
      { force: opts?.force, ttlMs: opts?.ttlMs ?? 5 * 60_000, tags: ["category"] } // 5 min
    );
  }

  getCategory(opts?: { force?: boolean; ttlMs?: number }): Promise<any> {
    const key = "category:all";
    return this.apiCache.wrap(
      key,
      () => this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + "/category/getAllCategory"),
      { force: opts?.force, ttlMs: opts?.ttlMs ?? 2 * 60_000, tags: ["category"] } // 2 min
    );
  }


  getLastText(opts?: { force?: boolean; ttlMs?: number }): Promise<any> {
    const key = "category:lastText";
    return this.apiCache.wrap(
      key,
      () => this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + "/category/getlastText/"),
      { force: opts?.force, ttlMs: opts?.ttlMs ?? 30_000, tags: ["category"] } // 30s
    );
  }
}