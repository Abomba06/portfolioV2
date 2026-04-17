import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Scene,
  TorusGeometry,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

class NodeFileReader {
  constructor() {
    this.result = null;
    this.onloadend = null;
  }

  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    if (typeof this.onloadend === "function") {
      this.onloadend();
    }
  }

  async readAsDataURL(blob) {
    const buffer = Buffer.from(await blob.arrayBuffer());
    this.result = `data:${blob.type || "application/octet-stream"};base64,${buffer.toString("base64")}`;
    if (typeof this.onloadend === "function") {
      this.onloadend();
    }
  }
}

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = NodeFileReader;
}

function createRocketScene() {
  const scene = new Scene();
  const root = new Group();
  root.name = "rocket_root";
  root.rotation.set(0.12, 0.3, -0.08);

  const body = new Mesh(
    new CylinderGeometry(0.78, 0.92, 5.2, 48, 1, false),
    new MeshStandardMaterial({
      color: new Color("#bcc7d9"),
      metalness: 0.85,
      roughness: 0.23,
      emissive: new Color("#183653"),
      emissiveIntensity: 0.18,
    }),
  );
  body.name = "rocket_body";
  body.position.set(0, 0.8, 0);

  const nose = new Mesh(
    new ConeGeometry(0.78, 2.1, 48),
    new MeshStandardMaterial({
      color: new Color("#dce6f3"),
      metalness: 0.75,
      roughness: 0.2,
      emissive: new Color("#102340"),
      emissiveIntensity: 0.25,
    }),
  );
  nose.name = "rocket_nose";
  nose.position.set(0, 4, 0);

  const engineMount = new Mesh(
    new CylinderGeometry(0.92, 1.05, 0.9, 48),
    new MeshStandardMaterial({
      color: new Color("#596579"),
      metalness: 0.8,
      roughness: 0.38,
    }),
  );
  engineMount.name = "rocket_engine_mount";
  engineMount.position.set(0, -2.1, 0);

  root.add(body, nose, engineMount);

  [
    { name: "band_lower", y: -0.95 },
    { name: "band_core", y: 0.7 },
    { name: "band_upper", y: 2.25 },
  ].forEach(({ name, y }) => {
    const band = new Mesh(
      new TorusGeometry(0.84, 0.04, 20, 64),
      new MeshStandardMaterial({
        color: new Color("#7bd8ff"),
        emissive: new Color("#66d5ff"),
        emissiveIntensity: 0.65,
        metalness: 0.2,
        roughness: 0.18,
      }),
    );
    band.name = name;
    band.position.set(0, y, 0);
    band.rotation.set(Math.PI / 2, 0, 0);
    root.add(band);
  });

  [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach((rotation, index) => {
    const fin = new Mesh(
      new BoxGeometry(0.14, 1.75, 1.05),
      new MeshStandardMaterial({
        color: new Color("#6d7687"),
        metalness: 0.78,
        roughness: 0.34,
      }),
    );
    fin.name = `fin_${index}`;
    fin.position.set(Math.sin(rotation) * 0.98, -1.8, Math.cos(rotation) * 0.98);
    fin.rotation.set(0, rotation, rotation % Math.PI === 0 ? -0.22 : 0.22);
    root.add(fin);
  });

  [
    [0, 0],
    [0.58, 0],
    [-0.58, 0],
    [0, 0.58],
    [0, -0.58],
  ].forEach(([x, z], index) => {
    const thrusterGroup = new Group();
    thrusterGroup.name = `thruster_group_${index}`;
    thrusterGroup.position.set(x, -3.15, z);

    const thruster = new Mesh(
      new CylinderGeometry(0.2, 0.3, 1.15, 32),
      new MeshStandardMaterial({
        color: new Color("#4f5564"),
        metalness: 0.82,
        roughness: 0.28,
      }),
    );
    thruster.name = `thruster_${index}`;

    const glow = new Mesh(
      new ConeGeometry(0.18, 1.3, 24),
      new MeshBasicMaterial({
        color: new Color("#56d3ff"),
        transparent: true,
        opacity: 0.72,
      }),
    );
    glow.name = `thruster_glow_${index}`;
    glow.position.set(0, -0.78, 0);

    thrusterGroup.add(thruster, glow);
    root.add(thrusterGroup);
  });

  scene.add(root);
  scene.updateMatrixWorld(true);
  return scene;
}

async function exportRocket() {
  const scene = createRocketScene();
  const exporter = new GLTFExporter();

  const result = await new Promise((resolveExport, rejectExport) => {
    exporter.parse(
      scene,
      (gltf) => resolveExport(gltf),
      (error) => rejectExport(error),
      { binary: true, onlyVisible: true },
    );
  });

  if (!(result instanceof ArrayBuffer)) {
    throw new Error("Expected binary GLB output.");
  }

  const outputPath = resolve("public/models/rocket.glb");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(result));
}

exportRocket().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
