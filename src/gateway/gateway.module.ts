import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway";
import { TravelModule } from "../travel/travel.module";
import { UsersModule } from "../users/users.module";
import { ChatModule } from "../chat/chat.module";
import { MessageModule } from "../message/message.module";


@Module({
    providers: [MyGateway]
})
export class GatewayModule{}
