"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = require("../controllers/user");
var router = express_1.default.Router();
var auth_1 = require("../middleware/auth");
router.post('/register', user_1.register);
router.post('/login', user_1.login);
router.get('/me', auth_1.protect, user_1.getMe);
router.put('/updateSize/params/:id', auth_1.protect, user_1.updateSize);
router.put('/updateMode/', auth_1.protect, auth_1.pee, user_1.updateMode);
router.get('/shertManagebyCampId/params/:id', user_1.getShertManageByCampId);
router.put('/updateProfile/', auth_1.protect, user_1.updateProfile);
router.put('/updateBottle/', auth_1.protect, user_1.updateBottle);
router.post('/changeModeToPee/params/:id', auth_1.protect, auth_1.pee, user_1.changeModeToPee);
router.put('/updateSleep/', auth_1.protect, user_1.updateSleep);
router.get('/getHelthIsue/params/:id', user_1.getHelthIsue);
router.get('/checkTel/params/:id', auth_1.protect, user_1.checkTel);
router.get('/getUser/params/:id', user_1.getUsers);
router.get('/getShertmanage/params/:id', user_1.getShertmanage);
router.put('/updateTimeOffset/', auth_1.protect, user_1.updateTimeOffset);
router.get('/getTimeOffset/params/:id', user_1.getTimeOffset);
router.put('/updateHelth/', auth_1.protect, user_1.updateHelth);
router.post('/signId/', auth_1.protect, user_1.signId);
router.post('/verifyEmail/', auth_1.protect, user_1.verifyEmail);
exports.default = router;
