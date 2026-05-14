module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/lib/server/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readDb",
    ()=>readDb,
    "writeDb",
    ()=>writeDb
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DB_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "app-db.json");
const defaultDb = {
    users: [],
    sessions: [],
    contacts: [],
    sosAlerts: [],
    locationShares: [],
    threatAnalyses: [],
    audioRecords: [],
    safetyPlans: [],
    journeys: []
};
let writeQueue = Promise.resolve();
async function ensureDbFile() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(DB_PATH);
    } catch  {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(DB_PATH), {
            recursive: true
        });
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), "utf8");
    }
}
async function readDb() {
    await ensureDbFile();
    const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(DB_PATH, "utf8");
    return {
        ...defaultDb,
        ...JSON.parse(raw)
    };
}
async function writeDb(updater) {
    writeQueue = writeQueue.then(async ()=>{
        const current = await readDb();
        const next = await updater(current);
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf8");
    });
    await writeQueue;
}
}),
"[project]/lib/server/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getSessionToken",
    ()=>getSessionToken,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/db.ts [app-route] (ecmascript)");
;
;
function hashValue(value) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHash"])("sha256").update(value).digest("hex");
}
function hashPassword(password) {
    return hashValue(password);
}
function verifyPassword(password, passwordHash) {
    const incoming = Buffer.from(hashValue(password));
    const stored = Buffer.from(passwordHash);
    if (incoming.length !== stored.length) {
        return false;
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(incoming, stored);
}
async function createSession(userId) {
    const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(24).toString("hex");
    const session = {
        token,
        userId,
        createdAt: new Date().toISOString()
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeDb"])((db)=>({
            ...db,
            sessions: [
                ...db.sessions.filter((item)=>item.userId !== userId),
                session
            ]
        }));
    return token;
}
async function getSessionToken(request) {
    const header = request.headers.get("authorization");
    if (header?.startsWith("Bearer ")) {
        return header.slice("Bearer ".length);
    }
    return request.cookies.get("shealert_session")?.value ?? null;
}
async function getCurrentUser(request) {
    const token = await getSessionToken(request);
    if (!token) {
        return null;
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readDb"])();
    const session = db.sessions.find((item)=>item.token === token);
    if (!session) {
        return null;
    }
    return db.users.find((item)=>item.id === session.userId) ?? null;
}
}),
"[project]/app/api/dashboard/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/db.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])(request);
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Please sign in to view the dashboard."
        }, {
            status: 401
        });
    }
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readDb"])();
    const contacts = db.contacts.filter((item)=>item.userId === user.id);
    const sosAlerts = db.sosAlerts.filter((item)=>item.userId === user.id);
    const locationShares = db.locationShares.filter((item)=>item.userId === user.id);
    const threatAnalyses = db.threatAnalyses.filter((item)=>item.userId === user.id);
    const audioRecords = db.audioRecords.filter((item)=>item.userId === user.id);
    const safetyPlan = db.safetyPlans.find((item)=>item.userId === user.id);
    const journeys = db.journeys.filter((item)=>item.userId === user.id);
    const planChecks = safetyPlan ? Object.values(safetyPlan.checklist).filter(Boolean).length : 0;
    const readinessScore = Math.min(100, contacts.length * 15 + planChecks * 10 + (audioRecords.length > 0 ? 10 : 0) + (journeys.length > 0 ? 10 : 0));
    const recentActivity = [
        ...sosAlerts.map((item)=>({
                id: item.id,
                type: "SOS Alert",
                title: item.message,
                timestamp: item.createdAt
            })),
        ...locationShares.map((item)=>({
                id: item.id,
                type: "Location Share",
                title: item.active ? "Live location sharing started" : "Live location sharing stopped",
                timestamp: item.updatedAt
            })),
        ...threatAnalyses.map((item)=>({
                id: item.id,
                type: "Threat Analysis",
                title: `${item.threatLevel} risk analysis saved`,
                timestamp: item.createdAt
            })),
        ...audioRecords.map((item)=>({
                id: item.id,
                type: "Audio Evidence",
                title: "Audio evidence recording stored",
                timestamp: item.createdAt
            })),
        ...journeys.map((item)=>({
                id: item.id,
                type: "Journey Mode",
                title: item.status === "completed" ? `Journey completed: ${item.title}` : item.status === "cancelled" ? `Journey cancelled: ${item.title}` : `Journey started: ${item.title}`,
                timestamp: item.completedAt ?? item.startedAt
            }))
    ].sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        stats: {
            contacts: contacts.length,
            sosAlerts: sosAlerts.length,
            locationShares: locationShares.length,
            threatAnalyses: threatAnalyses.length,
            audioRecords: audioRecords.length,
            journeys: journeys.length,
            activeJourneys: journeys.filter((item)=>item.status === "active").length,
            readinessScore
        },
        safetyPlan,
        recentActivity
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ec143b4b._.js.map