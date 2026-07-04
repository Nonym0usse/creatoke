import { Injectable } from "@angular/core";
import { ApiConstant } from "../../constants/api-constant";
import { InterceptorService } from "../global/interceptor.service";
import { ApiCacheService } from "../global/api-global-cache";

@Injectable({ providedIn: "root" })
export class LicenceService {
  // NB : pas de redirection ici — ce service est injecté dans des pages
  // publiques (fiche chanson) ; la protection des routes admin est
  // assurée par AuthGuard.
  constructor(
    private axiosInterceptorService: InterceptorService,
    private apiCache: ApiCacheService
  ) { }

  modifyLicence(body: any): Promise<any> {
    return this.axiosInterceptorService
      .getAxiosInstance()
      .put(ApiConstant.API + "/licence/update", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("firebaseToken") ?? ""}`,
        },
      })
      .then((res) => {
        this.apiCache.invalidateTags("licence");
        return res;
      });
  }

  listLicence(opts?: { force?: boolean; ttlMs?: number }): Promise<any> {
    const key = "licence:list";

    return this.apiCache.wrap(
      key,
      () =>
        this.axiosInterceptorService
          .getAxiosInstance()
          .get(ApiConstant.API + "/licence/list-licence"),
      {
        force: opts?.force,
        ttlMs: opts?.ttlMs ?? 60_000,
        tags: ["licence"],
      }
    );
  }
}