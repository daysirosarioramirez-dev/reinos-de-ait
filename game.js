// ================================================
// REINOS DE AIT - RPG EDUCATIVO
// ================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tile = 32;
const cols = 20;
const rows = 12;

const $ = id => document.getElementById(id);

let map = "village";

let player = { x: 8, y: 6 };

let state = {
    hp: 100,
    maxHp: 100,
    mp: 30,
    maxMp: 30,
    level: 1,
    xp: 0,
    xpNext: 30,
    potions: 3,
    crystals: 0,
    coins: 0,
    battle: false,
    questStarted: false,
    questDone: false,
    mathPurpose: null,
    selectedAnswer: null,
    mathCorrect: null,
    lightningUnlocked: false
};
const inventory = {
    potions: 3,
    crystals: 0,
    coins: 0,
    items: [],
    legendary: {
        magicSword: false,
        protectiveShield: false,
        specialCrystal: false,
        legendaryCrown: false
    }
};

function updateInventory() {
    const potionsElement = $("inventoryPotions");
    const crystalsElement = $("inventoryCrystals");
    const itemsElement = $("inventoryItems");

    if (potionsElement) {
        potionsElement.textContent = inventory.potions;
    }

    if (crystalsElement) {
        crystalsElement.textContent = inventory.crystals;
    }

    if (itemsElement) {
        itemsElement.innerHTML = "";

        inventory.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            itemsElement.appendChild(li);
        });

        // Objetos legendarios
        const legendaryItems = {
            magicSword: "⚔️ Espada mágica",
            protectiveShield: "🛡️ Escudo protector",
            specialCrystal: "💎 Cristal especial",
            legendaryCrown: "👑 Corona legendaria"
        };

        for (const item in legendaryItems) {
            const li = document.createElement("li");

            if (inventory.legendary[item]) {
                li.textContent = legendaryItems[item] + " - DESBLOQUEADO";
            } else {
                li.textContent = legendaryItems[item] + " - Bloqueado";
            }

            itemsElement.appendChild(li);
        }
    }
}
let message = "¡Bienvenido a Reinos de Ait! Explora y completa desafíos.";

let enemy = {
    x: 16,
    y: 5,
    hp: 30,
    maxHp: 30,
    alive: true
};
let bat = {
    x: 10,
    y: 5,
    hp: 40,
    maxHp: 40,
    alive: true
};

let skeletonKing = {
    x: 10,
    y: 5,
    hp: 100,
    maxHp: 100,
    alive: true
};
let mountainGuardian = {
    x: 10,
    y: 5,
    hp: 70,
    maxHp: 70,
    alive: true
};
let crystal = {
    x: 15,
    y: 7,
    got: false
};

const chests = {
    village: { x: 11, y: 7, opened: false },
    forest: { x: 15, y: 9, opened: false },
    cave: { x: 15, y: 6, opened: false },
    mountain: { x: 15, y: 7, opened: false },
    ruins: { x: 15, y: 6, opened: false }
};

let npc = { x: 10, y: 5 };

let attackEffect = {
    active: false,
    x: 0,
    y: 0,
    start: 0
};

let enemyHitEffect = {
    active: false,
    start: 0
};

let damageText = {
    active: false,
    x: 0,
    y: 0,
    value: 0,
    start: 0
};

const zones = {
    forest: {
        name: "Bosque mágico",
        color: "#347a45",
        gate: { x: 1, y: 5 },
        destination: "cave",
        destinationPoint: { x: 8, y: 6 }
    },

    village: {
        name: "Aldea de Ait",
        color: "#987b4d",
        gate: { x: 17, y: 5 },
        destination: "forest",
        destinationPoint: { x: 2, y: 5 }
    },

    cave: {
        name: "Cueva de los enigmas",
        color: "#4b4b58",
        gate: { x: 17, y: 5 },
        destination: "mountain",
        destinationPoint: { x: 2, y: 5 }
    },

    mountain: {
        name: "Montaña del saber",
        color: "#8b877b",
        gate: { x: 17, y: 5 },
        destination: "ruins",
        destinationPoint: { x: 2, y: 5 }
    },

    ruins: {
        name: "Ruinas antiguas",
        color: "#78634c",
        gate: { x: 17, y: 5 },
        destination: "forest",
        destinationPoint: { x: 2, y: 5 }
    }
};

// ================================================
// GUARDADO
// ================================================

function saveGame() {
    const save = {
        map,
        player,
        state,
        enemy,
        bat,
        skeletonKing,
        mountainGuardian,
        crystal,
        chests,
        inventory
    };

    localStorage.setItem(
        "reinosDeAitSave",
        JSON.stringify(save)
    );
}
function loadGame() {
    const saved = localStorage.getItem("reinosDeAitSave");

    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        map = data.map || "village";
        player = data.player || player;

        if (data.state) {
            Object.assign(state, data.state);
            state.battle = false;
        }

        if (data.enemy) Object.assign(enemy, data.enemy);
        if (data.bat) Object.assign(bat, data.bat);
        if (data.skeletonKing) Object.assign(skeletonKing, data.skeletonKing);
        if (data.mountainGuardian) {
            Object.assign(mountainGuardian, data.mountainGuardian);
        }

        if (data.crystal) Object.assign(crystal, data.crystal);
        if (data.chests) { 
            Object.assign(chests, data.chests);} 

        if (data.inventory) {
            Object.assign(inventory, data.inventory);
        }

        updateInventory();

        message = "¡Partida cargada! Continúa tu aventura.";

    } catch (error) {
        console.log("No se pudo cargar la partida.");
    }
}

function newGame() {
    localStorage.removeItem("reinosDeAitSave");

    sessionStorage.setItem("reinosDeAitStartNew", "true");

    location.reload();
}

// Iniciar una nueva partida
function startGame() {
    localStorage.removeItem("reinosDeAitSave");

    sessionStorage.setItem("reinosDeAitStartNew","true")
    location.reload();
}

// Mostrar instrucciones
function showInstructions() {
    alert(
        "📖 INSTRUCCIONES DE REINOS DE AIT\n\n" +
        "⬆️⬇️⬅️➡️ o W, A, S, D: Mover al personaje.\n\n" +
        "E: Interactuar con objetos y cofres.\n\n" +
        "F: Iniciar un combate.\n\n" +
        "I: Abrir el inventario.\n\n" +
        "Durante los combates puedes atacar, usar magia, pociones o huir.\n\n" +
        "Resuelve los desafíos matemáticos para conseguir recompensas.\n\n" +
        "¡Explora los cinco reinos y salva el mundo!"
    );
}

// Salir del juego
function exitGame() {
    alert(
        "¡Gracias por jugar REINOS DE AIT!\n\n" +
        "Puedes cerrar esta pestaña para salir del juego."
    );
}

// ================================================
// TERRENO
// ================================================

function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tile, y * tile, tile, tile);

    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.strokeRect(x * tile, y * tile, tile, tile);
}

