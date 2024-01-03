import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// O ExecutionContext é o incoming request, e pode-se utilizar para abstrair um websocket message, um gRPC request, um HTTP request...
//Deixamos portanto em aberto a forma que o decorator tem de recber mensagens
export const CurrentUser = createParamDecorator(
  // never means we don't want to pass anything on the decorator
  (data: never, context: ExecutionContext) => {
    //incoming request
    const request = context.switchToHttp().getRequest();

    // console.log(request.session.userId); //access the session

    //Access the user assigned on "current-user-interceptor"
    return request.currentUser;

    //O que retornarmos aqui vai servir como user argument onde for utilizado o decorator
    return 'hi there!';
  },
);
