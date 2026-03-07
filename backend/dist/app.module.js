"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.uploadFolder = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const database_service_1 = require("./database.service");
const auth_module_1 = require("./auth/auth.module");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const upload_module_1 = require("./upload/upload.module");
const respuesta_module_1 = require("./respuesta/respuesta.module");
const payment_module_1 = require("./payment/payment.module");
const fitoterapia_module_1 = require("./fitoterapia/fitoterapia.module");
const tcm_module_1 = require("./tcm/tcm.module");
const astrologia_module_1 = require("./astrologia/astrologia.module");
exports.uploadFolder = (0, path_1.join)(process.cwd(), 'img');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: exports.uploadFolder,
                serveRoot: "/img",
                serveStaticOptions: {
                    index: false,
                },
            }),
            user_module_1.UsersModule,
            auth_module_1.AuthModule,
            upload_module_1.UploadModule,
            respuesta_module_1.RespuestaModule,
            payment_module_1.PaymentModule,
            fitoterapia_module_1.FitoterapiaModule,
            tcm_module_1.TcmModule,
            astrologia_module_1.AstrologiaModule,
        ],
        providers: [database_service_1.DatabaseService, jwt_strategy_1.JwtStrategy],
        exports: [database_service_1.DatabaseService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map