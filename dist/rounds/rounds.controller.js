"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundsController = void 0;
const common_1 = require("@nestjs/common");
const rounds_service_1 = require("./rounds.service");
let RoundsController = class RoundsController {
    constructor(RoundsService) {
        this.RoundsService = RoundsService;
    }
    async findAll() {
        return this.RoundsService.getAll();
    }
    async create(rounds) {
        return this.RoundsService.create(rounds);
    }
};
exports.RoundsController = RoundsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoundsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RoundsController.prototype, "create", null);
exports.RoundsController = RoundsController = __decorate([
    (0, common_1.Controller)('rounds'),
    __metadata("design:paramtypes", [rounds_service_1.RoundsService])
], RoundsController);
//# sourceMappingURL=rounds.controller.js.map