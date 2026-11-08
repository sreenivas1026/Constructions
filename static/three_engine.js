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
    initStructuralCoreEngine();
  }

  function initArchitecturalExperience() {
    const container = document.getElementById('threeViewport');
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const isInitNight = document.body.classList.contains('theme-black-night');
    const initBgHex = isInitNight ? 0x080a0f : 0xf2f5f8;
    scene.background = new THREE.Color(initBgHex);
    scene.fog = new THREE.FogExp2(initBgHex, 0.018);

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
      controls.minDistance = 1.5;
      controls.maxDistance = 30;
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
    const grid = new THREE.GridHelper(32, 32, 0xc5a059, 0x1f2330);
    grid.position.y = -0.01;
    scene.add(grid);

    // Site Plinth & Water Feature
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 9), mats.plinth);
    plinth.position.y = 0.2;
    plinth.receiveShadow = true;
    houseGroup.add(plinth);

    const pool = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 2.4), mats.water);
    pool.position.set(-3.4, 0.38, 2.6);
    houseGroup.add(pool);

    // Entrance Steps
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.6 - i * 0.2, 0.12, 0.9), mats.stoneLight);
      step.position.set(0, 0.2 + i * 0.1, 4.0 + i * 0.45);
      step.receiveShadow = true;
      step.castShadow = true;
      houseGroup.add(step);
    }

    // Outer Perimeter Walls (North & West)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(10.4, 5.6, 0.3), mats.stoneLight);
    backWall.position.set(0, 3.1, -3.8);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    houseGroup.add(backWall);

    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.6, 7.6), mats.stoneLight);
    westWall.position.set(-5.1, 3.1, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    houseGroup.add(westWall);

    // =========================================================================
    // ROOM 1: GRAND ENTRANCE & EAST PORTICO
    // =========================================================================
    // Entrance Feature Wall (Textured Dark Granite)
    const porticoWall = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.7, 0.3), mats.stoneDark);
    porticoWall.position.set(3.8, 1.75, 3.2);
    porticoWall.castShadow = true;
    houseGroup.add(porticoWall);

    // Teak Wood Pivot Door (Grand Entrance with Dynamic Swing Pivot)
    const doorPivot = new THREE.Group();
    doorPivot.position.set(1.45, 1.65, 3.2);
    houseGroup.add(doorPivot);

    const entranceDoor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 0.1), mats.woodTeak);
    entranceDoor.position.set(0.75, 0, 0);
    entranceDoor.castShadow = true;
    doorPivot.add(entranceDoor);

    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 16), mats.bronzeGold);
    doorHandle.position.set(1.35, 0, 0.08);
    doorPivot.add(doorHandle);

    // =========================================================================
    // ROOM 2: GRAND LIVING HALL (Double-Height Glazed Atrium)
    // =========================================================================
    // Living Room Glazed Curtain Wall (Front)
    const livingGlass = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.6, 0.08), mats.glass);
    livingGlass.position.set(-2.0, 1.7, 3.2);
    houseGroup.add(livingGlass);

    // Steel Mullions
    for (let x = -4.2; x <= 0.4; x += 1.4) {
      const mul = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.6, 0.1), mats.blackSteel);
      mul.position.set(x, 1.7, 3.2);
      houseGroup.add(mul);
    }

    // Modern L-Shaped Sectional Sofa
    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.9), mats.sofaFabric);
    sofaMain.position.set(-2.4, 0.65, 0.8);
    sofaMain.castShadow = true;
    houseGroup.add(sofaMain);

    const sofaReturn = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 1.8), mats.sofaFabric);
    sofaReturn.position.set(-3.25, 0.65, 1.65);
    sofaReturn.castShadow = true;
    houseGroup.add(sofaReturn);

    // Sofa Backrest & Pillows
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 0.2), mats.sofaFabric);
    sofaBack.position.set(-2.4, 0.95, 0.35);
    houseGroup.add(sofaBack);

    const cushion1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.12), mats.sofaCushion);
    cushion1.position.set(-1.8, 0.85, 0.5);
    houseGroup.add(cushion1);

    // Marble Coffee Table
    const coffeeTable = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3, 32), mats.marbleWhite);
    coffeeTable.position.set(-1.8, 0.55, 1.6);
    coffeeTable.castShadow = true;
    houseGroup.add(coffeeTable);

    // Minimalist Standing Floor Lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 16), mats.blackSteel);
    lampStem.position.set(-4.0, 1.3, 0.6);
    houseGroup.add(lampStem);

    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.35, 24), mats.bronzeGold);
    lampShade.position.set(-4.0, 2.05, 0.6);
    houseGroup.add(lampShade);

    // Wall-Mounted OLED Display & Console
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 2.0), mats.blackSteel);
    tvScreen.position.set(-4.9, 1.8, 1.5);
    houseGroup.add(tvScreen);

    const tvConsole = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 2.4), mats.woodTeak);
    tvConsole.position.set(-4.7, 0.55, 1.5);
    tvConsole.castShadow = true;
    houseGroup.add(tvConsole);

    // =========================================================================
    // ROOM 3: MODULAR CHEF'S KITCHEN & DINING ATRIUM
    // =========================================================================
    // Waterfall Island Counter
    const island = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.85, 2.2), mats.counterDark);
    island.position.set(2.4, 0.82, -1.4);
    island.castShadow = true;
    houseGroup.add(island);

    const islandTop = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.06, 2.26), mats.marbleWhite);
    islandTop.position.set(2.4, 1.28, -1.4);
    islandTop.castShadow = true;
    houseGroup.add(islandTop);

    // Modern Bar Stools
    for (let s = -0.5; s <= 0.5; s += 0.8) {
      const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), mats.woodTeak);
      stoolSeat.position.set(1.5, 0.72, -1.4 + s);
      houseGroup.add(stoolSeat);

      const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.7, 16), mats.blackSteel);
      stoolLeg.position.set(1.5, 0.35, -1.4 + s);
      houseGroup.add(stoolLeg);
    }

    // Rear Kitchen Cabinets & Counter
    const rearCabinets = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.85, 0.7), mats.woodTeak);
    rearCabinets.position.set(2.6, 0.82, -3.4);
    rearCabinets.castShadow = true;
    houseGroup.add(rearCabinets);

    // Overhead Cabinets with warm under-glow
    const topCabinets = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 0.4), mats.stoneLight);
    topCabinets.position.set(2.6, 2.25, -3.45);
    houseGroup.add(topCabinets);

    // Dining Table & Pendant Chandelier
    const diningTable = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 1.8), mats.woodTeak);
    diningTable.position.set(0.2, 0.78, -1.2);
    diningTable.castShadow = true;
    houseGroup.add(diningTable);

    for (let c = -0.6; c <= 0.6; c += 1.2) {
      const chair1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.75, 0.4), mats.sofaFabric);
      chair1.position.set(-0.5, 0.6, -1.2 + c);
      houseGroup.add(chair1);

      const chair2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.75, 0.4), mats.sofaFabric);
      chair2.position.set(0.9, 0.6, -1.2 + c);
      houseGroup.add(chair2);
    }

    const chandelier = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 24), mats.bronzeGold);
    chandelier.position.set(0.2, 2.3, -1.2);
    houseGroup.add(chandelier);

    // =========================================================================
    // ROOM 4: FLOATING ARCHITECTURAL STAIRCASE & MEZZANINE
    // =========================================================================
    for (let st = 0; st < 11; st++) {
      const tread = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.32), mats.woodTeak);
      tread.position.set(-2.2, 0.45 + st * 0.25, -1.8 - st * 0.16);
      tread.castShadow = true;
      houseGroup.add(tread);
    }

    // Glass Balustrade on Stairway
    const stairGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 2.4), mats.glass);
    stairGlass.position.set(-1.6, 1.8, -2.6);
    stairGlass.rotation.x = -0.45;
    houseGroup.add(stairGlass);

    // =========================================================================
    // ROOM 5: FIRST FLOOR MASTER BEDROOM SUITE
    // =========================================================================
    // Intermediate Floor Slab
    const interSlab = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.35, 7.6), mats.stoneDark);
    interSlab.position.set(0, 3.15, 0.2);
    interSlab.castShadow = true;
    interSlab.receiveShadow = true;
    houseGroup.add(interSlab);

    // Master Bedroom Volume (Cantilevered over ground entrance)
    const masterWall = new THREE.Mesh(new THREE.BoxGeometry(5.4, 2.6, 4.4), mats.stoneLight);
    masterWall.position.set(2.0, 4.6, 1.2);
    masterWall.castShadow = true;
    houseGroup.add(masterWall);

    // King-Size Designer Bed
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.4, 2.2), mats.woodTeak);
    bedBase.position.set(2.2, 3.55, 1.0);
    bedBase.castShadow = true;
    houseGroup.add(bedBase);

    const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.3, 2.0), mats.bedFabric);
    bedMattress.position.set(2.2, 3.8, 1.0);
    houseGroup.add(bedMattress);

    const bedHeadboard = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.18), mats.bedAccent);
    bedHeadboard.position.set(2.2, 4.25, -0.05);
    houseGroup.add(bedHeadboard);

    // Floating Bedside Tables with reading lamps
    for (let side of [-1, 1]) {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.4), mats.woodTeak);
      stand.position.set(2.2 + side * 1.35, 3.55, 0.2);
      houseGroup.add(stand);

      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.25, 16), mats.bronzeGold);
      lamp.position.set(2.2 + side * 1.35, 3.85, 0.2);
      houseGroup.add(lamp);
    }

    // Master Walk-in Dressing Wardrobe (Bronze Framed Glass)
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 0.6), mats.stoneDark);
    wardrobe.position.set(4.3, 4.45, 1.6);
    houseGroup.add(wardrobe);

    // Architectural Bronze Facade Louvers (Brise-Soleil)
    for (let l = 0; l < 8; l++) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.4, 0.16), mats.bronzeGold);
      louver.position.set(4.68, 4.6, -0.2 + l * 0.38);
      louver.rotation.y = 0.28;
      louver.castShadow = true;
      houseGroup.add(louver);
    }

    // =========================================================================
    // ROOM 6: SUNSET BALCONY & ROOF CANOPY
    // =========================================================================
    // Frameless Glass Balustrade
    const balconyGlassFront = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.05, 0.06), mats.glass);
    balconyGlassFront.position.set(-2.4, 3.85, 3.8);
    houseGroup.add(balconyGlassFront);

    const balconyGlassSide = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 3.0), mats.glass);
    balconyGlassSide.position.set(-4.8, 3.85, 2.3);
    houseGroup.add(balconyGlassSide);

    // Minimalist Outdoor Lounge Chairs
    const chairA = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.5, 0.7), mats.sofaFabric);
    chairA.position.set(-2.0, 3.65, 2.6);
    houseGroup.add(chairA);

    const chairB = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.5, 0.7), mats.sofaFabric);
    chairB.position.set(-3.2, 3.65, 2.6);
    houseGroup.add(chairB);

    // Modern Floating Roof Canopy
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.3, 8.2), mats.stoneDark);
    roofSlab.position.set(0, 6.05, 0.2);
    roofSlab.castShadow = true;
    houseGroup.add(roofSlab);

    // =========================================================================
    // ROOM 7: COVERED PARKING PORCH & PLINTH SWIMMING POOL
    // =========================================================================
    // Covered Parking Pergola Canopy
    const parkingRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 5.2), mats.stoneDark);
    parkingRoof.position.set(4.4, 2.8, 1.0);
    parkingRoof.castShadow = true;
    houseGroup.add(parkingRoof);

    // Parking Steel Columns
    for (let z of [-1.0, 3.0]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 0.2), mats.blackSteel);
      col.position.set(6.3, 1.4, z);
      col.castShadow = true;
      houseGroup.add(col);
    }

    // Modern Vehicle Silhouette in Covered Bay
    const carBase = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 4.0), mats.blackSteel);
    carBase.position.set(4.5, 0.65, 1.0);
    carBase.castShadow = true;
    houseGroup.add(carBase);

    const carCabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 2.2), mats.glass);
    carCabin.position.set(4.5, 1.15, 0.8);
    houseGroup.add(carCabin);

    // Luxury Swimming Pool with Aqua Light
    const poolSurround = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 3.2), mats.stoneLight);
    poolSurround.position.set(-3.4, 0.36, 2.6);
    houseGroup.add(poolSurround);

    const poolWaterMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 2.6), mats.water);
    poolWaterMesh.position.set(-3.4, 0.40, 2.6);
    houseGroup.add(poolWaterMesh);

    const poolAquaLight = new THREE.PointLight(0x00d4ff, 2.5, 6.0);
    poolAquaLight.position.set(-3.4, 0.6, 2.6);
    scene.add(poolAquaLight);

    // =========================================================================
    // SCROLL-DRIVEN CAMERA PATH & ROOM WAYPOINTS
    // =========================================================================
    const waypoints = [
      {
        id: 'room-facade',
        name: '01 / Architectural Facade',
        desc: 'G+1 133 SQ Yards Luxury Duplex — Contemporary Italian stone elevation with 100% Vaastu alignment.',
        cam: new THREE.Vector3(10.5, 7.2, 12.5),
        target: new THREE.Vector3(0, 2.2, 0)
      },
      {
        id: 'room-entrance',
        name: '02 / Grand Entrance (Doors Open)',
        desc: 'Teak wood pivot entrance door automatically swings open as you step inside the reception foyer.',
        cam: new THREE.Vector3(2.8, 1.9, 4.6),
        target: new THREE.Vector3(2.0, 1.65, 2.2)
      },
      {
        id: 'room-living',
        name: '03 / Double-Height Living Hall',
        desc: 'Expansive natural daylight, Italian marble flooring, custom sectional sofa, and OLED media wall.',
        cam: new THREE.Vector3(-0.6, 1.8, 2.8),
        target: new THREE.Vector3(-2.6, 1.4, 1.2)
      },
      {
        id: 'room-kitchen',
        name: '04 / Modular Chef\'s Kitchen & Dining',
        desc: 'Quartz waterfall island counter, soft-close cabinets, and connected family dining atrium.',
        cam: new THREE.Vector3(1.2, 2.0, 0.4),
        target: new THREE.Vector3(2.5, 1.4, -2.2)
      },
      {
        id: 'room-master',
        name: '05 / Master Bedroom Suite',
        desc: 'Generous first floor suite with upholstered king bed, walk-in dressing wardrobe, and balcony slider.',
        cam: new THREE.Vector3(0.6, 4.6, 2.8),
        target: new THREE.Vector3(2.5, 4.4, 1.0)
      },
      {
        id: 'room-stairs',
        name: '06 / Cantilevered Staircase',
        desc: 'Solid teak floating steps with frameless glass balustrade ascending to the first floor lounge.',
        cam: new THREE.Vector3(-0.8, 2.8, 0.2),
        target: new THREE.Vector3(-2.2, 2.4, -1.8)
      },
      {
        id: 'room-balcony',
        name: '07 / Sunset Balcony Terrace',
        desc: 'Open-air private glass terrace capturing evening cross breezes and ambient lighting.',
        cam: new THREE.Vector3(-1.4, 4.8, 4.8),
        target: new THREE.Vector3(-2.8, 4.0, 2.4)
      },
      {
        id: 'room-pool',
        name: '08 / Covered Parking & Swimming Pool',
        desc: 'Descending to ground level covered parking porch and private illuminated aqua swimming pool.',
        cam: new THREE.Vector3(-3.8, 3.0, 7.2),
        target: new THREE.Vector3(-0.5, 0.8, 2.0)
      }
    ];

    let currentWaypointIdx = 0;
    let isUserControlling = false;

    // Set Initial Camera Position
    camera.position.copy(waypoints[0].cam);
    if (controls) controls.target.copy(waypoints[0].target);

    // Update Room HUD Banner
    const hudRoomBadge = document.getElementById('threeRoomBadge');
    const hudRoomDesc = document.getElementById('threeRoomDesc');

    function setRoomHUD(wp) {
      if (hudRoomBadge) hudRoomBadge.textContent = wp.name;
      if (hudRoomDesc) hudRoomDesc.textContent = wp.desc;

      document.querySelectorAll('.room-nav-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.room === wp.id);
      });
    }
    setRoomHUD(waypoints[0]);

    // Fly to Specific Room Waypoint
    window.flyToRoom = function (idx) {
      if (idx < 0 || idx >= waypoints.length) return;
      currentWaypointIdx = idx;
      const wp = waypoints[idx];
      setRoomHUD(wp);

      // Dynamic Door Swing Animation: Open when inside (idx >= 1), close when at facade (idx === 0)
      if (typeof doorPivot !== 'undefined') {
        const targetDoorAngle = idx >= 1 ? -Math.PI / 2.2 : 0;
        if (typeof gsap !== 'undefined') {
          gsap.to(doorPivot.rotation, { y: targetDoorAngle, duration: 1.2, ease: 'power2.out' });
        } else {
          doorPivot.rotation.y = targetDoorAngle;
        }
      }

      if (typeof gsap !== 'undefined') {
        gsap.to(camera.position, {
          x: wp.cam.x,
          y: wp.cam.y,
          z: wp.cam.z,
          duration: 1.5,
          ease: 'power2.inOut'
        });
        if (controls) {
          gsap.to(controls.target, {
            x: wp.target.x,
            y: wp.target.y,
            z: wp.target.z,
            duration: 1.5,
            ease: 'power2.inOut'
          });
        }
      } else {
        camera.position.copy(wp.cam);
        if (controls) controls.target.copy(wp.target);
      }
    };

    // Mouse Wheel Deep Room Exploration inside Viewport
    let wheelDebounce = null;
    container.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (wheelDebounce) return;
      wheelDebounce = setTimeout(() => { wheelDebounce = null; }, 400);

      if (e.deltaY > 0) {
        // Scroll down -> fly deeper into next room
        const nextIdx = Math.min(waypoints.length - 1, currentWaypointIdx + 1);
        if (nextIdx !== currentWaypointIdx) window.flyToRoom(nextIdx);
      } else if (e.deltaY < 0) {
        // Scroll up -> fly back towards entrance / facade
        const prevIdx = Math.max(0, currentWaypointIdx - 1);
        if (prevIdx !== currentWaypointIdx) window.flyToRoom(prevIdx);
      }
    }, { passive: false });

    // Scroll-Driven Camera Tour
    window.addEventListener('scroll', () => {
      // Calculate normalized scroll position over document
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollFraction = Math.max(0, Math.min(1, window.scrollY / docHeight));

      // Map scroll percentage to waypoints
      const targetIndex = Math.min(
        waypoints.length - 1,
        Math.floor(scrollFraction * waypoints.length)
      );

      if (targetIndex !== currentWaypointIdx && !isUserControlling) {
        window.flyToRoom(targetIndex);
      }
    }, { passive: true });

    // Track when user is actively dragging OrbitControls
    if (controls) {
      controls.addEventListener('start', () => { isUserControlling = true; });
      controls.addEventListener('end', () => {
        // Return to auto control after 5 seconds of inactivity
        setTimeout(() => { isUserControlling = false; }, 5000);
      });
    }

    // --- Lighting Mode Presets ---
    window.set3DLighting = function (mode) {
      document.querySelectorAll('[data-lighting]').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`[data-lighting="${mode}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      if (typeof gsap === 'undefined') return;

      if (mode === 'day') {
        gsap.to(scene.background, { r: 0.95, g: 0.96, b: 0.97, duration: 0.8 });
        if (scene.fog) gsap.to(scene.fog.color, { r: 0.95, g: 0.96, b: 0.97, duration: 0.8 });
        gsap.to(sunLight, { intensity: 1.6, duration: 0.8 });
        gsap.to(sunLight.color, { r: 1.0, g: 0.96, b: 0.9, duration: 0.8 });
        gsap.to(ambientLight, { intensity: 0.85, duration: 0.8 });
        Object.values(lights).forEach(l => gsap.to(l, { intensity: 0.9, duration: 0.8 }));
      } else if (mode === 'golden') {
        gsap.to(scene.background, { r: 0.14, g: 0.10, b: 0.11, duration: 0.8 });
        if (scene.fog) gsap.to(scene.fog.color, { r: 0.14, g: 0.10, b: 0.11, duration: 0.8 });
        gsap.to(sunLight, { intensity: 1.9, duration: 0.8 });
        gsap.to(sunLight.color, { r: 1.0, g: 0.64, b: 0.28, duration: 0.8 });
        gsap.to(ambientLight, { intensity: 0.55, duration: 0.8 });
        Object.values(lights).forEach(l => gsap.to(l, { intensity: 2.0, duration: 0.8 }));
      } else if (mode === 'night') {
        gsap.to(scene.background, { r: 0.03, g: 0.04, b: 0.06, duration: 0.8 });
        if (scene.fog) gsap.to(scene.fog.color, { r: 0.03, g: 0.04, b: 0.06, duration: 0.8 });
        gsap.to(sunLight, { intensity: 0.18, duration: 0.8 });
        gsap.to(sunLight.color, { r: 0.35, g: 0.45, b: 0.75, duration: 0.8 });
        gsap.to(ambientLight, { intensity: 0.35, duration: 0.8 });
        Object.values(lights).forEach(l => gsap.to(l, { intensity: 3.0, duration: 0.8 }));
      }
    };

    // --- Wireframe & Exploded Toggles ---
    let isWireframe = false;
    let isExploded = false;

    window.toggle3DWireframe = function () {
      isWireframe = !isWireframe;
      houseGroup.traverse(node => {
        if (node.isMesh && node.material) {
          node.material.wireframe = isWireframe;
        }
      });
      const btn = document.getElementById('btnWireframe');
      if (btn) btn.classList.toggle('active', isWireframe);
    };

    window.toggle3DExploded = function () {
      isExploded = !isExploded;
      const roofTargetY = isExploded ? 4.5 : 0;
      if (typeof gsap !== 'undefined') {
        gsap.to(roofSlab.position, { y: 6.05 + roofTargetY, duration: 1.4, ease: 'power3.inOut' });
      } else {
        roofSlab.position.y = 6.05 + roofTargetY;
      }
      const btn = document.getElementById('btnExploded');
      if (btn) btn.classList.toggle('active', isExploded);
    };

    // Reset Camera
    window.reset3DCamera = function () {
      window.flyToRoom(0);
    };

    // --- Window Resize Handling ---
    function onWindowResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onWindowResize, { passive: true });

    // --- Render Loop ---
    let frameCount = 0;
    let lastTime = performance.now();
    const fpsDisplay = document.getElementById('threeFps');
    const azimuthDisplay = document.getElementById('threeAzimuth');

    function animate() {
      requestAnimationFrame(animate);

      if (controls) {
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