function drawGround() {
    const zone = zones[map];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            drawTile(x, y, zone.color);
            // =========================
            // ALDEA: CAMINOS Y VEGETACIÓN
            // =========================
            if (map === "village") {

                // Césped decorativo
                if ((x * 13 + y * 7) % 9 === 0) {
                    ctx.fillStyle = "#5ca653";
                    ctx.fillRect(
                        x * tile + 5,
                        y * tile + 7,
                        5,
                        3
                    );

                    ctx.fillRect(
                        x * tile + 18,
                        y * tile + 20,
                        4,
                        4
                    );
                }

                // Pequeñas plantitas
                if ((x * 11 + y * 5) % 17 === 0) {
                    ctx.fillStyle = "#28783a";
                    ctx.fillRect(
                        x * tile + 13,
                        y * tile + 15,
                        4,
                        8
                    );

                    ctx.fillStyle = "#76c957";
                    ctx.fillRect(
                        x * tile + 9,
                        y * tile + 13,
                        5,
                        4
                    );

                    ctx.fillRect(
                        x * tile + 16,
                        y * tile + 12,
                        5,
                        4
                    );
                }

                // CAMINO PRINCIPAL HACIA EL PORTAL
                if (y === 5) {
                    ctx.fillStyle = "#b99a6b";
                    ctx.fillRect(
                        x * tile,
                        y * tile,
                        tile,
                        tile
                    );

                    // Textura de tierra
                    ctx.fillStyle = "#94754d";

                    if ((x * 3) % 2 === 0) {
                        ctx.fillRect(
                            x * tile + 7,
                            y * tile + 9,
                            4,
                            3
                        );
                    }

                    ctx.fillStyle = "#d4b78a";
                    ctx.fillRect(
                        x * tile + 20,
                        y * tile + 23,
                        3,
                        3
                    );
                }

                // CAMINOS VERTICALES PARA RECORRER EL PUEBLO
                if (
                    (x === 6 && y >= 2 && y <= 9) ||
                    (x === 12 && y >= 2 && y <= 9)
                ) {
                    ctx.fillStyle = "#b99a6b";
                    ctx.fillRect(
                        x * tile,
                        y * tile,
                        tile,
                        tile
                    );

                    ctx.fillStyle = "#94754d";
                    ctx.fillRect(
                        x * tile + 8,
                        y * tile + 12,
                        4,
                        3
                    );

                    ctx.fillStyle = "#d4b78a";
                    ctx.fillRect(
                        x * tile + 21,
                        y * tile + 5,
                        3,
                        3
                    );
                }
            }

            // =========================
            // BOSQUE MÁGICO
            // =========================
            if (map === "forest") {
                ctx.fillStyle = "#4b9851";

                ctx.fillRect(
                    x * tile + ((x * 3 + y) % 20),
                    y * tile + ((x + y * 2) % 20),
                    3,
                    3
                );
            }

            // =========================
            // CUEVA DEL MURCIÉLAGO
            // =========================
            if (map === "cave") {
                // Piedras oscuras
                ctx.fillStyle = "#484858";
                ctx.fillRect(x * tile + 4, y * tile + 5, 7, 4);

                ctx.fillStyle = "#686879";
                ctx.fillRect(x * tile + 20, y * tile + 22, 5, 5);

                // Cristales violetas
                if ((x * 7 + y * 11) % 17 === 0) {
                    ctx.fillStyle = "#8b32c7";

                    ctx.beginPath();
                    ctx.moveTo(x * tile + 16, y * tile + 5);
                    ctx.lineTo(x * tile + 23, y * tile + 16);
                    ctx.lineTo(x * tile + 16, y * tile + 27);
                    ctx.lineTo(x * tile + 9, y * tile + 16);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = "#d9a5ff";
                    ctx.fillRect(x * tile + 14, y * tile + 10, 3, 8);
                }
            }

            // =========================
            // MONTAÑA DEL GUARDIÁN
            // =========================
            if (map === "mountain") {
                // Rocas
                ctx.fillStyle = "#8c8982";
                ctx.fillRect(x * tile + 4, y * tile + 6, 8, 5);

                ctx.fillStyle = "#d1cec4";
                ctx.fillRect(x * tile + 20, y * tile + 21, 6, 5);

                // Runas azules
                if ((x * 5 + y * 9) % 23 === 0) {
                    ctx.fillStyle = "#36cfff";

                    ctx.fillRect(x * tile + 14, y * tile + 8, 4, 16);
                    ctx.fillRect(x * tile + 8, y * tile + 14, 16, 4);

                    ctx.fillStyle = "#a6f4ff";
                    ctx.fillRect(x * tile + 15, y * tile + 15, 2, 2);
                }
            }

            // =========================
            // RUINAS DEL REY ESQUELETO
            // =========================
            if (map === "ruins") {
                // Bloques de piedra
                ctx.strokeStyle = "#51445f";
                ctx.lineWidth = 1;

                ctx.strokeRect(
                    x * tile + 2,
                    y * tile + 2,
                    tile - 4,
                    tile - 4
                );

                // Pequeñas marcas antiguas
                ctx.fillStyle = "#716080";

                if ((x + y) % 4 === 0) {
                    ctx.fillRect(x * tile + 9, y * tile + 10, 4, 4);
                    ctx.fillRect(x * tile + 20, y * tile + 19, 3, 3);
                }

                // Símbolos mágicos violetas
                if ((x * 3 + y * 7) % 21 === 0) {
                    ctx.fillStyle = "#b64cff";

                    ctx.fillRect(x * tile + 14, y * tile + 7, 4, 18);
                    ctx.fillRect(x * tile + 7, y * tile + 14, 18, 4);

                    ctx.fillStyle = "#e6baff";
                    ctx.fillRect(x * tile + 15, y * tile + 15, 2, 2);
                }
            }
        }
    }
}

// ================================================
// PERSONAJES
// ================================================

function drawCharacter(x, y, type) {
    const px = x * tile;
    const py = y * tile;
    // EFECTO DE DAÑO
    const hitTime = performance.now() - enemyHitEffect.start;

    if (
        enemyHitEffect.active &&
        hitTime < 250 &&
        ["slime", "bat", "skeletonKing", "mountainGuardian"].includes(type)
    ) {
        ctx.globalAlpha = Math.floor(hitTime / 60) % 2 === 0
            ? 0.35
            : 1;
    } else {
        ctx.globalAlpha = 1;
    }

    // Sombra
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(px + 5, py + 26, 22, 4);

    // GUARDIÁN DE PIEDRA
    if (type === "mountainGuardian") {
        // Brazos
        ctx.fillStyle = "#555b61";
        ctx.fillRect(px + 1, py + 13, 8, 14);
        ctx.fillRect(px + 23, py + 13, 8, 14);

        // Cuerpo de piedra
        ctx.fillStyle = "#777f86";
        ctx.fillRect(px + 7, py + 10, 18, 19);

        // Cabeza
        ctx.fillStyle = "#a0a6a8";
        ctx.fillRect(px + 7, py + 3, 18, 13);

        // Cuernos de roca
        ctx.fillStyle = "#555b61";
        ctx.fillRect(px + 4, py, 6, 9);
        ctx.fillRect(px + 22, py, 6, 9);

        // Ojos mágicos
        ctx.fillStyle = "#39e5ff";
        ctx.fillRect(px + 10, py + 8, 4, 4);
        ctx.fillRect(px + 18, py + 8, 4, 4);

        // Grietas
        ctx.fillStyle = "#42494f";
        ctx.fillRect(px + 15, py + 15, 3, 7);
        ctx.fillRect(px + 12, py + 21, 4, 2);

        // Piernas
        ctx.fillStyle = "#454b51";
        ctx.fillRect(px + 8, py + 27, 7, 4);
        ctx.fillRect(px + 17, py + 27, 7, 4);

        return;
    }

    // REY ESQUELETO
    if (type === "skeletonKing") {
        // Capa
        ctx.fillStyle = "#321b42";
        ctx.fillRect(px + 5, py + 17, 22, 12);

        // Cráneo
        ctx.fillStyle = "#e5dfc9";
        ctx.fillRect(px + 8, py + 5, 16, 16);

        // Corona
        ctx.fillStyle = "#d6a928";
        ctx.fillRect(px + 7, py + 3, 18, 5);
        ctx.fillRect(px + 8, py, 4, 5);
        ctx.fillRect(px + 14, py - 2, 4, 7);
        ctx.fillRect(px + 20, py, 4, 5);

        // Ojos rojos
        ctx.fillStyle = "#e32636";
        ctx.fillRect(px + 10, py + 11, 4, 4);
        ctx.fillRect(px + 18, py + 11, 4, 4);

        // Boca
        ctx.fillStyle = "#33252b";
        ctx.fillRect(px + 12, py + 18, 8, 3);

        return;
    }
    // MURCIÉLAGO OSCURO ANIMADO
    if (type === "bat") {
        const time = performance.now() / 1000;

        // Movimiento de las alas
        const flap = Math.sin(time * 12) * 5;

        // Alas oscuras
        ctx.fillStyle = "#241333";

        ctx.beginPath();
        ctx.moveTo(px + 13, py + 15);
        ctx.lineTo(px + 1, py + 8 + flap);
        ctx.lineTo(px + 3, py + 23);
        ctx.lineTo(px + 13, py + 22);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px + 19, py + 15);
        ctx.lineTo(px + 31, py + 8 + flap);
        ctx.lineTo(px + 29, py + 23);
        ctx.lineTo(px + 19, py + 22);
        ctx.closePath();
        ctx.fill();

        // Interior de las alas
        ctx.fillStyle = "#71348f";

        ctx.fillRect(px + 3, py + 15 + flap / 2, 8, 6);
        ctx.fillRect(px + 21, py + 15 + flap / 2, 8, 6);

        // Orejas
        ctx.fillStyle = "#241333";
        ctx.fillRect(px + 8, py + 3, 6, 9);
        ctx.fillRect(px + 18, py + 3, 6, 9);

        // Cabeza
        ctx.fillStyle = "#47205e";
        ctx.fillRect(px + 8, py + 8, 16, 13);

        // Cuerpo
        ctx.fillStyle = "#30143f";
        ctx.fillRect(px + 11, py + 18, 10, 9);

        // Ojos rojos
        ctx.fillStyle = "#ff3030";
        ctx.fillRect(px + 11, py + 12, 4, 4);
        ctx.fillRect(px + 19, py + 12, 4, 4);

        // Colmillos
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px + 14, py + 19, 2, 4);
        ctx.fillRect(px + 18, py + 19, 2, 4);

        return;
    }
    // SLIME ANIMADO
    if (type === "slime") {
        const time = performance.now() / 1000;

        // Movimiento de salto
        const jump = Math.abs(Math.sin(time * 5)) * 7;

        // Sombra
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.ellipse(
            px + 16,
            py + 29,
            11 - jump / 2,
            3,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Cuerpo
        ctx.fillStyle = "#145bba";
        ctx.fillRect(px + 5, py + 15 - jump, 22, 12);
        ctx.fillRect(px + 9, py + 8 - jump, 14, 10);

        // Brillo
        ctx.fillStyle = "#75d9ff";
        ctx.fillRect(px + 10, py + 10 - jump, 4, 4);

        // Ojos
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px + 11, py + 17 - jump, 3, 3);
        ctx.fillRect(px + 20, py + 17 - jump, 3, 3);

        // Boca
        ctx.fillStyle = "#092b63";
        ctx.fillRect(px + 12, py + 22 - jump, 9, 2);

        return;
    }
    
    // npc
    if (type === "npc") {
        ctx.fillStyle = "#60351f";
        ctx.fillRect(px + 8, py + 5, 16, 7);

        ctx.fillStyle = "#d9a078";
        ctx.fillRect(px + 9, py + 9, 14, 11);

        ctx.fillStyle = "#3b241b";
        ctx.fillRect(px + 12, py + 13, 2, 2);
        ctx.fillRect(px + 19, py + 13, 2, 2);

        ctx.fillStyle = "#fff4dc";
        ctx.fillRect(px + 7, py + 20, 18, 7);

        ctx.fillStyle = "#a66b39";
        ctx.fillRect(px + 11, py + 20, 10, 7);

        return;
    }
    
