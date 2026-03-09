"use client";

import { useEffect, useRef } from "react";

// Lat/lng of all 48 qualified nations (approximate centers)
const NATION_COORDS: [number, number][] = [
  // Host cities / North America
  [37.09, -95.71],  // USA
  [56.13, -106.35], // Canada
  [23.63, -102.55], // Mexico
  // Europe
  [46.23, 2.21],    // France
  [40.46, -3.75],   // Spain
  [51.17, 10.45],   // Germany
  [55.38, -3.44],   // England
  [41.87, 12.57],   // Italy
  [52.13, 5.29],    // Netherlands
  [46.82, 8.23],    // Switzerland
  [50.50, 4.47],    // Belgium
  [38.72, -9.14],   // Portugal
  [52.52, 20.07],   // Poland
  [62.18, 25.75],   // Finland
  [56.26, 9.50],    // Denmark
  [60.13, 18.64],   // Sweden
  [52.68, -7.62],   // Ireland
  [52.13, -0.86],   // Wales
  [44.02, 21.01],   // Serbia
  [45.10, 15.20],   // Croatia
  [56.88, 24.60],   // Latvia (proxy for smaller European teams)
  [47.52, 14.55],   // Austria
  [39.07, 21.82],   // Greece
  [46.07, 14.50],   // Slovenia
  // South America
  [-14.24, -51.93], // Brazil
  [-38.42, -63.62], // Argentina
  [4.57, -74.30],   // Colombia
  [-1.83, -78.18],  // Ecuador
  [-23.44, -58.44], // Paraguay
  [-32.52, -55.77], // Uruguay
  // Africa
  [7.95, -1.02],    // Ghana
  [9.08, 8.68],     // Nigeria
  [7.54, -5.55],    // Cameroon (Ivory Coast proxy)
  [3.85, 11.50],    // Cameroon
  [-6.37, 34.89],   // Tanzania (proxy E. Africa)
  [31.79, -7.09],   // Morocco
  [28.03, 1.66],    // Algeria
  [34.80, 10.18],   // Tunisia
  [-30.56, 22.94],  // South Africa
  // Asia
  [35.86, 104.20],  // China (not qualified, but placeholder)
  [36.20, 138.25],  // Japan
  [35.91, 127.77],  // South Korea
  [25.35, 51.18],   // Qatar
  [23.42, 53.85],   // UAE
  [32.43, 53.69],   // Iran
  [15.87, 100.99],  // Thailand
  // Oceania
  [-40.90, 174.89], // New Zealand
  [-25.27, 133.78], // Australia
];

function latLngToSphere(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

export default function GlobeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup: (() => void) | undefined;

    // Dynamically import Three.js to keep bundle size manageable
    import("three").then((THREE) => {
      if (!container) return;

      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const isMobile = width < 640;
      const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 3.2;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";

      const globeGroup = new THREE.Group();
      globeGroup.rotation.x = 0.17; // ~10 degrees tilt
      scene.add(globeGroup);

      const radius = 1.2;

      // Create wireframe latitude/longitude dot grid
      const dotGeo = new THREE.BufferGeometry();
      const dotPositions: number[] = [];
      const dotColors: number[] = [];
      const latStep = isMobile ? 18 : 12;
      const lngStep = isMobile ? 18 : 12;

      for (let lat = -80; lat <= 80; lat += latStep) {
        for (let lng = -180; lng < 180; lng += lngStep) {
          const [x, y, z] = latLngToSphere(lat, lng, radius);
          dotPositions.push(x, y, z);
          dotColors.push(0.3, 0.35, 0.45); // muted blue-gray
        }
      }

      dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
      dotGeo.setAttribute("color", new THREE.Float32BufferAttribute(dotColors, 3));

      const dotMat = new THREE.PointsMaterial({
        size: isMobile ? 1.5 : 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true,
      });

      const dotMesh = new THREE.Points(dotGeo, dotMat);
      globeGroup.add(dotMesh);

      // Latitude rings (wireframe circles)
      for (let lat = -60; lat <= 60; lat += 30) {
        const ringPoints: THREE.Vector3[] = [];
        const segments = isMobile ? 36 : 64;
        for (let i = 0; i <= segments; i++) {
          const lng = (i / segments) * 360 - 180;
          const [x, y, z] = latLngToSphere(lat, lng, radius);
          ringPoints.push(new THREE.Vector3(x, y, z));
        }
        const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
        const ringMat = new THREE.LineBasicMaterial({
          color: 0x2a3550,
          transparent: true,
          opacity: 0.15,
        });
        globeGroup.add(new THREE.Line(ringGeo, ringMat));
      }

      // Longitude lines
      for (let lng = -180; lng < 180; lng += 30) {
        const linePoints: THREE.Vector3[] = [];
        const segments = isMobile ? 24 : 48;
        for (let i = 0; i <= segments; i++) {
          const lat = (i / segments) * 160 - 80;
          const [x, y, z] = latLngToSphere(lat, lng, radius);
          linePoints.push(new THREE.Vector3(x, y, z));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x2a3550,
          transparent: true,
          opacity: 0.1,
        });
        globeGroup.add(new THREE.Line(lineGeo, lineMat));
      }

      // Nation dots (gold, glowing)
      const nationGeo = new THREE.BufferGeometry();
      const nationPositions: number[] = [];
      for (const [lat, lng] of NATION_COORDS) {
        const [x, y, z] = latLngToSphere(lat, lng, radius * 1.005);
        nationPositions.push(x, y, z);
      }
      nationGeo.setAttribute("position", new THREE.Float32BufferAttribute(nationPositions, 3));

      const nationMat = new THREE.PointsMaterial({
        size: isMobile ? 4 : 5,
        color: 0xd4a843,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });

      const nationDots = new THREE.Points(nationGeo, nationMat);
      globeGroup.add(nationDots);

      // Outer glow ring
      const glowGeo = new THREE.RingGeometry(radius * 1.02, radius * 1.06, 64);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xd4a843,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      globeGroup.add(glowMesh);

      // Animation
      let animId: number;
      const animate = () => {
        globeGroup.rotation.y += 0.0017; // ~1 rotation per 60s
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };
      animate();

      // Resize handler
      const onResize = () => {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        scene.clear();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  );
}
