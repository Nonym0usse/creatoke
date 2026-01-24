import { Injectable } from "@angular/core";
import { ApiConstant } from "../../constants/api-constant";
import { AuthenticationService } from "../global/authentication.service";
import { InterceptorService } from "../global/interceptor.service";
import { firstValueFrom } from "rxjs";
import { ApiCacheService } from "../global/api-global-cache";

@Injectable({ providedIn: "root" })
export class CommentService {
  constructor(
    private authenticationService: AuthenticationService,
    private axiosInterceptorService: InterceptorService,
    private apiCache: ApiCacheService
  ) {
    this.authenticationService.isAuthenticated().subscribe(() => {});
  }

  private async getValidToken(): Promise<string | null> {
    try {
      const token = await firstValueFrom(this.authenticationService.getToken());
      return token ?? null;
    } catch (e) {
      return localStorage.getItem("firebaseToken");
    }
  }

  private async authHeaders(): Promise<{ Authorization: string }> {
    const token = (await this.getValidToken()) ?? "";
    if (!token) throw new Error("Missing auth token");
    return { Authorization: `Bearer ${token}` };
  }

  // CREATE (invalidate)
  async createComment(data: any): Promise<any> {
    // si ton backend exige auth: active headers
    // sinon tu peux enlever ces 2 lignes
    const headers = await this.authHeaders();

    const res = await this.axiosInterceptorService
      .getAxiosInstance()
      .post(ApiConstant.API + "/comment/create", data, { headers });

    this.apiCache.invalidateTags("comment");
    return res;
  }

  // LIST by entity id (cached)
  listComment(id: string, opts?: { force?: boolean; ttlMs?: number }): Promise<any> {
    const safeId = encodeURIComponent(id);
    const key = `comment:list:${safeId}`;

    return this.apiCache.wrap(
      key,
      () => this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + "/comment/list/" + safeId),
      {
        force: opts?.force,
        ttlMs: opts?.ttlMs ?? 30_000, // 30s
        tags: ["comment"],
      }
    );
  }

  // LIST all (cached)
  getAllComments(opts?: { force?: boolean; ttlMs?: number }): Promise<any> {
    const key = "comment:listAll";

    return this.apiCache.wrap(
      key,
      () => this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + "/comment/list-all/"),
      {
        force: opts?.force,
        ttlMs: opts?.ttlMs ?? 30_000,
        tags: ["comment"],
      }
    );
  }

  // DELETE (invalidate)
  async deleteComment(id: string): Promise<any> {
    const headers = await this.authHeaders();
    const safeId = encodeURIComponent(id);

    const res = await this.axiosInterceptorService
      .getAxiosInstance()
      .delete(ApiConstant.API + "/comment/delete/" + safeId, { headers });

    this.apiCache.invalidateTags("comment");
    return res;
  }
}