// HÉROE ANIMADO CON DIRECCIONES
    const walking = player.walkTime &&
        performance.now() - player.walkTime < 180;

    const step = walking
        ? Math.sin(performance.now() / 35) * 3
        : 0;

    const direction = player.direction || "down";

    ctx.save();

    // GIRAR EL CUERPO
    if (direction === "left") {
        ctx.translate(px + 32, py);
        ctx.scale(-1, 1);
        ctx.translate(-px, -py);
    }

    // CUANDO MIRA HACIA ARRIBA
    if (direction === "up") {
        // Cabello y cabeza vistos desde atrás
        ctx.fillStyle = "#60351f";
        ctx.fillRect(px + 8, py + 5, 17, 13);

        // Cuerpo
        ctx.fillStyle = "#b52d49";
        ctx.fillRect(px + 5, py + 17, 22, 9);

        // Brazos
        ctx.fillStyle = "#d9a078";
        ctx.fillRect(px + 3, py + 17 + step, 4, 9);
        ctx.fillRect(px + 25, py + 17 - step, 4, 9);
    } else {
        // Cuerpo
        ctx.fillStyle = "#b52d49";
        ctx.fillRect(px + 5, py + 13, 22, 12);

        // Brazos
        ctx.fillStyle = "#d9a078";
        ctx.fillRect(px + 3, py + 14 + step, 4, 9);
        ctx.fillRect(px + 25, py + 14 - step, 4, 9);

        // Cabeza
        ctx.fillStyle = "#d9a078";
        ctx.fillRect(px + 9, py + 8, 14, 12);

        // Cabello
        ctx.fillStyle = "#60351f";
        ctx.fillRect(px + 8, py + 5, 17, 6);
        ctx.fillRect(px + 7, py + 8, 4, 6);

        // Ojos: no se muestran al mirar hacia arriba
        if (direction === "down") {
            ctx.fillStyle = "#241b18";
            ctx.fillRect(px + 12, py + 12, 2, 3);
            ctx.fillRect(px + 19, py + 12, 2, 3);
        }
    }

    // Pantalón
    ctx.fillStyle = "#244e87";
    ctx.fillRect(px + 9, py + 20, 14, 6);

    // Piernas
    ctx.fillStyle = "#3c2b24";
    ctx.fillRect(px + 10, py + 26 + step, 5, 3);
    ctx.fillRect(px + 18, py + 26 - step, 5, 3);

    ctx.restore();
    ctx.globalAlpha = 1;
}

// ================================================
// PORTALES
// ================================================

function drawGate(x, y) {
    const px = x * tile;
    const py = y * tile;

    ctx.fillStyle = "#49305f";
    ctx.fillRect(px + 3, py + 3, 26, 29);

    ctx.fillStyle = "#9b66d6";
    ctx.fillRect(px + 7, py + 5, 18, 25);

    ctx.fillStyle = "#5de5ff";
    ctx.fillRect(px + 10, py + 8, 12, 19);

    ctx.fillStyle = "#b9fbff";
    ctx.fillRect(px + 13, py + 10, 5, 13);
}

// ================================================
// COFRE
// ================================================

function drawChest(chestToDraw) {
    if (!chestToDraw) return;

    const px = chestToDraw.x * tile;
    const py = chestToDraw.y * tile;

    ctx.fillStyle = "#4b2b17";
    ctx.fillRect(px + 5, py + 15, 22, 13);

    ctx.fillStyle = chestToDraw.opened ? "#b78342" : "#d49a45";
    ctx.fillRect(px + 5, py + 11, 22, 8);

    ctx.fillStyle = "#f3d36c";
    ctx.fillRect(px + 14, py + 15, 4, 8);

    if (chestToDraw.opened) {
        ctx.fillStyle = "#7deaff";
        ctx.fillRect(px + 9, py + 7, 14, 3);
    }
}

// ================================================
// CRISTAL
// ================================================

function drawCrystal() {
    const px = crystal.x * tile;
    const py = crystal.y * tile;

    ctx.fillStyle = "#6be7ff";

    ctx.beginPath();
    ctx.moveTo(px + 16, py + 4);
    ctx.lineTo(px + 27, py + 16);
    ctx.lineTo(px + 16, py + 28);
    ctx.lineTo(px + 5, py + 16);
    ctx.closePath();
    ctx.fill();
}

// ================================================
// MAPAS
// ================================================

function drawMapObjects() {
    if (map === "forest") {

      // CAMINOS DE TIERRA DEL BOSQUE

const paths = [
    [2,5],[3,5],[4,5],[5,5],
    [6,5],[7,5],[8,5],[9,5],
    [10,5],[11,5],[12,5],
    [12,6],[12,7],[12,8],
    [13,8],[14,8],[15,8]
];

paths.forEach(([x,y]) => {
    ctx.fillStyle = "#9b784b";
    ctx.fillRect(x * tile, y * tile, tile, tile);

    ctx.fillStyle = "#b49362";
    ctx.fillRect(x * tile + 5, y * tile + 8, 8, 3);

    ctx.fillStyle = "#80613e";
    ctx.fillRect(x * tile + 19, y * tile + 22, 5, 4);
});
      // DETALLES DEL SUELO DEL BOSQUE

// Pequeñas zonas de hierba
const grassDetails = [
    [2,4],[3,3],[6,5],[7,6],
    [10,2],[11,5],[14,7],[16,8],
    [18,2],[4,10],[10,10],[15,10]
];

grassDetails.forEach(([x,y]) => {
    ctx.fillStyle = "#65a85a";
    ctx.fillRect(x * tile + 7, y * tile + 12, 4, 9);

    ctx.fillRect(x * tile + 14, y * tile + 8, 4, 10);
});

// Flores de colores
const flowers = [
    [2,7,"#ff80ab"],
    [7,5,"#ffe66d"],
    [10,4,"#ffffff"],
    [15,9,"#d9a0ff"],
    [18,8,"#ff80ab"],
    [11,10,"#ffe66d"]
];

flowers.forEach(([x,y,color]) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * tile + 13, y * tile + 13, 6, 6);

    ctx.fillStyle = "#f5d76e";
    ctx.fillRect(x * tile + 15, y * tile + 15, 2, 2);
});

// Piedras pequeñas
const stones = [
    [4,2],[10,6],[14,10],[18,9],[7,8]
];

