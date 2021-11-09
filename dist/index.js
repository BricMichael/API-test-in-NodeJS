"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
//import routes
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
(0, dotenv_1.config)();
//import setting database
require("./database/settings");
const app = (0, express_1.default)();
//middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//routes
app.use('/api', authRoute_1.default);
app.use('/api', postRoutes_1.default);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
