"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var fridayActSchema = new mongoose_1.default.Schema({
    company: {
        type: String,
        require: [true, 'Plese fill company']
    },
    date: {
        type: Date
    },
    staffId: {
        type: [mongoose_1.default.Schema.ObjectId],
        default: []
    },
    limit: {
        type: Number
    },
    studentId: {
        type: [mongoose_1.default.Schema.ObjectId],
        default: []
    },
    placeId: {
        type: mongoose_1.default.Schema.ObjectId
    }
});
exports.default = mongoose_1.default.model('FridayAct', fridayActSchema);