stones.forEach(([x,y]) => {
    ctx.fillStyle = "#858b82";
    ctx.fillRect(x * tile + 10, y * tile + 19, 11, 6);

    ctx.fillStyle = "#b7bdb4";
    ctx.fillRect(x * tile + 12, y * tile + 19, 5, 2);
});
        // Árboles
        const trees = [
            [5,2],[5,3],[5,4],
            [8,1],[8,2],[8,3],
            [3,6],[4,6],[5,6],
            [9,7],[9,8],[9,9],
            [12,3],[13,3],[14,3],
            [13,8],[13,9],
            [17,4],[17,5],[17,6],
            [6,9],[7,9]
        ];

        trees.forEach(([x,y]) => {
            if (x === zones.forest.gate.x &&
                y === zones.forest.gate.y) return;

            ctx.fillStyle = "#5b3a22";
            ctx.fillRect(x * tile + 13, y * tile + 18, 7, 13);

            ctx.fillStyle = "#173f2a";
            ctx.fillRect(x * tile + 2, y * tile + 8, 28, 18);

            ctx.fillStyle = "#3d8a45";
            ctx.fillRect(x * tile + 6, y * tile + 4, 20, 18);
        });
        drawChest(chests.forest);
        drawGate(zones.forest.gate.x, zones.forest.gate.y);

        if (!crystal.got) drawCrystal();

        if (enemy.alive) {
            drawCharacter(enemy.x, enemy.y, "slime");
        }
    }

    if (map === "village") {

    // DISEÑOS ÚNICOS DE LAS CASAS
    const houses = [
        // Casa grande con techo rojo
        {
            x: 2, y: 1, w: 112, h: 52,
            roof: "#9b3f35",
            wall: "#e6c18b",
            chimney: true,
            garden: false,
            style: "big"
        },

        // Casita pequeña de techo azul
        {
            x: 13, y: 0, w: 88, h: 42,
            roof: "#355c91",
            wall: "#d9d2a2",
            chimney: false,
            garden: false,
            style: "small"
        },

        // Casa con jardín
        {
            x: 2, y: 7, w: 96, h: 44,
            roof: "#3e7548",
            wall: "#dfb982",
            chimney: true,
            garden: true,
            style: "garden"
        },

        // Casa de madera
        {
            x: 13, y: 7, w: 108, h: 52,
            roof: "#70452e",
            wall: "#c89560",
            chimney: true,
            garden: false,
            style: "wood"
        }
    ];

    // CAMINOS DE PIEDRA DE LA ALDEA

const villagePaths = [
    [8,0],[8,1],[8,2],[8,3],[8,4],
    [8,5],[8,6],[8,7],[8,8],[8,9],
    [8,10],[8,11],
    [9,5],[10,5],[11,5],[12,5],
    [9,9],[10,9],[11,9],[12,9]
];

villagePaths.forEach(([x,y]) => {
    ctx.fillStyle = "#aaa69a";
    ctx.fillRect(x * tile, y * tile, tile, tile);

    ctx.strokeStyle = "#77746d";
    ctx.lineWidth = 1;
    ctx.strokeRect(
        x * tile + 2,
        y * tile + 2,
        tile - 4,
        tile - 4
    );

    ctx.fillStyle = "#c7c1b2";
    ctx.fillRect(x * tile + 8, y * tile + 8, 5, 4);
});

    houses.forEach(house => {
        const hx = house.x * tile;
        const hy = house.y * tile;
        const w = house.w;
        const h = house.h;

        // JARDÍN
        if (house.garden) {
            ctx.fillStyle = "#397c42";
            ctx.fillRect(hx - 12, hy + 15, w + 24, h + 20);

            // Cerca de madera
            ctx.fillStyle = "#b58a52";

            for (let i = 0; i < 7; i++) {
                ctx.fillRect(hx - 12 + i * 16, hy + h + 30, 5, 12);
            }

            ctx.fillRect(hx - 12, hy + h + 30, w + 24, 4);

            // Flores
            const flowers = ["#ff72a5", "#ffe66d", "#ffffff", "#c58aff"];

            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = flowers[i % flowers.length];
                ctx.fillRect(hx - 5 + i * 15, hy + h + 12, 5, 5);

                ctx.fillStyle = "#398f46";
                ctx.fillRect(hx - 4 + i * 15, hy + h + 17, 3, 7);
            }
        }

        // CHIMENEA
        if (house.chimney) {
            ctx.fillStyle = "#71412e";
            ctx.fillRect(hx + w - 25, hy - 20, 15, 30);

            ctx.fillStyle = "#a45a42";
            ctx.fillRect(hx + w - 29, hy - 23, 23, 5);
        }

        // PAREDES
        ctx.fillStyle = house.wall;
        ctx.fillRect(hx, hy + 20, w, h);

        // TEXTURA DE PAREDES
        ctx.strokeStyle = "#b28b5c";
        ctx.lineWidth = 1;

        for (let i = 0; i < h; i += 12) {
            ctx.beginPath();
            ctx.moveTo(hx, hy + 25 + i);
            ctx.lineTo(hx + w, hy + 25 + i);
            ctx.stroke();
        }

        // TECHO
        ctx.fillStyle = house.roof;
        ctx.beginPath();
        ctx.moveTo(hx - 10, hy + 25);
        ctx.lineTo(hx + w / 2, hy - 25);
        ctx.lineTo(hx + w + 10, hy + 25);
        ctx.closePath();
        ctx.fill();

        // BORDES DEL TECHO
        ctx.strokeStyle = "#4b3024";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(hx - 10, hy + 25);
        ctx.lineTo(hx + w / 2, hy - 25);
        ctx.lineTo(hx + w + 10, hy + 25);
        ctx.stroke();

        // PUERTA
        const doorW = house.style === "small" ? 16 : 22;
        const doorH = house.style === "big" ? 32 : 25;

        ctx.fillStyle = "#593522";
        ctx.fillRect(
            hx + w / 2 - doorW / 2,
            hy + 20 + h - doorH,
            doorW,
            doorH
        );

        // PERILLA
        ctx.fillStyle = "#e5c46b";
        ctx.fillRect(
            hx + w / 2 + doorW / 4,
            hy + 20 + h - doorH / 2,
            3,
            3
        );

        // VENTANAS
        const windowSize = house.style === "small" ? 12 : 18;

        ctx.fillStyle = "#57382b";

        ctx.fillRect(
            hx + 10,
            hy + 32,
            windowSize,
            windowSize
        );

        ctx.fillRect(
            hx + w - windowSize - 10,
            hy + 32,
            windowSize,
            windowSize
        );

        // LUZ DE LAS VENTANAS
        ctx.fillStyle = "#ffd875";

        ctx.fillRect(
            hx + 12,
            hy + 34,
            windowSize - 4,
            windowSize - 4
        );

        ctx.fillRect(
            hx + w - windowSize - 8,
            hy + 34,
            windowSize - 4,
            windowSize - 4
        );

        // CRUCES DE LAS VENTANAS
        ctx.fillStyle = "#6e472c";

        ctx.fillRect(
            hx + 10 + windowSize / 2 - 1,
            hy + 32,
            2,
            windowSize
        );

        ctx.fillRect(
            hx + w - windowSize / 2 - 11,
            hy + 32,
            2,
            windowSize
        );
    });
    // FAROLES DE LA ALDEA

const lanterns = [
    [6,4],
    [11,5],
    [16,4],
    [6,9],
    [11,9],
    [16,9]
];

lanterns.forEach(([x,y]) => {
    // Poste
    ctx.fillStyle = "#593b27";
    ctx.fillRect(x * tile + 14, y * tile + 10, 5, 20);

    // Luz exterior
    ctx.fillStyle = "rgba(255, 210, 90, 0.20)";
    ctx.beginPath();
    ctx.arc(x * tile + 16, y * tile + 10, 15, 0, Math.PI * 2);
    ctx.fill();

    // Farol
    ctx.fillStyle = "#d69a35";
    ctx.fillRect(x * tile + 10, y * tile + 2, 13, 12);

    ctx.fillStyle = "#fff0a3";
    ctx.fillRect(x * tile + 13, y * tile + 5, 7, 6);
});

    // PORTAL, COFRE Y NPC
    drawGate(zones.village.gate.x, zones.village.gate.y);
    drawChest(chests.village);
    drawCharacter(npc.x, npc.y, "npc");
}

    if (map === "cave") {
      // CRISTALES MAGICOS DE LA CUEVA

const caveCrystals = [
    [4,3,"#42e8ff"],
    [7,8,"#a66bff"],
    [11,3,"#42e8ff"],
    [14,8,"#d46bff"],
    [16,3,"#55f0cf"],
    [9,5,"#a66bff"]
];

caveCrystals.forEach(([x,y,color]) => {
    // Brillo exterior
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.20;
    ctx.beginPath();
    ctx.arc(
        x * tile + 16,
        y * tile + 16,
        18,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.globalAlpha = 1;

    // Cristal
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x * tile + 16, y * tile + 2);
    ctx.lineTo(x * tile + 27, y * tile + 15);
    ctx.lineTo(x * tile + 16, y * tile + 29);
    ctx.lineTo(x * tile + 5, y * tile + 15);
    ctx.closePath();
    ctx.fill();

    // Reflejo
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x * tile + 13, y * tile + 8, 4, 9);
});
        drawChest(chests.cave);
        drawGate(zones.cave.gate.x, zones.cave.gate.y);

        if (bat.alive) {
            drawCharacter(bat.x, bat.y, "bat");
        }
    }

    if (map === "mountain") {

      // NIEVE Y ROCAS DE LA MONTAÑA

const snowSpots = [
    [3,2],[4,2],[7,3],[10,2],
    [14,2],[16,7],[5,9],[11,10]
];

snowSpots.forEach(([x,y]) => {
    ctx.fillStyle = "#e4f2f5";
    ctx.fillRect(x * tile + 5, y * tile + 7, 22, 13);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x * tile + 9, y * tile + 5, 10, 5);
});

// ROCAS
const mountainRocks = [
    [4,5],[7,7],[10,4],[14,6],
    [17,9],[6,10],[12,8]
];

mountainRocks.forEach(([x,y]) => {
    ctx.fillStyle = "#777d83";
    ctx.fillRect(x * tile + 5, y * tile + 15, 22, 12);

    ctx.fillStyle = "#aeb8bd";
    ctx.fillRect(x * tile + 9, y * tile + 12, 12, 7);
});

// PINOS
const mountainPines = [
    [3,8],[8,2],[15,3],[18,7]
];

