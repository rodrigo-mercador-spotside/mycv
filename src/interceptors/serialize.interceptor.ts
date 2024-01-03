//Itś gonna take an object and serialize it into an JSON

import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// Já que é dificil controlar o Datatype de um interceptor dinâmico, pelo menos, registamos
// esta interface, que garante que aqui, apenas são passadas classes
// è de referir a dificuldade que o typescript tem em suportar Decorators
interface ClassConstructor {
  new (...args: any[]): {};
}

// Creates the Decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  // Para poder ser dinâmico!
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //Run something begore a request is handled by the request handler
    // console.log('Iḿ running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        //Run something before the response is sent out
        // console.log('I`m running before response is sent out', data);

        // plainToClass serializes the object
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
