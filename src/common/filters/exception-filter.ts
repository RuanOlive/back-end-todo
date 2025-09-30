import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();


    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    console.log("Filter Chamado!")

    response.status(status).json({
      statusCode: status,
      timeStamp: new Date().toISOString(),
      message: errorResponse !== "" ? errorResponse : "[Generic Error]: Operação não pode ser Realizada.",
      path: request.url
    })
  }
}