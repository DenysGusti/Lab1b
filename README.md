# Claim

In this lab, I have implemented the following tasks:

## T1: (15%) Shade the models - Gouraud/diffuse



## T2: (15%) Shade the models - Gouraud/specular



## T3: (20%) Shade the models - Phong/diffuse



## T4: (20%) Shade the models - Phong/specular



## T5: (30%) Add additional user interaction with the shapes and lights

### a) selection

Lighting and shading models are only selectable in camera mode, as the control keys 't' and 'k' are shared across modes.

### b) Light transformations

The light coordinate system is also displayed when selected. Light source types are only selectable outside of camera
mode, since the control key 't' is shared across modes.

## B1: (10%) Implement shadows

Resource: https://youtu.be/watch?v=UnFudL21Uq4

## B2: (5%) Cooke-Torrance illumination model

Resource: https://www.cs.cornell.edu/courses/cs5625/2013sp/lectures/Lec2ShadingModelsWeb.pdf

The model is only selectable in camera mode because the control key 'k' is shared across modes.

## B3: (5%) Spot-light source

Resource: https://learnopengl.com/book/book_preview.pdf, page 147

The plane was subdivided into tiles to make the spotlight beam visible on the ground plane when using Gouraud shading.

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
visible. I also implemented a bounding box as demonstrated in the tutorium and fixed both local and global
transformations. The type of light source is selected using a uniform variable to avoid duplicating shader code. The
camera can also move forwards and backwards. Only eye vector is in view space when doing lightning calculations, and it
somehow works.

---