mountainPines.forEach(([x,y]) => {
    ctx.fillStyle = "#59402b";
    ctx.fillRect(x * tile + 13, y * tile + 17, 6, 13);

    ctx.fillStyle = "#285b43";
    ctx.beginPath();
    ctx.moveTo(x * tile + 16, y * tile);
    ctx.lineTo(x * tile + 2, y * tile + 22);
    ctx.lineTo(x * tile + 30, y * tile + 22);
    ctx.closePath();
    ctx.fill();
});
    drawChest(chests.mountain);
    drawGate(zones.mountain.gate.x, zones.mountain.gate.y);

    if (mountainGuardian.alive) {
        drawCharacter(
            mountainGuardian.x,
            mountainGuardian.y,
            "mountainGuardian"
        );
    } else if (!state.mountainGemGot) {
        // Gema mágica que aparece al derrotar al guardián
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.moveTo(12 * tile + 16, 5 * tile + 3);
        ctx.lineTo(12 * tile + 28, 5 * tile + 15);
        ctx.lineTo(12 * tile + 16, 5 * tile + 29);
        ctx.lineTo(12 * tile + 4, 5 * tile + 15);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

    if (map === "ruins") {

      // COLUMNAS ANTIGUAS

const ruinsColumns = [
    [3,2],[7,3],[12,2],[16,3],
    [4,9],[10,8],[15,9]
];

ruinsColumns.forEach(([x,y]) => {
    // Base de la columna
    ctx.fillStyle = "#777064";
    ctx.fillRect(x * tile + 4, y * tile + 23, 24, 6);

    // Cuerpo
    ctx.fillStyle = "#b3a58b";
    ctx.fillRect(x * tile + 9, y * tile + 5, 14, 19);

    // Parte superior
    ctx.fillStyle = "#d0c1a3";
    ctx.fillRect(x * tile + 5, y * tile + 2, 22, 6);

    // Grieta
    ctx.fillStyle = "#777064";
    ctx.fillRect(x * tile + 15, y * tile + 11, 2, 8);
});

// PIEDRAS DESTRUCTURADAS

const ruinsStones = [
    [5,5],[9,2],[13,6],[18,8],[7,10],[11,10]
];

ruinsStones.forEach(([x,y]) => {
    ctx.fillStyle = "#8c8373";
    ctx.fillRect(x * tile + 5, y * tile + 18, 19, 9);

    ctx.fillStyle = "#b6aa94";
    ctx.fillRect(x * tile + 8, y * tile + 15, 12, 6);
});

// MUSGO ANTIGUO

const mossSpots = [
    [3,3],[7,4],[12,4],[16,4],
    [5,9],[10,9],[15,10]
];

mossSpots.forEach(([x,y]) => {
    ctx.fillStyle = "#557c45";
    ctx.fillRect(x * tile + 5, y * tile + 25, 12, 4);
});
        drawChest(chests.ruins);
        drawGate(zones.ruins.gate.x, zones.ruins.gate.y);

        if (skeletonKing.alive) {
            drawCharacter(
                skeletonKing.x,
                skeletonKing.y,
                "skeletonKing"
            );
        }
    }
}
// ================================================
// DIBUJAR TODO
// ================================================

