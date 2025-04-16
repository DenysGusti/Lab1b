# Claim

In this lab, I have implemented the following tasks:

## T1: Camera position and 3D-shapes (20%)

I created a scene containing 9 3D shapes, including cubes, octahedrons, a bunny, a teapot, and a tetrahedron. The camera
starts at the positive z-axis (z = 10), and the shapes are rendered in 3D space. Each face of the shapes has a different
color for easy visualization of transformations, except for the OBJ models, which faces are random.

## T2: Add user interaction to move world/camera (20%)

I implemented user interactions to move the camera in the scene using the arrow keys. Additionally, mouse dragging is
supported to move the camera, which affects its position in world coordinates. There is no rotational component in the
camera's movement. Mouse-controlled camera movement works only on the canvas.

## T3: Add user interaction with the objects (40%)

I added keyboard-based controls for selecting and interacting with shapes:

### a) Selection (10%)

The user can select individual shapes by pressing keys '1' to '9'. The selected shape's coordinate system is
highlighted, and transformations apply to its local coordinate system. Pressing '0' selects all shapes for global
transformations. The spacebar allows toggling between camera and object/global transformations.

### b) Scaling (10%)

The user can scale shapes along the x, y, and z axes using the 'a/A', 'b/B', and 'c/C' keys.

### c) Rotations (10%)

The user can rotate shapes around the x, y, and z axes using the 'i/k', 'o/u', and 'l/j' keys.

### d) Translations (10%)

The user can move the shapes in all directions using the arrow keys and additional keys for forward/backward movement.

I also included an instruction near the canvas.

## T4: Use 3D-models (20%)

I implemented functionality to import and render OBJ 3D models. The OBJ files are parsed, and their data is used to
display objects within the scene. Some 3D OBJ models are initially placed on the screen. I also added a button to upload
an OBJ file, as was shown in the tutorial.

---

## Tested Environments

### Development Computer:

- **OS:** Windows 11
- **Browser:** Google Chrome 134.0.6998.89 (64-bit)

### Testing Computer:

- **OS:**  macOS Sequoia 15.1
- **Browser:** Safari 18.1 (20619.2.8.11.10)

---

## Additional And General Remarks:

The bunny model has several holes at the bottom, so since I enabled gl.enable(gl.CULL_FACE), if you look inside the
bunny, the back side will have the background color because the triangles pointing away from the viewer won't be
visible.

---