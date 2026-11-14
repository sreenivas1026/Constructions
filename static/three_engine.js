/**
 * SLTG BUILDERS — 3D ARCHITECTURAL INTERIOR & EXTERIOR FLYTHROUGH ENGINE
 * Deep Procedural Rooms: Facade, Grand Entrance, Living Hall, Modular Kitchen & Dining,
 * Floating Staircase, Master Suite, and Sunset Balcony.
 * Scroll-Driven Smooth Camera Flight + Interactive Free Look & Room Jumps.
 */

(function () {
  'use strict';


  // =========================================================================
  // SECOND 3D MODEL: G+1 133 SQ YARDS RCC STRUCTURAL CORE ENGINE
  // =========================================================================
  function initStructuralCoreEngine() {
    const container = document.getElementById('threeStructureCanvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const isNight = document.body.classList.contains('theme-black-night');
    const bg = isNight ? 0x090b10 : 0xf2f4f8;
    scene.background = new THREE.Color(bg);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(12, 9, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.target.set(0, 3.2, 0);
      controls.maxPolarAngle = Math.PI / 2 - 0.02;
    }

    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffeedd, 1.4);
    dir.position.set(14, 18, 12);
    scene.add(dir);

    const structGroup = new THREE.Group();
    scene.add(structGroup);

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x9da3ae, roughness: 0.85 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.85, roughness: 0.3 });
    const gridHelper = new THREE.GridHelper(26, 26, 0xc5a059, 0x334155);
    scene.add(gridHelper);

    // 12 Footing Pads & Columns for 133 SQ Yards G+1 Grid
    const colCoords = [
      [-4.0, -3.0], [-1.3, -3.0], [1.3, -3.0], [4.0, -3.0],
      [-4.0, 0.0], [-1.3, 0.0], [1.3, 0.0], [4.0, 0.0],
      [-4.0, 3.0], [-1.3, 3.0], [1.3, 3.0], [4.0, 3.0]
    ];

    colCoords.forEach(([x, z]) => {
      // Footing Pad
      const pad = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 1.2), concreteMat);
      pad.position.set(x, 0.18, z);
      structGroup.add(pad);

      // Ground Floor Column
      const colG = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.0, 0.35), concreteMat);
      colG.position.set(x, 1.85, z);
      structGroup.add(colG);

      // First Floor Column
      const colF = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.0, 0.35), concreteMat);
      colF.position.set(x, 5.0, z);
      structGroup.add(colF);

      // Fe550D Internal Rebar Core
      const rebar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 6.4, 8), steelMat);
      rebar.position.set(x, 3.4, z);
      structGroup.add(rebar);
    });

    // Plinth Beam Level
    const plinthG = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.3, 6.6), concreteMat);
    plinthG.position.set(0, 0.45, 0);
    structGroup.add(plinthG);

    // First Floor Cantilevered Slab (133 SQ Yards)
    const slab1 = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.25, 7.2), concreteMat);
    slab1.position.set(0, 3.45, 0);
    structGroup.add(slab1);

    // Terrace Roof Slab
    const slabRoof = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.25, 7.2), concreteMat);
    slabRoof.position.set(0, 6.6, 0);
    structGroup.add(slabRoof);

    // Cantilevered Balcony Slab
    const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 1.8), concreteMat);
    balcSlab.position.set(-2.0, 3.45, 4.2);
    structGroup.add(balcSlab);

    let isWire = false;
    window.toggleStructureWireframe = function () {
      isWire = !isWire;
      concreteMat.wireframe = isWire;
      const btn = document.getElementById('btnToggleStructWire');
      if (btn) btn.classList.toggle('active', isWire);
    };

    
    // =========================================================================
    // CONTINUOUS 3D SCROLL-DRIVEN CAMERA SPLINE PATH (NO BUTTON CLICK NEEDED)
    // =========================================================================
    const camSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(12.5, 7.5, 14.5),  // 0.00: Grand Facade
      new THREE.Vector3(3.2, 2.3, 5.2),    // 0.18: Entrance Foyer (Teak door swings open)
      new THREE.Vector3(-1.0, 2.4, 3.2),   // 0.38: Double-Height Living Atrium
      new THREE.Vector3(1.8, 2.3, 0.8),    // 0.58: Chef's Modular Island Kitchen & Dining
      new THREE.Vector3(1.2, 4.5, 2.8),    // 0.75: Master Bedroom Suite
      new THREE.Vector3(-1.8, 4.6, 4.2),   // 0.88: Sunset Balcony Terrace
      new THREE.Vector3(-5.5, 3.2, 6.8)    // 1.00: Swimming Pool & Covered Parking Bay
    ]);

    const targetSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.2, 0),        // Facade center
      new THREE.Vector3(2.0, 1.8, 2.0),    // Entrance pivot
      new THREE.Vector3(-2.6, 1.8, 0.8),   // Living hall center
      new THREE.Vector3(2.6, 1.8, -2.4),   // Kitchen island
      new THREE.Vector3(2.2, 4.2, 0.8),    // Master bed platform
      new THREE.Vector3(-2.8, 3.8, 2.0),   // Balcony glass
      new THREE.Vector3(-1.5, 0.8, 1.8)    // Pool & parking
    ]);

    let scrollProgressDamped = 0;
    let targetScrollProgress = 0;

    // Track scroll continuously
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress = totalScroll > 0 ? Math.min(Math.max(scrollY / totalScroll, 0), 1) : 0;
    }, { passive: true });