function draw() {
    drawGround();
    drawSkeletonAura();
    drawGuardianAura();
    drawMapObjects();
    drawAttackEffect();
    drawDamageText();

    if (map === "village") {
        drawSmoke();
    }

    drawCrystalGlow();
    drawBossTorches();

    drawCharacter(player.x, player.y, "hero");

    updateHUD();
    updateInventory();
}
function drawBossTorches() {
    const time = performance.now() / 1000;

    let torches = [];

    // Cueva del Murciélago
    if (map === "cave") {
        torches = [
            [3, 2],
            [16, 2],
            [3, 9],
            [16, 9]
        ];
    }

    // Montaña del Guardián
    if (map === "mountain") {
        torches = [
            [3, 2],
            [16, 2],
            [3, 9],
            [16, 9]
        ];
    }

    // Ruinas del Rey Esqueleto
    if (map === "ruins") {
        torches = [
            [3, 2],
            [16, 2],
            [3, 9],
            [16, 9]
        ];
    }
    torches.forEach(([x, y], index) => {
        const tx = x * tile + 16;
        const ty = y * tile + 16;

        // Parpadeo del fuego
        const flicker = Math.sin(time * 12 + index * 2) * 3;

        // Luz exterior
        const glow = 13 + Math.sin(time * 5 + index) * 4;

        ctx.fillStyle = "rgba(255, 120, 20, 0.13)";
        ctx.beginPath();
        ctx.arc(tx, ty, glow + 10, 0, Math.PI * 2);
        ctx.fill();

        // Soporte de la antorcha
        ctx.fillStyle = "#59351f";
        ctx.fillRect(tx - 4, ty + 2, 8, 15);

        // Fuego exterior
        ctx.fillStyle = "#ff6b1a";
        ctx.beginPath();
        ctx.ellipse(
            tx,
            ty - 5 - flicker,
            8,
            12 + flicker,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Fuego interior
        ctx.fillStyle = "#ffd447";
        ctx.beginPath();
        ctx.ellipse(
            tx,
            ty - 6 - flicker,
            4,
            8,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Centro brillante
        ctx.fillStyle = "#fff3b0";
        ctx.fillRect(tx - 2, ty - 7 - flicker, 4, 5);
    });
}
function drawSkeletonAura() {
    if (map !== "ruins" || !skeletonKing.alive) {
        return;
    }

    const time = performance.now() / 1000;

    const cx = skeletonKing.x * tile + 16;
    const cy = skeletonKing.y * tile + 16;

    // Aura morada que pulsa
    const pulse = Math.sin(time * 4) * 5;
    const radius = 28 + pulse;

    ctx.fillStyle = "rgba(150, 40, 255, 0.18)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 12, 0, Math.PI * 2);
    ctx.fill();

    // Aura interior
    ctx.fillStyle = "rgba(180, 70, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Partículas mágicas
    for (let i = 0; i < 6; i++) {
        const angle = time * 2 + i * Math.PI / 3;

        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;

        ctx.fillStyle = "#d9a0ff";

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
function drawGuardianAura() {
    if (map !== "mountain" || !mountainGuardian.alive) {
        return;
    }

    const time = performance.now() / 1000;

    const cx = mountainGuardian.x * tile + 16;
    const cy = mountainGuardian.y * tile + 16;

    const pulse = Math.sin(time * 5) * 5;
    const radius = 30 + pulse;

    // Aura azul
    ctx.fillStyle = "rgba(0, 180, 255, 0.18)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 12, 0, Math.PI * 2);
    ctx.fill();

    // Luz interior
    ctx.fillStyle = "rgba(0, 220, 255, 0.20)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Partículas eléctricas
    for (let i = 0; i < 8; i++) {
        const angle = time * 2.5 + i * Math.PI / 4;

        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;

        ctx.fillStyle = "#8ffaff";

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
function drawSmoke() {
    const time = performance.now() / 1000;

    // Casas que tienen chimenea
    const chimneys = [
        { x: 2, y: 1, w: 112 },
        { x: 2, y: 7, w: 96 },
        { x: 13, y: 7, w: 108 }
    ];

    chimneys.forEach((house, index) => {
        const smokeX = house.x * tile + house.w - 17;
        const smokeY = house.y * tile - 20;

        for (let i = 0; i < 4; i++) {
            const phase = (
                (time * 0.7 + i * 0.25 + index * 0.2) % 1
            );

            const rise = phase * 32;

            const drift = Math.sin(time * 2 + i + index) * 7;

            const alpha = 1 - phase;

            const radius = 3 + phase * 5;

            ctx.beginPath();

            ctx.fillStyle = `rgba(210, 210, 220, ${alpha * 0.45})`;

            ctx.arc(
                smokeX + drift,
                smokeY - rise,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    });
}
function drawCrystalGlow() {
    const time = performance.now() / 1000;

    // Cristales de la cueva
    if (map === "cave") {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {

                if ((x * 7 + y * 11) % 17 === 0) {

                    const pulse = (Math.sin(time * 3 + x + y) + 1) / 2;

                    const cx = x * tile + 16;
                    const cy = y * tile + 16;

                    const radius = 8 + pulse * 7;

                    ctx.beginPath();
                    ctx.fillStyle =
                        `rgba(170, 60, 255, ${0.10 + pulse * 0.20})`;

                    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.fillStyle =
                        `rgba(220, 170, 255, ${0.15 + pulse * 0.35})`;

                    ctx.arc(cx, cy, radius / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    // Gema mágica de la montaña
    if (map === "mountain" &&
        !mountainGuardian.alive &&
        !state.mountainGemGot) {

        const pulse = (Math.sin(time * 4) + 1) / 2;

        const cx = 12 * tile + 16;
        const cy = 5 * tile + 16;

        ctx.beginPath();

        ctx.fillStyle =
            `rgba(0, 255, 255, ${0.15 + pulse * 0.25})`;

        ctx.arc(cx, cy, 15 + pulse * 10, 0, Math.PI * 2);
        ctx.fill();
    }
}
// ================================================
// INTERFAZ
// ================================================
function createQuestPanel() {
    if ($("questPanel")) return;

    const panel = document.createElement("div");
    panel.id = "questPanel";

    panel.innerHTML = `
        <h3>📜 MISIÓN</h3>
        <p id="questTitle">Ayuda a la aldea</p>
        <ul id="questObjectives"></ul>
        <p id="questReward">🎁 Recompensa: 20 EXP + 20 monedas</p>
    `;

    const container = canvas.parentElement;

    container.style.position = "relative";

    panel.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 190px;
        background: rgba(25, 27, 42, 0.92);
        color: white;
        padding: 10px;
        border: 2px solid #d5b36a;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 5;
        box-sizing: border-box;
    `;

    panel.querySelector("h3").style.cssText = `
        margin: 0 0 8px 0;
        color: #f1d38b;
        font-size: 15px;
    `;

    panel.querySelector("ul").style.cssText = `
        padding-left: 18px;
        line-height: 1.7;
    `;

    panel.querySelector("#questReward").style.cssText = `
        color: #8ef0a2;
        margin-bottom: 0;
    `;

    container.appendChild(panel);
}

function updateQuestUI() {
    createQuestPanel();

    const title = $("questTitle");
    const objectives = $("questObjectives");
    const reward = $("questReward");

    if (!state.questStarted) {
        title.textContent = "Ayuda a la aldea";
        objectives.innerHTML = `
            <li>Habla con el aldeano para comenzar.</li>
        `;
        reward.textContent = "🎁 Recompensa: 20 EXP + 20 monedas";
        return;
    }

    if (state.questDone) {
        title.textContent = "¡Misión completada!";
        objectives.innerHTML = `
            <li>✅ Derrotar al Slime</li>
            <li>✅ Encontrar el cristal</li>
            <li>✅ Ayudar a la aldea</li>
        `;
        reward.textContent = "🏆 Recompensa recibida";
        return;
    }

    const slimeStatus = enemy.alive
        ? "⬜ Derrotar al Slime"
        : "✅ Derrotar al Slime";

    const crystalStatus = crystal.got
        ? "✅ Encontrar el cristal mágico"
        : "⬜ Encontrar el cristal mágico";

    title.textContent = "La ayuda de la aldea";

    objectives.innerHTML = `
        <li>${slimeStatus}</li>
        <li>${crystalStatus}</li>
    `;

    reward.textContent = "🎁 20 EXP + 20 monedas";
}
function updateHUD() {
    if ($("life")) $("life").textContent = state.hp;
    if ($("crystals")) $("crystals").textContent = state.crystals;
    if ($("level")) $("level").textContent = state.level;
    if ($("experience")) $("experience").textContent = state.xp;

    if ($("inventoryPotions")) {
        $("inventoryPotions").textContent = state.potions;
    }

    if ($("inventoryCrystals")) {
        $("inventoryCrystals").textContent = state.crystals;
    }

    if ($("message")) {
        $("message").textContent =
            `${zones[map].name} — ${message}`;
    }
}

// ================================================
// DISTANCIA
// ================================================

function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// ================================================
// BLOQUEOS
// ================================================

function blocked(x, y) {
    if (x < 1 || y < 1 || x >= cols - 1 || y >= rows - 1) {
        return true;
    }

    if (map === "forest") {
        const trees = [
            "5,2","5,3","5,4",
            "8,1","8,2","8,3",
            "3,6","4,6","5,6",
            "9,7","9,8","9,9",
            "12,3","13,3","14,3",
            "13,8","13,9",
            "17,4","17,5","17,6",
            "6,9","7,9"
        ];

        if (trees.includes(`${x},${y}`)) return true;
    }

    if (map === "village") {
        const houses = [
            [3,2],[14,2],[3,8],[14,8]
        ];

        for (const [hx, hy] of houses) {
            if (x >= hx && x < hx + 3 &&
                y >= hy && y < hy + 2) {
                return true;
            }
        }
    }

    return false;
}

// ================================================
// MOVIMIENTO
// ================================================

function move(dx, dy) {
    if (
        state.battle ||
        ($("mathChallenge") && !$("mathChallenge").hidden) ||
        ($("inventoryMenu") && !$("inventoryMenu").hidden)
    ) return;

    const nx = player.x + dx;
    const ny = player.y + dy;

    if (blocked(nx, ny)) {
        message = "Hay un obstáculo en ese camino.";
        draw();
        return;
    }

    player.x = nx;
    player.y = ny;

    // Dirección del personaje
    player.direction = dx > 0 ? "right" :
                       dx < 0 ? "left" :
                       dy > 0 ? "down" : "up";

    // Activar animación de caminar
    player.walkTime = performance.now();

    message = "Explora el lugar y busca secretos.";

    draw();
}
// ================================================
// VIAJAR ENTRE ZONAS
// ================================================

function travel() {
    const gate = zones[map].gate;

    if (distance(player, gate) > 1) {
        message = "Acércate al portal para viajar.";
        draw();
        return;
    }

    startMathChallenge("portal");
}

// ================================================
// INTERACTUAR
// ================================================

function interact() {
    if (
        state.battle ||
        ($("mathChallenge") && !$("mathChallenge").hidden) ||
        ($("inventoryMenu") && !$("inventoryMenu").hidden)
    ) return;

    // Portal
    if (distance(player, zones[map].gate) <= 1) {
        travel();
        return;
    }

    // Cofres de cada zona
const currentChest = chests[map];

if (
    currentChest &&
    !currentChest.opened &&
    distance(player, currentChest) <= 1
) {
    state.currentChestMap = map;
    startMathChallenge("chest");
    return;
}

    // Cristal
    if (map === "forest" &&
        !crystal.got &&
        distance(player, crystal) <= 1) {
        crystal.got = true;
        state.crystals++;

        message = "¡Recogiste un cristal mágico!";
        saveGame();
        draw();
        return;
    }
    // Gema mágica de la montaña
    if (
    map === "mountain" &&
    !mountainGuardian.alive &&
    distance(player, { x: 12, y: 5 }) <= 2
) {
    if (!inventory.items.includes("Gema de montaña")) {
        inventory.items.push("Gema de montaña");
    }

    state.mountainGemGot = true;
    state.lightningUnlocked = true;

    message = "¡Recogiste la Gema de montaña y desbloqueaste el RAYO MÁGICO! ⚡";

    updateInventory();
    saveGame();
    draw();

    return;
}

    // Murciélago oscuro
    if (
        map === "cave" &&
        bat.alive &&
        distance(player, bat) <= 1
    ) {
        startBattle();
        return;
    }
    // Aldeano
    if (map === "village" && distance(player, npc) <= 2) {
        if (!state.questStarted) {
            state.questStarted = true;
            message = "Aldeano: ¡Derrota al Slime y encuentra el cristal!";
        } else if (enemy.alive || !crystal.got) {
            message = "Aldeano: Aún falta derrotar al Slime o hallar el cristal.";
        } else if (!state.questDone) {
            state.questDone = true;
            gainXP(20);
            state.coins += 20;
            message = "¡Misión completada! Ganaste 20 EXP y 20 monedas.";
        } else {
            message = "Aldeano: ¡Gracias por ayudar a nuestra aldea!";
        }

        saveGame();
        draw();
        return;
    }

    message = "No hay nada con lo que interactuar cerca.";
    draw();
}

// ================================================
// DESAFÍOS MATEMÁTICOS
// ================================================

function createQuestion() {
    const type = rand(0, 2);

    let question = "";
    let answer = 0;

    // =================================
    // ALDEA: NIVEL 1
    // Operaciones combinadas y fracciones
    // =================================
    if (map === "village") {

        if (type === 0) {
            const a = rand(3, 12);
            const b = rand(2, 10);
            const c = rand(2, 8);

            question = `Calcula: ${a} + ${b} × ${c}`;
            answer = a + b * c;
        }

        if (type === 1) {
            const d = rand(2, 5);
            const n = rand(2, 10) * d;
            const numerator = rand(1, d - 1);

            question = `¿Cuánto es ${numerator}/${d} de ${n}?`;
            answer = numerator * n / d;
        }

        if (type === 2) {
            const a = rand(2, 10);
            const b = rand(2, 8);
            const c = rand(2, 6);

            question = `Resuelve: (${a} + ${b}) × ${c}`;
            answer = (a + b) * c;
        }
    }

    // =================================
    // BOSQUE: NIVEL 2
    // Potencias, raíces y porcentajes
    // =================================
    else if (map === "forest") {

        if (type === 0) {
            const a = rand(3, 12);
            const b = rand(2, 5);

            question = `Calcula: ${a}² + ${b}`;
            answer = a * a + b;
        }

        if (type === 1) {
            const a = rand(2, 12);
            question = `¿Cuál es la raíz cuadrada de ${a * a}?`;
            answer = a;
        }

        if (type === 2) {
            const percent = rand(1, 5) * 10;
            const number = rand(2, 10) * 10;

            question = `¿Cuánto es el ${percent}% de ${number}?`;
            answer = percent * number / 100;
        }
    }

    // =================================
    // CUEVA: NIVEL 3
    // Ecuaciones de primer grado
    // =================================
    else if (map === "cave") {

        if (type === 0) {
            const x = rand(3, 15);
            const a = rand(2, 8);
            const b = rand(2, 15);
            const result = a * x + b;

            question = `Resuelve: ${a}x + ${b} = ${result}`;
            answer = x;
        }

        if (type === 1) {
            const x = rand(2, 12);
            const a = rand(2, 8);
            const b = rand(2, 10);
            const result = a * (x + b);

            question = `Resuelve: ${a}(x + ${b}) = ${result}`;
            answer = x;
        }

        if (type === 2) {
            const x = rand(3, 15);
            const a = rand(2, 8);
            const b = rand(2, 15);
            const result = a * x - b;

            question = `Resuelve: ${a}x - ${b} = ${result}`;
            answer = x;
        }
    }

    // =================================
    // MONTAÑA: NIVEL 4
    // Ecuaciones de segundo grado
    // =================================
    else if (map === "mountain") {

        if (type === 0) {
            const x = rand(2, 12);
            const result = x * x;

            question = `Resuelve: x² = ${result}. ¿Cuál es la solución positiva?`;
            answer = x;
        }

        if (type === 1) {
            const x = rand(2, 10);
            const b = rand(2, 12);
            const result = x * x + b;

            question = `Si x² + ${b} = ${result}, ¿cuánto vale x²?`;
            answer = x * x;
        }

        if (type === 2) {
            const x = rand(2, 10);
            const a = rand(2, 8);
            const result = a * x * x;

            question = `Resuelve: ${a}x² = ${result}. ¿Cuál es la solución positiva?`;
            answer = x;
        }
    }

    // =================================
    // RUINAS: NIVEL 5
    // Funciones y desafíos avanzados
    // =================================
    else if (map === "ruins") {

        if (type === 0) {
            const a = rand(3, 9);
            const b = rand(5, 20);
            const x = rand(3, 12);

            question = `Si f(x) = ${a}x² + ${b}, ¿cuánto vale f(${x})?`;
            answer = a * x * x + b;
        }

        if (type === 1) {
            const a = rand(2, 8);
            const b = rand(3, 15);
            const x = rand(2, 10);
            const result = a * x + b;

            question = `Si f(x) = ${a}x + ${b}, ¿qué valor de x produce ${result}?`;
            answer = x;
        }

        if (type === 2) {
            const a = rand(2, 8);
            const b = rand(2, 10);
            const c = rand(2, 8);

            question = `Calcula: ${a}² × ${b} - ${c}`;
            answer = a * a * b - c;
        }
    }

    return { question, answer };
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startMathChallenge(purpose) {
    state.mathPurpose = purpose;
    state.selectedAnswer = null;

    const q = createQuestion();

    state.mathCorrect = q.answer;

    $("mathQuestion").textContent = q.question;

    const choices = new Set([q.answer]);

    while (choices.size < 4) {
        let wrong = q.answer + rand(-10, 10);

        if (wrong !== q.answer) {
            choices.add(wrong);
        }
    }

    const answers = Array.from(choices)
        .sort(() => Math.random() - 0.5);

    document.querySelectorAll(".math-option").forEach((button, i) => {
        button.textContent = answers[i];
        button.dataset.answer = answers[i];
        button.disabled = false;
        button.style.outline = "";
    });

    $("mathMessage").textContent =
        purpose === "portal"
            ? "¡Resuelve para viajar a otra zona!"
            : "¡Resuelve para abrir el cofre!";

    $("mathChallenge").hidden = false;
}

// Seleccionar respuesta
document.querySelectorAll(".math-option").forEach(button => {
    button.onclick = () => {
        state.selectedAnswer = Number(button.dataset.answer);

        document.querySelectorAll(".math-option").forEach(b => {
            b.style.outline = "";
        });

        button.style.outline = "3px solid #f1d38b";
    };
});

// Comprobar respuesta
$("checkMath").onclick = () => {
    if (state.selectedAnswer === null) {
        $("mathMessage").textContent = "Selecciona una respuesta primero.";
        return;
    }

    if (state.selectedAnswer !== state.mathCorrect) {
        $("mathMessage").textContent = "Incorrecto. ¡Inténtalo otra vez!";
        return;
    }

    $("mathChallenge").hidden = true;

    if (state.mathPurpose === "portal") {
        const zone = zones[map];

        map = zone.destination;
        player = { ...zone.destinationPoint };

        message = `¡Correcto! Llegaste a ${zones[map].name}.`;
    }

    if (state.mathPurpose === "chest") {
    const chestMap = state.currentChestMap || map;
    const currentChest = chests[chestMap];

    if (currentChest && !currentChest.opened) {
        currentChest.opened = true;

       const rewards = {
    village: { potions: 1, coins: 5, xp: 30 },

    forest: {
        potions: 0,
        coins: 10,
        xp: 35,
        item: "magicSword",
        itemName: "⚔️ Espada mágica"
    },

    cave: {
        potions: 1,
        coins: 15,
        xp: 40,
        item: "specialCrystal",
        itemName: "💎 Cristal especial"
    },

    mountain: {
        potions: 1,
        coins: 20,
        xp: 50,
        item: "protectiveShield",
        itemName: "🛡️ Escudo protector"
    },

    ruins: {
        potions: 2,
        coins: 30,
        xp: 70,
        item: "legendaryCrown",
        itemName: "👑 Corona legendaria"
    }
};

        const reward = rewards[chestMap];
        // Entregar objeto legendario
if (reward.item) {
    inventory.legendary[reward.item] = true;
}

        state.potions += reward.potions;
        state.coins += reward.coins;

        gainXP(reward.xp);
        updateInventory

        message = `¡Cofre abierto! Ganaste ${reward.potions} pociones, ${reward.coins} monedas y ${reward.xp} EXP.`;
    }
}


    saveGame();
    draw();
};

// ================================================
// COMBATE
// ================================================

function startBattle() {
    if (state.battle) return;

    if (map === "forest" && enemy.alive) {
        if (distance(player, enemy) <= 2) {
            state.currentEnemy = "slime";
            state.battle = true;
            $("battleMenu").hidden = false;
            $("battleMessage").textContent = "¡El Slime te enfrenta!";
        } else {
            message = "Acércate al Slime y pulsa F para luchar.";
        }
    }

    else if (map === "cave" && bat.alive) {
        if (distance(player, bat) <= 2) {
            state.currentEnemy = "bat";
            state.battle = true;
            $("battleMenu").hidden = false;
            $("battleMessage").textContent = "¡El Murciélago oscuro te enfrenta!";
        } else {
            message = "Acércate al Murciélago oscuro para luchar.";
        }
    }

    else if (map === "mountain" && mountainGuardian.alive) {
        if (distance(player, mountainGuardian) <= 2) {
            state.currentEnemy = "mountainGuardian";
            state.battle = true;
            $("battleMenu").hidden = false;
            $("battleMessage").textContent = "¡El Guardián de Piedra despierta!";
        } else {
            message = "Acércate al Guardián de Piedra para luchar.";
        }
    }

    else if (map === "ruins" && skeletonKing.alive) {
        if (distance(player, skeletonKing) <= 2) {
            state.currentEnemy = "skeletonKing";
            state.battle = true;
            $("battleMenu").hidden = false;
            $("battleMessage").textContent = "¡El Rey Esqueleto ha despertado!";
        } else {
            message = "Acércate al Rey Esqueleto para luchar.";
        }
    }

    battleUI();
    draw();
}
function battleUI() {
    let target;
    let enemyName;

    if (state.currentEnemy === "bat") {
        target = bat;
        enemyName = "Murciélago oscuro";
    } else if (state.currentEnemy === "mountainGuardian") {
        target = mountainGuardian;
        enemyName = "Guardián de Piedra";
    } else if (state.currentEnemy === "skeletonKing") {
        target = skeletonKing;
        enemyName = "Rey Esqueleto";
    } else {
        target = enemy;
        enemyName = "Slime";
    }

    $("battleStats").textContent =
        `${enemyName} HP: ${target.hp}/${target.maxHp} · Tu HP: ${state.hp}/${state.maxHp} · MP: ${state.mp}/${state.maxMp}`;

    const healthBar = $("bossHealthBar");
    const healthContainer = healthBar.parentElement;

    healthContainer.hidden =
        state.currentEnemy !== "skeletonKing" &&
        state.currentEnemy !== "mountainGuardian";

    const percentage = Math.max(
        0,
        (target.hp / target.maxHp) * 100
    );

    healthBar.style.width = percentage + "%";

    $("magicBtn").disabled = state.mp < 10;
   
    $("lightningBtn").hidden = !state.lightningUnlocked;

    $("lightningBtn").disabled = state.mp < 20;

    $("darkBtn").disabled =
        state.mp < 15 ||
        state.currentEnemy !== "skeletonKing";

    $("potionBtn").disabled =
        state.potions < 1 || state.hp === state.maxHp;
}
function enemyTurn() {
    if (!state.battle) return;

    let damage;

    if (state.currentEnemy === "skeletonKing") {
        damage = rand(12, 20);

        $("battleMessage").textContent =
            `¡El Rey Esqueleto lanzó Golpe de las Sombras! Perdiste ${damage} HP.`;

    } else if (state.currentEnemy === "mountainGuardian") {
        damage = rand(8, 14);

        $("battleMessage").textContent =
            `¡El Guardián de Piedra lanzó Terremoto! Perdiste ${damage} HP.`;

    } else if (state.currentEnemy === "bat") {
        damage = rand(6, 10);

        $("battleMessage").textContent =
            `¡El Murciélago oscuro te atacó! Perdiste ${damage} HP.`;

    } else {
        damage = rand(4, 8);

        $("battleMessage").textContent =
            `¡El Slime te golpeó! Perdiste ${damage} HP.`;
    }

    // Poder del escudo protector
let finalDamage = damage;

if (inventory.legendary.protectiveShield) {
    finalDamage = Math.floor(damage * 0.5);
}

state.hp = Math.max(0, state.hp - finalDamage);

    if (state.hp <= 0) {
        state.hp = 1;

        state.battle = false;
        $("battleMenu").hidden = true;

        message = "Te agotaste. Regresaste con 1 HP.";

        draw();
        saveGame();
        return;
    }

    battleUI();
    draw();
}

function playerAttack(damage, label) {
    if (!state.battle) return;

    let target;

    if (state.currentEnemy === "bat") {
        target = bat;
    } else if (state.currentEnemy === "mountainGuardian") {
        target = mountainGuardian;
    } else if (state.currentEnemy === "skeletonKing") {
        target = skeletonKing;
    } else {
        target = enemy;
    }
    // Poder de la espada mágica
let finalDamage = damage;

if (inventory.legendary.magicSword) {
    finalDamage = Math.floor(damage * 1.5);
}

target.hp = Math.max(0, target.hp - finalDamage);

    damageText.x = target.x;
    damageText.y = target.y;
    damageText.value = finalDamage;
    damageText.start = performance.now();
    damageText.active = true;
    attackEffect.x = target.x;
    attackEffect.y = target.y;
    attackEffect.start = performance.now();
    attackEffect.active = true;

    enemyHitEffect.start = performance.now();
    enemyHitEffect.active = true;
    $("battleMessage").textContent =
        `${label}: hiciste ${finalDamage} de daño.`;

    if (target.hp <= 0) {
        target.alive = false;
        state.battle = false;

        $("battleMenu").hidden = true;

        if (state.currentEnemy === "skeletonKing") {
            gainXP(50);
            state.coins += 50;
            

            message = "🏆 ¡VICTORIA! ¡Derrotaste al Rey Esqueleto! Ganaste 50 EXP y 50 monedas. ¡Has salvado los reinos!";
// Poder de la corona legendaria
if (inventory.legendary.legendaryCrown) {
    state.maxHp += 50;
    state.hp = state.maxHp;

    message += " 👑 ¡La Corona legendaria aumentó tu HP máximo en 50!";
}
            $("victoryScreen").hidden = false;

        } else if (state.currentEnemy === "mountainGuardian") {
            gainXP(25);
            state.coins += 20;

            message = "¡Derrotaste al Guardián de Piedra! Ganaste 25 EXP y 20 monedas. ¡El camino a las ruinas está libre!";

        } else {
            gainXP(10);
            state.coins += 5;

            if (state.currentEnemy === "bat") {
                message = "¡Derrotaste al Murciélago oscuro! Ganaste 10 EXP y 5 monedas.";
            } else {
                message = "¡Derrotaste al Slime! Ganaste 10 EXP y 5 monedas.";
            }
        }

        draw();
        saveGame();
        return;
    }

    battleUI();
    draw();

    setTimeout(enemyTurn, 450);
}
function drawAttackEffect() {
    const time = performance.now();

    if (attackEffect.active) {
        const elapsed = time - attackEffect.start;

        if (elapsed > 300) {
            attackEffect.active = false;
        } else {
            const progress = elapsed / 300;

            const x = attackEffect.x * tile + 16;
            const y = attackEffect.y * tile + 16;

            ctx.strokeStyle = "#fff36b";
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.arc(
                x,
                y,
                8 + progress * 20,
                0,
                Math.PI * 2
            );
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x - 3, y - 3, 6, 6);
        }
    }
}
function drawDamageText() {
    if (!damageText.active) return;

    const elapsed = performance.now() - damageText.start;

    if (elapsed > 900) {
        damageText.active = false;
        return;
    }

    const progress = elapsed / 900;

    const x = damageText.x * tile + 16;
    const y = damageText.y * tile + 8 - progress * 25;

    ctx.save();

    ctx.globalAlpha = 1 - progress;
    ctx.fillStyle = "#ff4545";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#351018";
    ctx.lineWidth = 3;

    ctx.strokeText("-" + damageText.value, x, y);
    ctx.fillText("-" + damageText.value, x, y);

    ctx.restore();
}

const lightningButton = document.createElement("button");

lightningButton.id = "lightningBtn";
lightningButton.textContent = "Rayo mágico ⚡";
lightningButton.hidden = true;

$("battleMenu").appendChild(lightningButton);
$("lightningBtn").onclick = () => {
    if (!state.lightningUnlocked) {
        $("battleMessage").textContent =
            "Aún no has desbloqueado el Rayo Mágico.";
        return;
    }

    if (state.mp >= 20) {
        state.mp -= 20;
        playerAttack(25, "Rayo mágico ⚡");
    } else {
        $("battleMessage").textContent =
            "No tienes suficiente MP para lanzar el rayo.";
    }
};
$("attackBtn").onclick = () => {
    playerAttack(10, "Ataque");
};

$("magicBtn").onclick = () => {
    if (state.mp >= 10) {
        state.mp -= 10;

        // Poder del cristal especial
        let magicDamage = 15;

        if (inventory.legendary.specialCrystal) {
            magicDamage = 30;
        }

        playerAttack(magicDamage, "Magia especial");
    }
};
$("darkBtn").onclick = () => {
    if (state.currentEnemy !== "skeletonKing") {
        $("battleMessage").textContent =
            "Este ataque solo funciona contra el Rey Esqueleto.";
        return;
    }

    if (state.mp >= 15) {
        state.mp -= 15;
        playerAttack(30, "Golpe oscuro 🌑");
    } else {
        $("battleMessage").textContent =
            "No tienes suficiente MP.";
    }

    battleUI();
    draw();
};

$("potionBtn").onclick = () => {
    if (state.potions > 0 && state.hp < state.maxHp) {
        state.potions--;

        const healed = Math.min(30, state.maxHp - state.hp);
        state.hp += healed;

        $("battleMessage").textContent =
            `Usaste una poción y recuperaste ${healed} HP.`;

        battleUI();
        draw();

        setTimeout(enemyTurn, 450);
    }
};

$("runBtn").onclick = () => {
    state.battle = false;
    $("battleMenu").hidden = true;

    message = "Escapaste del combate.";
    draw();
};

// ================================================
// EXPERIENCIA Y NIVELES
// ================================================

function gainXP(amount) {
    state.xp += amount;

    while (state.xp >= state.xpNext) {
        state.xp -= state.xpNext;

        state.level++;

        state.maxHp += 20;
        state.maxMp += 5;

        state.hp = state.maxHp;
        state.mp = state.maxMp;

        state.xpNext += 20;

        message = `¡Subiste al nivel ${state.level}!`;
    }
}

// ================================================
// INVENTARIO
// ================================================

function openInventory() {
    if (
        state.battle ||
        ($("mathChallenge") && !$("mathChallenge").hidden)
    ) return;

    $("inventoryMenu").hidden = false;

    $("inventoryPotions").textContent = state.potions;
    $("inventoryCrystals").textContent = state.crystals;

    const list = $("inventoryItems");
    list.innerHTML = "";

    const items = [
        `Pociones: ${state.potions}`,
        `Cristales mágicos: ${state.crystals}`,
        `Monedas: ${state.coins}`,
        `Nivel: ${state.level}`,
        `Experiencia: ${state.xp}/${state.xpNext}`
    ];

    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

$("closeInventory").onclick = () => {
    $("inventoryMenu").hidden = true;
};

// ================================================
// CONTROLES
// ================================================

window.addEventListener("keydown", function(e) {
    const key = e.key.toLowerCase();

    if (key.startsWith("arrow")) {
        e.preventDefault();
    }

    if (
        ($("mathChallenge") && !$("mathChallenge").hidden) ||
        ($("inventoryMenu") && !$("inventoryMenu").hidden)
    ) {
        if (key === "escape") {
            $("mathChallenge").hidden = true;
            $("inventoryMenu").hidden = true;
            draw();
        }

        return;
    }

    if (state.battle) return;

    if (key === "w" || key === "arrowup") {
        move(0, -1);
    }

    if (key === "s" || key === "arrowdown") {
        move(0, 1);
    }

    if (key === "a" || key === "arrowleft") {
        move(-1, 0);
    }

    if (key === "d" || key === "arrowright") {
        move(1, 0);
    }

    if (key === "e") {
        interact();
    }

    if (key === "f") {
        startBattle();
    }

    if (key === "i") {
        openInventory();
    }
});
// CONTROLES TACTILES DE REINOS DE AIT

function mobileMove(x, y) {
    if (state.battle) return;

    if (
        ($("mathChallenge") && !$("mathChallenge").hidden) ||
        ($("inventoryMenu") && !$("inventoryMenu").hidden)
    ) {
        return;
    }

    move(x, y);
}

function mobileAction(action) {
    if (
        ($("mathChallenge") && !$("mathChallenge").hidden) ||
        ($("inventoryMenu") && !$("inventoryMenu").hidden)
    ) {
        return;
    }

    if (state.battle) return;

    if (action === "interact") interact();
    if (action === "battle") startBattle();
    if (action === "inventory") openInventory();
}

function connectMobileButton(id, callback) {
    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("pointerdown", function(e) {
        e.preventDefault();
        callback();
    });
}

connectMobileButton("btnUp", () => mobileMove(0, -1));
connectMobileButton("btnDown", () => mobileMove(0, 1));
connectMobileButton("btnLeft", () => mobileMove(-1, 0));
connectMobileButton("btnRight", () => mobileMove(1, 0));

connectMobileButton("btnInteract", () => mobileAction("interact"));
connectMobileButton("btnBattle", () => mobileAction("battle"));
connectMobileButton("btnInventory", () => mobileAction("inventory"));

// ================================================
// INICIAR
// ================================================

loadGame();
const startNew = sessionStorage.getItem("reinosDeAitStartNew") === "true";

if (startNew) {
    sessionStorage.removeItem("reinosDeAitStartNew");

    document.getElementById("mainMenu").hidden = true;
    document.getElementById("gameScreen").hidden = false;

} else {
    document.getElementById("mainMenu").hidden = false;
    document.getElementById("gameScreen").hidden = true;
}

function animateGame() {
    draw();
    requestAnimationFrame(animateGame);
}

requestAnimationFrame(animateGame);