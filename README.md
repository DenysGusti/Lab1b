# Claim

In this lab, I have implemented the following tasks:

## T1: (15%) Shade the models - Gouraud/diffuse



## T2: (15%) Shade the models - Gouraud/specular



## T3: (20%) Shade the models - Phong/diffuse



## T4: (20%) Shade the models - Phong/specular



## T5: (30%) Add additional user interaction with the shapes and lights

### a) selection



### b) Light transformations



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
visible. Selecting active lighting and shading models the second time gives the base shader. The light coordinate system
is also displayed when selected. I also implemented a bounding box as shown in the tutorium and fixed the local and
global transformations.

---