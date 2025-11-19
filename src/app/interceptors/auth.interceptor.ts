import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem("token");

    console.log("🔹 Interceptor: Retrieved Token ->", token); // Debugging Log

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Interceptor: Token attached to request!");
    } else {
      console.warn("❌ Interceptor: No token found in sessionStorage!");
    }

    return next.handle(req);
  }
}
