/**
 * SLTG BUILDERS — DOMINANT 3D ARCHITECTURAL THREE.JS ENGINE
 * Procedural Luxury Duplex Model, Lighting Presets, Exploded Views,
 * Wireframe X-Ray, 3D Spatial Hotspots, and Camera Orbit HUD.
 */

(function () {
  'use strict';

  // Wait for Three.js and DOM
  function initWhenReady() {
    if (typeof THREE === 'undefined') {
      setTimeout(initWhenReady, 50);
      return;
    }
    initArchitecturalStudio();
  }

  function initArchitecturalStudio() {
    const container = document.getElementById('threeViewport');
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0e14);
    scene.fog = new THREE.FogExp2(0x0c0e14, 0.025);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(11, 7.5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- Orbit Controls ---
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't dip below floor
      controls.minDistance = 6;
      controls.maxDistance = 26;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.target.set(0, 1.8, 0);
    }

    // --- Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0xfff7ea, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.4);
    sunLight.position.set(14, 18, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Soft fill light
    const fillLight = new THREE.DirectionalLight(0x7799bb, 0.4);
    fillLight.position.set(-12, 10, -10);
    scene.add(fillLight);

    // Interior Warm Glow Lights (Living & Master Suite)
    const interiorLightG = new THREE.PointLight(0xffb355, 1.8, 8);
    interiorLightG.position.set(0, 1.5, 0.5);
    scene.add(interiorLightG);

    const interiorLightF1 = new THREE.PointLight(0xffcc77, 1.6, 7);
    interiorLightF1.position.set(0, 4.0, 0.8);
    scene.add(interiorLightF1);

    // Uplights on entrance & pool
    const poolLight = new THREE.PointLight(0x44ddff, 1.0, 5);
    poolLight.position.set(-3.2, 0.3, 3.2);
    scene.add(poolLight);

    // --- Material Library ---
    const materials = {
      concretePlinth: new THREE.MeshStandardMaterial({ color: 0x1c202a, roughness: 0.85, metalness: 0.1 }),
      stoneWallLight: new THREE.MeshStandardMaterial({ color: 0xded8cc, roughness: 0.6, metalness: 0.05 }),
      stoneWallDark: new THREE.MeshStandardMaterial({ color: 0x222630, roughness: 0.7, metalness: 0.2 }),
      woodTeak: new THREE.MeshStandardMaterial({ color: 0x8a4e22, roughness: 0.45, metalness: 0.1 }),
      bronzeMetal: new THREE.MeshStandardMaterial({ color: 0xc5a059, roughness: 0.35, metalness: 0.8 }),
      blackSteel: new THREE.MeshStandardMaterial({ color: 0x16181d, roughness: 0.4, metalness: 0.6 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x88ccdd,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.7,
        transparent: true,
        opacity: 0.45,
        reflectivity: 0.9
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x1a4555,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85
      }),
      wireframeBronze: new THREE.MeshBasicMaterial({ color: 0xc5a059, wireframe: true }),
      wireframeCyan: new THREE.MeshBasicMaterial({ color: 0x44ddff, wireframe: true })
    };

    // Store original materials for wireframe toggle
    const originalMaterials = new Map();

    // --- Master Groups for Exploded View ---
    const duplexModel = new THREE.Group();
    const groundLevelGroup = new THREE.Group();
    const firstFloorGroup = new THREE.Group();
    const roofLevelGroup = new THREE.Group();

    // --- Ground Grid & Site Plinth ---
    // Minimalist architectural coordinate grid
    const gridHelper = new THREE.GridHelper(30, 30, 0xc5a059, 0x222633);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Main Site Concrete Plinth (133 Sq. Yards Proportion)
    const plinthGeo = new THREE.BoxGeometry(11, 0.4, 8);
    const plinthMesh = new THREE.Mesh(plinthGeo, materials.concretePlinth);
    plinthMesh.position.y = 0.2;
    plinthMesh.receiveShadow = true;
    groundLevelGroup.add(plinthMesh);

    // Landscape Water Feature (Reflecting Pool)
    const poolGeo = new THREE.BoxGeometry(3.5, 0.15, 2.2);
    const poolMesh = new THREE.Mesh(poolGeo, materials.water);
    poolMesh.position.set(-3.2, 0.38, 2.4);
    groundLevelGroup.add(poolMesh);

    // Stone Steps & Entrance Walkway
    for (let i = 0; i < 3; i++) {
      const stepGeo = new THREE.BoxGeometry(2.6 - i * 0.2, 0.12, 1.0);
      const stepMesh = new THREE.Mesh(stepGeo, materials.stoneWallLight);
      stepMesh.position.set(0, 0.2 + i * 0.1, 3.8 + i * 0.45);
      stepMesh.receiveShadow = true;
      stepMesh.castShadow = true;
      groundLevelGroup.add(stepMesh);
    }

    // --- Ground Floor Structure (Height 2.6m) ---
    // West & North Solid Structural Walls (RCC Shear + Red Brick)
    const backWallGeo = new THREE.BoxGeometry(9.6, 2.6, 0.3);
    const backWall = new THREE.Mesh(backWallGeo, materials.stoneWallLight);
    backWall.position.set(0, 1.7, -3.2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    groundLevelGroup.add(backWall);

    const westWallGeo = new THREE.BoxGeometry(0.3, 2.6, 6.4);
    const westWall = new THREE.Mesh(westWallGeo, materials.stoneWallLight);
    westWall.position.set(-4.65, 1.7, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    groundLevelGroup.add(westWall);

    // Double-Height Glazed Living Room Volume (Front & East)
    const frontGlassGeo = new THREE.BoxGeometry(5.2, 2.5, 0.08);
    const frontGlass = new THREE.Mesh(frontGlassGeo, materials.glass);
    frontGlass.position.set(-1.8, 1.65, 2.8);
    groundLevelGroup.add(frontGlass);

    // Black Steel Mullions & Architectural Frame
    const frameGeo = new THREE.BoxGeometry(5.3, 0.08, 0.12);
    const frameTop = new THREE.Mesh(frameGeo, materials.blackSteel);
    frameTop.position.set(-1.8, 2.9, 2.8);
    groundLevelGroup.add(frameTop);

    const frameBottom = new THREE.Mesh(frameGeo, materials.blackSteel);
    frameBottom.position.set(-1.8, 0.42, 2.8);
    groundLevelGroup.add(frameBottom);

    for (let m = -3.8; m <= 0.2; m += 1.3) {
      const vertGeo = new THREE.BoxGeometry(0.06, 2.5, 0.1);
      const vertMullion = new THREE.Mesh(vertGeo, materials.blackSteel);
      vertMullion.position.set(m, 1.65, 2.8);
      groundLevelGroup.add(vertMullion);
    }

    // Main Teak Wood Pivot Entry Door
    const doorGeo = new THREE.BoxGeometry(1.4, 2.4, 0.1);
    const doorMesh = new THREE.Mesh(doorGeo, materials.woodTeak);
    doorMesh.position.set(2.4, 1.6, 2.8);
    doorMesh.castShadow = true;
    groundLevelGroup.add(doorMesh);

    // Teak Vertical Bronze Handle
    const handleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 16);
    const handleMesh = new THREE.Mesh(handleGeo, materials.bronzeMetal);
    handleMesh.position.set(2.9, 1.6, 2.88);
    groundLevelGroup.add(handleMesh);

    // Ground Floor Entrance Feature Wall (Dark Stone Texture)
    const featWallGeo = new THREE.BoxGeometry(2.0, 2.6, 0.3);
    const featWall = new THREE.Mesh(featWallGeo, materials.stoneWallDark);
    featWall.position.set(3.8, 1.7, 2.8);
    featWall.castShadow = true;
    featWall.receiveShadow = true;
    groundLevelGroup.add(featWall);

    // Internal Ground Floor Partitions (Living, Dining, Kitchen core)
    const kitchenWallGeo = new THREE.BoxGeometry(3.6, 2.5, 0.2);
    const kitchenWall = new THREE.Mesh(kitchenWallGeo, materials.stoneWallLight);
    kitchenWall.position.set(2.4, 1.65, -1.2);
    groundLevelGroup.add(kitchenWall);

    // --- First Floor Cantilevered Level (Projecting forward & east) ---
    // Intermediate Structural Slab (Ceiling of G / Floor of F1)
    const interSlabGeo = new THREE.BoxGeometry(10.2, 0.35, 7.4);
    const interSlab = new THREE.Mesh(interSlabGeo, materials.stoneWallDark);
    interSlab.position.set(0, 3.15, 0.3);
    interSlab.castShadow = true;
    interSlab.receiveShadow = true;
    firstFloorGroup.add(interSlab);

    // Cantilevered Master Suite Volume (Projects forward)
    const masterSuiteGeo = new THREE.BoxGeometry(5.2, 2.6, 4.4);
    const masterSuite = new THREE.Mesh(masterSuiteGeo, materials.stoneWallLight);
    masterSuite.position.set(1.8, 4.5, 1.2);
    masterSuite.castShadow = true;
    masterSuite.receiveShadow = true;
    firstFloorGroup.add(masterSuite);

    // Master Suite Architectural Louver Screen (Brise-Soleil)
    for (let l = 0; l < 8; l++) {
      const louverGeo = new THREE.BoxGeometry(0.04, 2.4, 0.15);
      const louver = new THREE.Mesh(louverGeo, materials.bronzeMetal);
      louver.position.set(4.42, 4.5, -0.4 + l * 0.4);
      louver.rotation.y = 0.25;
      louver.castShadow = true;
      firstFloorGroup.add(louver);
    }

    // Sunset Balcony with Frameless Glass Balustrade
    const balconyGlassGeo = new THREE.BoxGeometry(4.2, 1.0, 0.06);
    const balconyGlass = new THREE.Mesh(balconyGlassGeo, materials.glass);
    balconyGlass.position.set(-2.4, 3.8, 3.6);
    firstFloorGroup.add(balconyGlass);

    const balconyGlassSideGeo = new THREE.BoxGeometry(0.06, 1.0, 2.8);
    const balconyGlassSide = new THREE.Mesh(balconyGlassSideGeo, materials.glass);
    balconyGlassSide.position.set(-4.5, 3.8, 2.2);
    firstFloorGroup.add(balconyGlassSide);

    // Stainless Steel Handrail
    const handrailGeo = new THREE.BoxGeometry(4.3, 0.05, 0.08);
    const handrail = new THREE.Mesh(handrailGeo, materials.blackSteel);
    handrail.position.set(-2.4, 4.32, 3.6);
    firstFloorGroup.add(handrail);

    // First Floor Bedroom Rear Wall & East Wall
    const f1BackWallGeo = new THREE.BoxGeometry(9.4, 2.6, 0.3);
    const f1BackWall = new THREE.Mesh(f1BackWallGeo, materials.stoneWallLight);
    f1BackWall.position.set(0, 4.5, -3.0);
    f1BackWall.castShadow = true;
    firstFloorGroup.add(f1BackWall);

    // First Floor Bedroom Window Glass
    const f1WinGlassGeo = new THREE.BoxGeometry(3.2, 1.8, 0.08);
    const f1WinGlass = new THREE.Mesh(f1WinGlassGeo, materials.glass);
    f1WinGlass.position.set(1.8, 4.6, 3.42);
    firstFloorGroup.add(f1WinGlass);

    // --- Roof Level & Canopy ---
    // Floating Modern Roof Plane with Overhang
    const roofSlabGeo = new THREE.BoxGeometry(10.6, 0.3, 7.8);
    const roofSlab = new THREE.Mesh(roofSlabGeo, materials.stoneWallDark);
    roofSlab.position.set(0, 5.95, 0.3);
    roofSlab.castShadow = true;
    roofLevelGroup.add(roofSlab);

    // Parapet Wall & Solar / Water Sump Housing
    const parapetGeo = new THREE.BoxGeometry(10.6, 0.4, 0.2);
    const parapetFront = new THREE.Mesh(parapetGeo, materials.stoneWallLight);
    parapetFront.position.set(0, 6.3, 4.1);
    roofLevelGroup.add(parapetFront);

    const parapetBack = new THREE.Mesh(parapetGeo, materials.stoneWallLight);
    parapetBack.position.set(0, 6.3, -3.5);
    roofLevelGroup.add(parapetBack);

    // Recessed Warm LED Strip Under Roof Eaves
    const eaveLight = new THREE.PointLight(0xffb866, 1.2, 5);
    eaveLight.position.set(0, 5.7, 3.9);
    roofLevelGroup.add(eaveLight);

    // Assemble Hierarchy
    duplexModel.add(groundLevelGroup);
    duplexModel.add(firstFloorGroup);
    duplexModel.add(roofLevelGroup);
    scene.add(duplexModel);

    // Register all meshes for wireframe toggle
    duplexModel.traverse((node) => {
      if (node.isMesh) {
        originalMaterials.set(node, node.material);
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // --- 3D Spatial Hotspot Annotations ---
    const hotspots = [
      {
        id: 'spot-portico',
        name: 'East-Facing Vaastu Portico',
        specs: '100% Vaastu alignment with teak wood entry pivot and natural granite porch.',
        pos: new THREE.Vector3(2.4, 1.8, 3.2)
      },
      {
        id: 'spot-atrium',
        name: 'Double-Height Glazed Living',
        specs: 'Thermal acoustic double-glazed curtain wall with 800x1600mm Italian vitrified flooring.',
        pos: new THREE.Vector3(-1.8, 1.8, 3.0)
      },
      {
        id: 'spot-master',
        name: 'Cantilevered Master Suite',
        specs: '2.5m structural cantilever with bronze solar louvers and private attached dressing.',
        pos: new THREE.Vector3(1.8, 4.6, 3.6)
      },
      {
        id: 'spot-terrace',
        name: 'Sunset Balcony & Skylight',
        specs: 'Open-air glass terrace capturing evening cross breezes and ambient lighting.',
        pos: new THREE.Vector3(-2.4, 4.2, 3.8)
      },
      {
        id: 'spot-core',
        name: 'Fe550D Reinforced Plinth',
        specs: 'High-yield Tata Tiscon/Jindal steel framing and UltraTech M25 grade foundation.',
        pos: new THREE.Vector3(0, 0.3, 0)
      }
    ];

    const hotspotContainer = document.getElementById('threeHotspotsOverlay');
    const hudDetailBox = document.getElementById('threeHudDetail');

    function createHotspots() {
      if (!hotspotContainer) return;
      hotspotContainer.innerHTML = '';

      hotspots.forEach((spot, idx) => {
        const el = document.createElement('div');
        el.className = 'hotspot-marker';
        el.id = spot.id;
        el.innerHTML = `
          <div class="hotspot-pin">
            <span class="hotspot-pulse"></span>
            <span class="hotspot-dot">${idx + 1}</span>
          </div>
          <div class="hotspot-label">${spot.name}</div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          focusHotspot(spot);
        });

        hotspotContainer.appendChild(el);
        spot.element = el;
      });
    }

    function updateHotspots() {
      if (!hotspotContainer) return;
      const tempV = new THREE.Vector3();

      hotspots.forEach((spot) => {
        if (!spot.element) return;
        tempV.copy(spot.pos);

        // Account for exploded view offsets if active
        if (isExploded) {
          if (spot.id === 'spot-master' || spot.id === 'spot-terrace') {
            tempV.y += 3.5;
          }
        }

        tempV.project(camera);

        // Check if behind camera
        if (tempV.z > 1) {
          spot.element.style.opacity = '0';
          spot.element.style.pointerEvents = 'none';
          return;
        }

        const x = (tempV.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-(tempV.y * 0.5) + 0.5) * container.clientHeight;

        spot.element.style.transform = `translate(${x}px, ${y}px)`;
        spot.element.style.opacity = '1';
        spot.element.style.pointerEvents = 'auto';
      });
    }

    function focusHotspot(spot) {
      if (typeof gsap !== 'undefined') {
        const targetPos = spot.pos.clone();
        if (controls) {
          gsap.to(controls.target, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 1.2,
            ease: 'power2.inOut'
          });
        }
        gsap.to(camera.position, {
          x: targetPos.x + 5,
          y: targetPos.y + 3,
          z: targetPos.z + 5,
          duration: 1.2,
          ease: 'power2.inOut'
        });
      }

      if (hudDetailBox) {
        hudDetailBox.innerHTML = `
          <div class="hud-feature-title"><i class="fas fa-crosshairs"></i> ${spot.name}</div>
          <div class="hud-feature-specs">${spot.specs}</div>
        `;
        hudDetailBox.classList.add('visible');
      }
    }

    createHotspots();

    // --- State & Toggles ---
    let isWireframe = false;
    let isExploded = false;
    let activeLighting = 'day';

    // Wireframe Toggle
    window.toggle3DWireframe = function () {
      isWireframe = !isWireframe;
      duplexModel.traverse((node) => {
        if (node.isMesh) {
          if (isWireframe) {
            node.material = node.material === materials.glass ? materials.wireframeCyan : materials.wireframeBronze;
          } else {
            node.material = originalMaterials.get(node) || materials.stoneWallLight;
          }
        }
      });
      const btn = document.getElementById('btnWireframe');
      if (btn) btn.classList.toggle('active', isWireframe);
    };

    // Exploded View Toggle (GSAP)
    window.toggle3DExploded = function () {
      isExploded = !isExploded;
      const f1TargetY = isExploded ? 3.5 : 0;
      const roofTargetY = isExploded ? 6.5 : 0;

      if (typeof gsap !== 'undefined') {
        gsap.to(firstFloorGroup.position, { y: f1TargetY, duration: 1.4, ease: 'power3.inOut' });
        gsap.to(roofLevelGroup.position, { y: roofTargetY, duration: 1.6, ease: 'power3.inOut' });
      } else {
        firstFloorGroup.position.y = f1TargetY;
        roofLevelGroup.position.y = roofTargetY;
      }

      const btn = document.getElementById('btnExploded');
      if (btn) btn.classList.toggle('active', isExploded);
    };

    // Lighting Mode Presets
    window.set3DLighting = function (mode) {
      activeLighting = mode;
      document.querySelectorAll('[data-lighting]').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`[data-lighting="${mode}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      if (typeof gsap === 'undefined') return;

      if (mode === 'day') {
        gsap.to(scene.background, { r: 0.05, g: 0.06, b: 0.08, duration: 0.8 });
        gsap.to(sunLight, { intensity: 1.4, duration: 0.8 });
        gsap.to(sunLight.color, { r: 1.0, g: 0.93, b: 0.86, duration: 0.8 });
        gsap.to(sunLight.position, { x: 14, y: 18, z: 10, duration: 0.8 });
        gsap.to(ambientLight, { intensity: 0.6, duration: 0.8 });
        gsap.to(interiorLightG, { intensity: 1.0, duration: 0.8 });
        gsap.to(interiorLightF1, { intensity: 0.8, duration: 0.8 });
      } else if (mode === 'golden') {
        gsap.to(scene.background, { r: 0.08, g: 0.06, b: 0.06, duration: 0.8 });
        gsap.to(sunLight, { intensity: 1.8, duration: 0.8 });
        gsap.to(sunLight.color, { r: 1.0, g: 0.65, b: 0.3, duration: 0.8 });
        gsap.to(sunLight.position, { x: 18, y: 5, z: 12, duration: 0.8 });
        gsap.to(ambientLight, { intensity: 0.45, duration: 0.8 });
        gsap.to(interiorLightG, { intensity: 2.2, duration: 0.8 });
        gsap.to(interiorLightF1, { intensity: 2.0, duration: 0.8 });
      } else if (mode === 'night') {
        gsap.to(scene.background, { r: 0.02, g: 0.025, b: 0.035, duration: 0.8 });
        gsap.to(sunLight, { intensity: 0.1, duration: 0.8 });
        gsap.to(sunLight.color, { r: 0.3, g: 0.4, b: 0.6, duration: 0.8 });
        gsap.to(ambientLight, { intensity: 0.25, duration: 0.8 });
        gsap.to(interiorLightG, { intensity: 3.5, duration: 0.8 });
        gsap.to(interiorLightF1, { intensity: 3.0, duration: 0.8 });
        gsap.to(poolLight, { intensity: 2.0, duration: 0.8 });
      }
    };

    // Camera View Presets
    window.set3DViewPreset = function (preset) {
      document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`[data-preset="${preset}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      if (typeof gsap === 'undefined' || !controls) return;

      if (preset === 'iso') {
        gsap.to(camera.position, { x: 11, y: 7.5, z: 12, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(controls.target, { x: 0, y: 1.8, z: 0, duration: 1.2, ease: 'power2.inOut' });
      } else if (preset === 'front') {
        gsap.to(camera.position, { x: 0, y: 2.2, z: 14, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(controls.target, { x: 0, y: 2.2, z: 0, duration: 1.2, ease: 'power2.inOut' });
      } else if (preset === 'top') {
        gsap.to(camera.position, { x: 0.01, y: 18, z: 0.01, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power2.inOut' });
      }
    };

    // Reset Camera
    window.reset3DCamera = function () {
      if (typeof gsap !== 'undefined' && controls) {
        gsap.to(camera.position, { x: 11, y: 7.5, z: 12, duration: 1.0, ease: 'power2.inOut' });
        gsap.to(controls.target, { x: 0, y: 1.8, z: 0, duration: 1.0, ease: 'power2.inOut' });
      }
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

    // --- Animation & Render Loop ---
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
      updateHotspots();

      // Telemetry updates every 30 frames
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
    console.log('SLTG 3D Architectural Three.js Engine Initialized Successfully.');
  }

  // Auto trigger
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();