function animate() {
      requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function initWhenReady() {
    if (typeof THREE === 'undefined') {
      setTimeout(initWhenReady, 50);
      return;
    }
    initArchitecturalExperience();
  }

  function initArchitecturalExperience() {
    const container = document.getElementById('threeViewport');
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const isInitNight = document.body.classList.contains('theme-black-night');
    const initBgHex = isInitNight ? 0x080a0f : 0xf2f5f8;
    scene.background = new THREE.Color(initBgHex);
    scene.fog = new THREE.Fog(initBgHex, 35, 75);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Orbit Controls (Interactive Look-Around) ---
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxPolarAngle = Math.PI / 2 - 0.02;
      controls.enableZoom = false; // NEVER trap mousewheel so page scrolling is 100% free & silky smooth
      controls.autoRotate = false;
    }

    // --- Lighting Rig ---
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    sunLight.position.set(16, 20, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -12;
    sunLight.shadow.camera.right = 12;
    sunLight.shadow.camera.top = 12;
    sunLight.shadow.camera.bottom = -12;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x7799bb, 0.4);
    fillLight.position.set(-14, 12, -10);
    scene.add(fillLight);

    // Room Point Lights (Warm Architectural Ambiance)
    const lights = {
      entrance: new THREE.PointLight(0xffb866, 1.4, 6),
      living: new THREE.PointLight(0xffcaa0, 2.2, 9),
      kitchen: new THREE.PointLight(0xffffff, 1.8, 7),
      dining: new THREE.PointLight(0xffc077, 1.6, 6),
      stairs: new THREE.PointLight(0xffb866, 1.5, 7),
      master: new THREE.PointLight(0xffc588, 2.0, 8),
      balcony: new THREE.PointLight(0xffaa55, 1.2, 5)
    };

    lights.entrance.position.set(2.4, 2.2, 3.2);
    lights.living.position.set(-1.8, 2.4, 1.2);
    lights.kitchen.position.set(2.6, 2.3, -2.4);
    lights.dining.position.set(0.6, 2.2, -1.0);
    lights.stairs.position.set(-2.0, 3.0, -1.5);
    lights.master.position.set(1.8, 4.8, 1.2);
    lights.balcony.position.set(-2.4, 4.4, 3.6);

    Object.values(lights).forEach(l => scene.add(l));

    // --- Material Library ---
    const mats = {
      plinth: new THREE.MeshStandardMaterial({ color: 0x1b1f28, roughness: 0.8 }),
      stoneLight: new THREE.MeshStandardMaterial({ color: 0xe2ded4, roughness: 0.55 }),
      stoneDark: new THREE.MeshStandardMaterial({ color: 0x222632, roughness: 0.7 }),
      woodTeak: new THREE.MeshStandardMaterial({ color: 0x7c431d, roughness: 0.4 }),
      woodFloor: new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.5 }),
      bronzeGold: new THREE.MeshStandardMaterial({ color: 0xc5a059, roughness: 0.35, metalness: 0.8 }),
      blackSteel: new THREE.MeshStandardMaterial({ color: 0x14161b, roughness: 0.4, metalness: 0.6 }),
      sofaFabric: new THREE.MeshStandardMaterial({ color: 0x2d3442, roughness: 0.85 }),
      sofaCushion: new THREE.MeshStandardMaterial({ color: 0xc5a059, roughness: 0.8 }),
      marbleWhite: new THREE.MeshStandardMaterial({ color: 0xf5f5f7, roughness: 0.2, metalness: 0.1 }),
      counterDark: new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.3, metalness: 0.2 }),
      bedFabric: new THREE.MeshStandardMaterial({ color: 0xd8d4cb, roughness: 0.9 }),
      bedAccent: new THREE.MeshStandardMaterial({ color: 0x8a5530, roughness: 0.8 }),
      mirror: new THREE.MeshStandardMaterial({ color: 0xeeeeff, roughness: 0.05, metalness: 0.95 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x99ddff,
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.75,
        transparent: true,
        opacity: 0.35,
        reflectivity: 0.9
      }),
      water: new THREE.MeshStandardMaterial({ color: 0x154050, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.85 })
    };

    // --- Master Building Group ---
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // Coordinate Grid Helper
    const grid = new THREE.GridHelper(36, 36, 0xc5a059, 0x1f2330);
    grid.position.y = -0.01;
    scene.add(grid);

    // Site Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.4, 9.6), mats.plinth);
    plinth.position.y = 0.2;
    plinth.receiveShadow = true;
    houseGroup.add(plinth);

    // Lush Perimeter Landscape Planters & Hedges
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x27442b, roughness: 0.9 });
    for (let p = -5.6; p <= 5.0; p += 1.8) {
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.4), foliageMat);
      hedge.position.set(p, 0.55, 4.6);
      hedge.castShadow = true;
      houseGroup.add(hedge);
    }

    // Outer Structural Concrete Perimeter Walls (North & West)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(11.2, 5.8, 0.25), mats.stoneLight);
    backWall.position.set(0, 3.1, -4.0);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    houseGroup.add(backWall);

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5.8, 8.0), mats.stoneLight);
    westWall.position.set(-5.6, 3.1, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    houseGroup.add(westWall);

    // Ground Floor Italian Marble Flooring (Polished Statuario)
    const gfFloor = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.12, 7.8), mats.marbleWhite);
    gfFloor.position.set(0, 0.46, 0);
    gfFloor.receiveShadow = true;
    houseGroup.add(gfFloor);

    // =========================================================================
    // ROOM 1: GRAND ENTRANCE & EAST PORTICO
    // =========================================================================
    // Entrance Feature Wall (Textured Dark Granite Pillar)
    const porticoWall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.7, 0.25), mats.stoneDark);
    porticoWall.position.set(4.0, 1.75, 3.4);
    porticoWall.castShadow = true;
    houseGroup.add(porticoWall);

    // Entrance Floating Granite Steps
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.4 - i * 0.2, 0.12, 0.9), mats.stoneLight);
      step.position.set(1.4, 0.2 + i * 0.1, 4.0 + i * 0.45);
      step.receiveShadow = true;
      step.castShadow = true;
      houseGroup.add(step);
    }

    // Teak Wood Pivot Door with Dynamic Swing
    const doorPivot = new THREE.Group();
    doorPivot.position.set(1.4, 1.7, 3.4);
    houseGroup.add(doorPivot);

    const entranceDoor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 0.1), mats.woodTeak);
    entranceDoor.position.set(0.75, 0, 0);
    entranceDoor.castShadow = true;
    doorPivot.add(entranceDoor);

    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 16), mats.bronzeGold);
    doorHandle.position.set(1.35, 0, 0.08);
    doorPivot.add(doorHandle);

    // Welcoming Foyer Wall Sconce
    const sconceLight = new THREE.PointLight(0xffb866, 2.0, 5.0);
    sconceLight.position.set(3.2, 2.2, 3.5);
    scene.add(sconceLight);

    // =========================================================================
    // ROOM 2: DOUBLE-HEIGHT LIVING HALL ATRIUM (100% OPEN CUTAWAY ARCHITECTURE)
    // =========================================================================
    // Front Glass Curtain Wall with Steel Mullions (Transparent Cutaway)
    const livingGlass = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.6, 0.06), mats.glass);
    livingGlass.position.set(-2.4, 1.7, 3.4);
    houseGroup.add(livingGlass);

    for (let x = -4.8; x <= 0.0; x += 1.4) {
      const mul = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.6, 0.08), mats.blackSteel);
      mul.position.set(x, 1.7, 3.4);
      houseGroup.add(mul);
    }

    // Modern Charcoal Sectional L-Sofa
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.45, 0.95), mats.sofaFabric);
    sofaMain.position.set(-2.5, 0.68, 1.2);
    sofaMain.castShadow = true;
    houseGroup.add(sofaMain);

    const sofaReturn = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 1.8), mats.sofaFabric);
    sofaReturn.position.set(-3.4, 0.68, 2.0);
    sofaReturn.castShadow = true;
    houseGroup.add(sofaReturn);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.42, 0.2), mats.sofaFabric);
    sofaBack.position.set(-2.5, 0.98, 0.75);
    houseGroup.add(sofaBack);

    // Velvet Gold Accent Cushions
    for (let c of [-1.8, -2.6, -3.2]) {
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.12), mats.sofaCushion);
      cushion.position.set(c, 0.90, 0.95);
      houseGroup.add(cushion);
    }

    // Polished Italian Marble Coffee Table
    const coffeeTable = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.32, 32), mats.marbleWhite);
    coffeeTable.position.set(-1.8, 0.58, 2.1);
    coffeeTable.castShadow = true;
    houseGroup.add(coffeeTable);

    // Wall-Mounted OLED Television Screen & Fluted Teak Console
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 2.2), mats.blackSteel);
    tvScreen.position.set(-5.45, 1.85, 1.5);
    houseGroup.add(tvScreen);

    const tvConsole = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 2.6), mats.woodTeak);
    tvConsole.position.set(-5.2, 0.62, 1.5);
    tvConsole.castShadow = true;
    houseGroup.add(tvConsole);

    // Modern Arc Floor Lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0, 16), mats.blackSteel);
    lampStem.position.set(-4.5, 1.4, 0.8);
    houseGroup.add(lampStem);

    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 0.35, 24), mats.bronzeGold);
    lampShade.position.set(-4.5, 2.2, 0.8);
    houseGroup.add(lampShade);

    // Warm Living Room Atrium Chandelier Light
    const livingAtriumLight = new THREE.PointLight(0xffd5a0, 2.6, 9.0);
    livingAtriumLight.position.set(-2.4, 2.8, 1.6);
    scene.add(livingAtriumLight);

    // =========================================================================
    // ROOM 3: CHEF'S MODULAR KITCHEN & DINING ATRIUM
    // =========================================================================
    // Calacatta Quartz Waterfall Island Counter
    const island = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.86, 2.4), mats.counterDark);
    island.position.set(2.4, 0.88, -1.6);
    island.castShadow = true;
    houseGroup.add(island);

    const islandTop = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.08, 2.46), mats.marbleWhite);
    islandTop.position.set(2.4, 1.34, -1.6);
    islandTop.castShadow = true;
    houseGroup.add(islandTop);

    // Contemporary Bar Stools
    for (let s = -0.6; s <= 0.6; s += 0.8) {
      const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), mats.woodTeak);
      stoolSeat.position.set(1.4, 0.74, -1.6 + s);
      houseGroup.add(stoolSeat);

      const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.72, 16), mats.blackSteel);
      stoolLeg.position.set(1.4, 0.37, -1.6 + s);
      houseGroup.add(stoolLeg);
    }

    // Rear Soft-Close Teak Cabinetry
    const rearCabinets = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.88, 0.65), mats.woodTeak);
    rearCabinets.position.set(2.6, 0.88, -3.6);
    rearCabinets.castShadow = true;
    houseGroup.add(rearCabinets);

    const topCabinets = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.72, 0.4), mats.stoneLight);
    topCabinets.position.set(2.6, 2.3, -3.65);
    houseGroup.add(topCabinets);

    // Warm Under-Counter Kitchen Strip Light
    const kitchenGlow = new THREE.PointLight(0xfff0dd, 2.2, 7.0);
    kitchenGlow.position.set(2.4, 1.8, -1.8);
    scene.add(kitchenGlow);

    // Solid Teak Family Dining Table & Modern Chairs
    const diningTable = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.76, 2.0), mats.woodTeak);
    diningTable.position.set(0.1, 0.82, -1.4);
    diningTable.castShadow = true;
    houseGroup.add(diningTable);

    for (let c of [-0.6, 0.6]) {
      const chairL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.76, 0.42), mats.sofaFabric);
      chairL.position.set(-0.6, 0.62, -1.4 + c);
      houseGroup.add(chairL);

      const chairR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.76, 0.42), mats.sofaFabric);
      chairR.position.set(0.8, 0.62, -1.4 + c);
      houseGroup.add(chairR);
    }

    // Cylindrical Brushed Bronze Chandelier
    const diningChandelier = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.16, 24), mats.bronzeGold);
    diningChandelier.position.set(0.1, 2.35, -1.4);
    houseGroup.add(diningChandelier);

    // =========================================================================
    // ROOM 4: CANTILEVERED ARCHITECTURAL STAIRCASE
    // =========================================================================
    for (let st = 0; st < 11; st++) {
      const tread = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 0.32), mats.woodTeak);
      tread.position.set(-2.2, 0.48 + st * 0.25, -2.0 - st * 0.16);
      tread.castShadow = true;
      houseGroup.add(tread);
    }

    // Frameless Glass Balustrade on Stairway
    const stairGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.25, 2.6), mats.glass);
    stairGlass.position.set(-1.6, 1.85, -2.7);
    stairGlass.rotation.x = -0.42;
    houseGroup.add(stairGlass);

    // =========================================================================
    // ROOM 5: FIRST-FLOOR MASTER BEDROOM SUITE (TRUE CUTAWAY SHOWCASE)
    // =========================================================================
    // Intermediate Floor Slab (Covers EAST HALF ONLY - leaving Living Hall Double-Height Atrium Open!)
    const interSlab = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.28, 7.6), mats.stoneDark);
    interSlab.position.set(2.5, 3.25, 0.0);
    interSlab.castShadow = true;
    interSlab.receiveShadow = true;
    houseGroup.add(interSlab);

    // Master Bedroom Teak Parquet Floor
    const masterFloor = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.06, 5.2), mats.woodFloor);
    masterFloor.position.set(2.4, 3.42, 1.0);
    masterFloor.receiveShadow = true;
    houseGroup.add(masterFloor);

    // Master Bedroom Walls: Perimeter ONLY, Front is OPEN CUTAWAY for 100% visibility!
    // North wall
    const masterNorthWall = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.5, 0.2), mats.stoneLight);
    masterNorthWall.position.set(2.4, 4.65, -1.6);
    masterNorthWall.castShadow = true;
    houseGroup.add(masterNorthWall);

    // East wall with panoramic floor-to-ceiling window
    const masterEastWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 5.2), mats.stoneLight);
    masterEastWall.position.set(5.1, 4.65, 1.0);
    masterEastWall.castShadow = true;
    houseGroup.add(masterEastWall);

    const masterWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.0, 3.2), mats.glass);
    masterWindow.position.set(5.1, 4.65, 1.0);
    houseGroup.add(masterWindow);

    // West partition wall (separating corridor)
    const masterWestWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 2.4), mats.stoneLight);
    masterWestWall.position.set(-0.3, 4.65, -0.4);
    masterWestWall.castShadow = true;
    houseGroup.add(masterWestWall);

    // South Front: Open Cutaway with Frameless Glass Balustrade (CRYSTAL CLEAR VIEW INTO BEDROOM)
    const masterFrontRail = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.85, 0.06), mats.glass);
    masterFrontRail.position.set(2.4, 3.85, 3.6);
    houseGroup.add(masterFrontRail);

    // King-Size Designer Teak Platform Bed
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.38, 2.3), mats.woodTeak);
    bedBase.position.set(2.3, 3.60, 1.0);
    bedBase.castShadow = true;
    houseGroup.add(bedBase);

    const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.32, 2.1), mats.bedFabric);
    bedMattress.position.set(2.3, 3.90, 1.0);
    houseGroup.add(bedMattress);

    const bedHeadboard = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.25, 0.16), mats.bedAccent);
    bedHeadboard.position.set(2.3, 4.35, -0.05);
    houseGroup.add(bedHeadboard);

    // Folded Duvet Accent
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 1.1), mats.bronzeGold);
    duvet.position.set(2.3, 4.08, 1.4);
    houseGroup.add(duvet);

    // Floating Bedside Tables with Glowing Bronze Lamps
    for (let side of [-1, 1]) {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.42), mats.woodTeak);
      stand.position.set(2.3 + side * 1.45, 3.60, 0.2);
      houseGroup.add(stand);

      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.28, 16), mats.bronzeGold);
      lamp.position.set(2.3 + side * 1.45, 3.92, 0.2);
      houseGroup.add(lamp);

      const nightLight = new THREE.PointLight(0xffcc88, 1.2, 3.5);
      nightLight.position.set(2.3 + side * 1.45, 4.1, 0.2);
      scene.add(nightLight);
    }

    // Master Dressing Walk-in Wardrobe (Bronze Framed Glass)
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.3, 0.6), mats.stoneDark);
    wardrobe.position.set(4.4, 4.55, 1.8);
    houseGroup.add(wardrobe);

    // Architectural Bronze Facade Louvers (Brise-Soleil)
    for (let l = 0; l < 8; l++) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.4, 0.16), mats.bronzeGold);
      louver.position.set(4.9, 4.6, -0.2 + l * 0.4);
      louver.rotation.y = 0.3;
      louver.castShadow = true;
      houseGroup.add(louver);
    }

    // Warm Master Suite Overhead Ceiling Glow
    const masterCeilingGlow = new THREE.PointLight(0xffcaa0, 2.4, 7.5);
    masterCeilingGlow.position.set(2.3, 5.2, 1.2);
    scene.add(masterCeilingGlow);

    // =========================================================================
    // ROOM 6: SUNSET BALCONY TERRACE
    // =========================================================================
    // Cantilevered Terrace Slab (West First Floor)
    const terraceSlab = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.25, 3.6), mats.stoneDark);
    terraceSlab.position.set(-2.8, 3.25, 2.0);
    terraceSlab.castShadow = true;
    houseGroup.add(terraceSlab);

    // Frameless Glass Balustrade
    const balconyGlassFront = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.05, 0.05), mats.glass);
    balconyGlassFront.position.set(-2.8, 3.88, 3.75);
    houseGroup.add(balconyGlassFront);

    const balconyGlassSide = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.05, 3.4), mats.glass);
    balconyGlassSide.position.set(-5.35, 3.88, 2.0);
    houseGroup.add(balconyGlassSide);

    // Minimalist Outdoor Lounge Chairs
    const chairA = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.52, 0.72), mats.sofaFabric);
    chairA.position.set(-2.2, 3.65, 2.6);
    houseGroup.add(chairA);

    const chairB = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.52, 0.72), mats.sofaFabric);
    chairB.position.set(-3.6, 3.65, 2.6);
    houseGroup.add(chairB);

    // Modern Open Architectural Roof Pergola (Slender Louvers - No Solid Ceiling Blocking Rooms!)
    const pergolaGroup = new THREE.Group();
    pergolaGroup.position.set(0, 5.9, 0);
    houseGroup.add(pergolaGroup);

    // Main Perimeter Bronze Frame
    const frameNorth = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.18, 0.25), mats.bronzeGold);
    frameNorth.position.set(0, 0, -3.9);
    pergolaGroup.add(frameNorth);

    const frameSouth = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.18, 0.25), mats.bronzeGold);
    frameSouth.position.set(0, 0, 3.7);
    pergolaGroup.add(frameSouth);

    // Spaced Floating Architectural Pergola Louvers (Airy & Open)
    for (let rx = -5.2; rx <= 5.2; rx += 1.3) {
      const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 7.6), mats.blackSteel);
      rafter.position.set(rx, 0, -0.1);
      pergolaGroup.add(rafter);
    }

    // =========================================================================
    // ROOM 7: COVERED PARKING BAY & ILLUMINATED SWIMMING POOL
    // =========================================================================
    // Covered Parking Bay Pergola Canopy
    const parkingRoof = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 4.8), mats.stoneDark);
    parkingRoof.position.set(4.6, 2.85, 1.0);
    parkingRoof.castShadow = true;
    houseGroup.add(parkingRoof);

    for (let z of [-1.0, 3.0]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 0.18), mats.blackSteel);
      col.position.set(6.4, 1.4, z);
      col.castShadow = true;
      houseGroup.add(col);
    }

    // Vehicle Silhouette in Parking Bay
    const carBase = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.65, 3.8), mats.blackSteel);
    carBase.position.set(4.8, 0.68, 1.0);
    carBase.castShadow = true;
    houseGroup.add(carBase);

    const carCabin = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.52, 2.0), mats.glass);
    carCabin.position.set(4.8, 1.18, 0.8);
    houseGroup.add(carCabin);

    // Luxury Swimming Pool with Turquoise Glowing Water
    const poolSurround = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.08, 3.4), mats.stoneLight);
    poolSurround.position.set(-3.2, 0.38, 2.8);
    houseGroup.add(poolSurround);

    const poolWater = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 2.8), mats.water);
    poolWater.position.set(-3.2, 0.42, 2.8);
    houseGroup.add(poolWater);

    const poolLight = new THREE.PointLight(0x00e5ff, 3.0, 6.5);
    poolLight.position.set(-3.2, 0.65, 2.8);
    scene.add(poolLight);

    // =========================================================================
    // SCROLL-DRIVEN CAMERA PATH & PRECISE ROOM WAYPOINTS (NO BUTTON CLICKS NEEDED)
    // =========================================================================
    const waypoints = [
      {
        id: 'room-facade',
        name: '01 / Contemporary Architectural Facade',
        desc: 'G+1 133 SQ YD Duplex &middot; Italian stone elevation, Vaastu aligned entrance, landscaped plinth and pool.',
        cam: new THREE.Vector3(11.5, 7.0, 13.5),
        target: new THREE.Vector3(0, 2.2, 0)
      },
      {
        id: 'room-entrance',
        name: '02 / Grand Teak Entrance Foyer',
        desc: 'Solid teak wood pivot door automatically swings open as you step inside the reception foyer.',
        cam: new THREE.Vector3(3.4, 2.1, 5.0),
        target: new THREE.Vector3(1.4, 1.7, 2.8)
      },
      {
        id: 'room-living',
        name: '03 / Double-Height Living Hall Atrium',
        desc: 'Polished Italian Statuario marble floors, charcoal L-sectional sofa, marble coffee table, and OLED wall.',
        cam: new THREE.Vector3(-0.4, 2.0, 3.4),
        target: new THREE.Vector3(-2.6, 1.4, 1.4)
      },
      {
        id: 'room-kitchen',
        name: '04 / Calacatta Quartz Modular Kitchen & Dining',
        desc: 'Waterfall quartz island, contemporary barstools, warm under-cabinet LED glow, and teak dining atrium.',
        cam: new THREE.Vector3(1.3, 2.1, 0.8),
        target: new THREE.Vector3(2.4, 1.3, -1.8)
      },
      {
        id: 'room-master',
        name: '05 / First-Floor Master Bedroom Suite',
        desc: 'Plush upholstered king platform bed, floating bedside tables, reading lamps, and walk-in dressing wardrobe.',
        cam: new THREE.Vector3(0.5, 4.8, 3.2),
        target: new THREE.Vector3(2.4, 4.2, 1.0)
      },
      {
        id: 'room-balcony',
        name: '06 / Sunset Balcony & Timber Terrace',
        desc: 'Cantilevered private terrace with frameless glass balustrade and minimalist outdoor lounge armchairs.',
        cam: new THREE.Vector3(-1.4, 4.7, 4.6),
        target: new THREE.Vector3(-2.8, 3.8, 2.2)
      },
      {
        id: 'room-pool',
        name: '07 / Illuminated Swimming Pool & Car Portico',
        desc: 'Ground plinth turquoise swimming pool with underwater glow and covered architectural parking bay.',
        cam: new THREE.Vector3(-4.4, 3.2, 7.2),
        target: new THREE.Vector3(-1.0, 0.8, 2.2)
      }
    ];

    let currentWaypointIdx = 0;
    let isUserControlling = false;

    // Set Initial Camera Position
    camera.position.copy(waypoints[0].cam);
    if (controls) controls.target.copy(waypoints[0].target);

    // Update Room HUD Banner dynamically
    const hudRoomBadge = document.getElementById('threeRoomBadge');
    const hudRoomDesc = document.getElementById('threeRoomDesc');

    function setRoomHUD(wp) {
      if (hudRoomBadge) hudRoomBadge.textContent = wp.name;
      if (hudRoomDesc) hudRoomDesc.textContent = wp.desc;

      document.querySelectorAll('.room-nav-pill, .drawer-room-btn').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.room === wp.id || pill.textContent.includes(wp.name.slice(0, 2)));
      });
    }
    setRoomHUD(waypoints[0]);

    // Optional Quick Jump (Button clicks still supported for convenience!)
    window.flyToRoom = function (idx) {
      if (idx < 0 || idx >= waypoints.length) return;
      currentWaypointIdx = idx;
      const wp = waypoints[idx];
      setRoomHUD(wp);

      if (typeof gsap !== 'undefined') {
        gsap.to(camera.position, {
          x: wp.cam.x,
          y: wp.cam.y,
          z: wp.cam.z,
          duration: 1.4,
          ease: 'power2.inOut'
        });
        if (controls) {
          gsap.to(controls.target, {
            x: wp.target.x,
            y: wp.target.y,
            z: wp.target.z,
            duration: 1.4,
            ease: 'power2.inOut'
          });
        }
      } else {
        camera.position.copy(wp.cam);
        if (controls) controls.target.copy(wp.target);
      }
    };

    // Track user drag on OrbitControls
    if (controls) {
      controls.addEventListener('start', () => { isUserControlling = true; });
      controls.addEventListener('end', () => {
        setTimeout(() => { isUserControlling = false; }, 4000);
      });
    }

    // --- Lighting Mode Presets ---
    window.set3DLighting = function (mode) {
      document.querySelectorAll('[data-lighting]').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`[data-lighting="${mode}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      if (mode === 'day') {
        sunLight.intensity = 1.6;
        sunLight.color.setHex(0xffeedd);
        ambientLight.intensity = 0.75;
        ambientLight.color.setHex(0xfff5ea);
        scene.fog.color.setHex(0xf4f1eb);
      } else if (mode === 'golden') {
        sunLight.intensity = 1.8;
        sunLight.color.setHex(0xffaa55);
        ambientLight.intensity = 0.55;
        ambientLight.color.setHex(0xffbb77);
        scene.fog.color.setHex(0x2d2118);
      } else if (mode === 'twilight') {
        sunLight.intensity = 0.4;
        sunLight.color.setHex(0x5577bb);
        ambientLight.intensity = 0.45;
        ambientLight.color.setHex(0x223355);
        scene.fog.color.setHex(0x0a0d14);
      }
    };

    // Zoom Buttons
    window.zoom3D = function(delta) {
      const targetFov = Math.max(24, Math.min(60, camera.fov + delta));
      if (typeof gsap !== 'undefined') {
        gsap.to(camera, { fov: targetFov, duration: 0.4, onUpdate: () => camera.updateProjectionMatrix() });
      } else {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
    };

    window.reset3DCamera = function () {
      window.flyToRoom(0);
    };

    // --- Resize Handling ---
    function onWindowResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Expose Globals for Testing & Verification
    window._threeCamera = camera;
    window._threeScene = scene;
    window._threeControls = controls;

    // =========================================================================
    // CONTINUOUS 3D SCROLL SPLINE (NO BUTTON CLICKS: SCROLLING FLIES THROUGH ROOMS)
    // =========================================================================
    const camSpline = new THREE.CatmullRomCurve3(waypoints.map(w => w.cam));
    const targetSpline = new THREE.CatmullRomCurve3(waypoints.map(w => w.target));

    let scrollProgressDamped = 0;
    let targetScrollProgress = 0;

    window.addEventListener('scroll', () => {
      // The 3D story walkthrough spans the first ~2800px of page scroll (Hero + Cloud Pop + Timelines)
      const scrollY = window.scrollY || window.pageYOffset;
      const walkthroughEnd = 2800; // Complete walkthrough across the upper story
      targetScrollProgress = Math.min(Math.max(scrollY / walkthroughEnd, 0), 1);
    }, { passive: true });

    let frameCount = 0;
    let lastTime = performance.now();
    const fpsDisplay = document.getElementById('threeFps');
    const azimuthDisplay = document.getElementById('threeAzimuth');

    function animate() {
      requestAnimationFrame(animate);

      // Smooth Spline Flythrough Driven by Natural Page Scroll (NO BUTTON CLICK NEEDED)
      if (!isUserControlling && typeof camSpline !== 'undefined') {
        scrollProgressDamped += (targetScrollProgress - scrollProgressDamped) * 0.08;
        const ptCam = camSpline.getPoint(scrollProgressDamped);
        const ptTarget = targetSpline.getPoint(scrollProgressDamped);
        camera.position.lerp(ptCam, 0.12);
        if (controls) {
          controls.target.lerp(ptTarget, 0.12);
          controls.update();
        }

        // Automatic Dynamic Teak Entrance Door Swing (opens as scroll reaches entrance)
        if (typeof doorPivot !== 'undefined') {
          const doorOpen = Math.min(Math.max((scrollProgressDamped - 0.12) / 0.18, 0), 1);
          doorPivot.rotation.y = -doorOpen * (Math.PI / 2.1);
        }

        // Dynamically update HUD Room Badge on scroll
        const activeIdx = Math.min(Math.floor(scrollProgressDamped * waypoints.length), waypoints.length - 1);
        if (activeIdx !== currentWaypointIdx) {
          currentWaypointIdx = activeIdx;
          setRoomHUD(waypoints[activeIdx]);
        }
      } else if (controls) {
        controls.update();
      }

      renderer.render(scene, camera);

      frameCount++;
      if (frameCount % 30 === 0) {
        const now = performance.now();
        const fps = Math.round(30000 / (now - lastTime));
        lastTime = now;
        if (fpsDisplay) fpsDisplay.textContent = `${Math.min(fps, 60)} FPS`;

        if (azimuthDisplay && controls) {
          const az = Math.round((controls.getAzimuthalAngle() * 180) / Math.PI);
          azimuthDisplay.textContent = `AZ: ${az}°`;
        }
      }
    }

    animate();
    console.log('SLTG 3D Interior & Exterior Flythrough Engine Initialized Successfully.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();
