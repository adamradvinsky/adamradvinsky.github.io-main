
// const toonVS = `
// varying vec3 vNormal;
// varying vec3 vViewPosition;

// void main() {
//     vNormal = normalize(normalMatrix * normal);
//     vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const toonFS = `
// uniform vec3 uLightPos;
// uniform vec3 uBaseColor;

// varying vec3 vNormal;
// varying vec3 vViewPosition;

// void main() {
//     vec3 normal = normalize(vNormal);

//     // Light in view space
//     vec3 lightPosView = (viewMatrix * vec4(uLightPos, 1.0)).xyz;
//     vec3 lightDir = normalize(lightPosView - vViewPosition);

//     float d = dot(normal, lightDir);

//     // 🔥 HARD TOON STEPS
//     float intensity;
//     if (d > 0.75) intensity = 1.0;
//     else if (d > 0.4) intensity = 0.7;
//     else if (d > 0.1) intensity = 0.4;
//     else intensity = 0.2;

//     // small ambient so shadows aren't pure black
//     float ambient = 0.15;

//     vec3 color = uBaseColor * (intensity + ambient);

//     gl_FragColor = vec4(color, 1.0);
// }
// `;

// const outlineVS = `
// uniform float uThickness;

// void main() {
//     vec3 newPosition = position + normal * uThickness;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
// }
// `;

// const outlineFS = `
// void main() {
//     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//     }
//     `;


// //sphere
// const sphereMesh = new THREE.SphereGeometry(3);

// const sphereMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         // Uniforms must match the names in the shader exactly
//         uLightPos: { value: spotLight.position },
//         uBaseColor: { value: new THREE.Color(0xff3333) }
//     },
//     vertexShader: toonVS,
//     fragmentShader: toonFS
// });

// const sphere = new THREE.Mesh(sphereMesh, sphereMaterial);
// sphere.position.set(0, 0, 0);
// scene.add(sphere);

// const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x00ff01});
// const outlineMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         uThickness: { value: 0.1 }
//     },
//     vertexShader: outlineVS,
//     fragmentShader: outlineFS,
//     side: THREE.BackSide // 👈 IMPORTANT
// });

// const outlineMesh = new THREE.Mesh(sphereMesh, outlineMaterial);
// sphere.add(outlineMesh); // attach to sphere

