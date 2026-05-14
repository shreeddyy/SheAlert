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
"[project]/lib/server/threat-analysis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeThreat",
    ()=>analyzeThreat
]);
function includesAny(prompt, keywords) {
    return keywords.some((keyword)=>prompt.includes(keyword));
}
function analyzeThreat(input, userId) {
    const prompt = input.toLowerCase();
    const highRiskTerms = [
        "following",
        "weapon",
        "attack",
        "stalker",
        "kidnap",
        "trapped",
        "assault"
    ];
    const mediumRiskTerms = [
        "alone",
        "dark",
        "unsafe",
        "suspicious",
        "harassed",
        "scared"
    ];
    let threatLevel = "LOW";
    if (includesAny(prompt, highRiskTerms)) {
        threatLevel = "HIGH";
    } else if (includesAny(prompt, mediumRiskTerms)) {
        threatLevel = "MEDIUM";
    }
    const observations = threatLevel === "HIGH" ? [
        "The description suggests immediate personal risk.",
        "You may need to move to a secure public place right away.",
        "Contacting trusted people or emergency services is advisable."
    ] : threatLevel === "MEDIUM" ? [
        "The situation shows warning signs that should be taken seriously.",
        "Staying visible and connected will lower risk.",
        "Preparation and quick access to help matter here."
    ] : [
        "The situation sounds manageable but still worth monitoring.",
        "Preventive safety steps can reduce escalation.",
        "Keeping awareness high is still recommended."
    ];
    const recommendations = threatLevel === "HIGH" ? [
        "Move toward a crowded or secure location immediately.",
        "Trigger SOS if you feel actively threatened.",
        "Call a trusted contact and keep them on the line.",
        "Avoid isolated streets or enclosed spaces.",
        "Share live location until you feel safe again."
    ] : threatLevel === "MEDIUM" ? [
        "Stay in well-lit public areas.",
        "Share your location with emergency contacts.",
        "Keep your phone unlocked and accessible.",
        "Plan the quickest route to a safe place.",
        "Escalate to SOS if the situation worsens."
    ] : [
        "Stay alert to changes around you.",
        "Inform a trusted contact where you are.",
        "Keep emergency tools ready.",
        "Use safe-path guidance if you feel uncertain.",
        "Trust your instincts if something changes."
    ];
    return {
        id: crypto.randomUUID(),
        userId,
        prompt: input,
        threatLevel,
        observations,
        recommendations,
        createdAt: new Date().toISOString()
    };
}
}),
"[project]/app/api/threat-analyzer/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$threat$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/threat-analysis.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])(request);
    const body = await request.json();
    const prompt = String(body.prompt ?? "").trim();
    if (!prompt) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Please describe the situation first."
        }, {
            status: 400
        });
    }
    const analysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$threat$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeThreat"])(prompt, user?.id);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeDb"])((db)=>({
            ...db,
            threatAnalyses: [
                ...db.threatAnalyses,
                analysis
            ]
        }));
    const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readDb"])();
    const recentAlerts = user ? db.sosAlerts.filter((alert)=>alert.userId === user.id).length : 0;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        analysis,
        context: {
            recentAlerts
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6e7bc3ce._.js.map