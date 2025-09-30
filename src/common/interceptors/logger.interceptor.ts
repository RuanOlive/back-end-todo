import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor{
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {


    const request = context.switchToHttp().getRequest();


    const method = request.method;
    const url = request.url;
    const now = Date.now();


    console.log("[Logger Interceptor Chamado!]")
    console.log(`Request ${method} : ${url}`)

    return next.handle().pipe(
      tap(() => {
        console.log(`Resposta antes de enviar, tempo: ${Date.now() - now}ms`)
      })
    )

  }
}