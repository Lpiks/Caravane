require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Chassis = require('./src/models/Chassis');

const sprinterParts = [
  {
    "id": "floor",
    "name": "Main Floor",
    "shape": "box",
    "size": [593, 179, 10],
    "offset": [0, 20, 0],
    "rotation": [0, 0, 0],
    "color": "#3A3D40",
    "opacity": 1,
    "metalness": 0.2,
    "roughness": 0.8
  },
  {
    "id": "wheel-1",
    "name": "Wheel Front Left",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [183, 0, -74.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-2",
    "name": "Wheel Front Right",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [183, 0, 74.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-3",
    "name": "Wheel Rear Left",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [-183, 0, -74.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-4",
    "name": "Wheel Rear Right",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [-183, 0, 74.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "hood-base",
    "name": "Engine Bay Base",
    "shape": "box",
    "size": [100, 179, 70],
    "offset": [246.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "hood-slope",
    "name": "Aerodynamic Hood",
    "shape": "wedge",
    "size": [100, 179, 30],
    "offset": [246.5, 100, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "front-grill-panel",
    "name": "Front Grill Panel",
    "shape": "box",
    "size": [4, 179, 70],
    "offset": [294.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "front-bumper",
    "name": "Front Bumper",
    "shape": "box",
    "size": [20, 179, 30],
    "offset": [301.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "front-headlight-l",
    "name": "Front Headlight Left",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [297.5, 79, -55],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "front-headlight-r",
    "name": "Front Headlight Right",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [297.5, 79, 55],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "lower-body-left",
    "name": "Lower Body Shell Left",
    "shape": "box",
    "size": [493, 4, 100],
    "offset": [-50, 30, -87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-right",
    "name": "Lower Body Shell Right",
    "shape": "box",
    "size": [493, 4, 100],
    "offset": [-50, 30, 87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-rear",
    "name": "Lower Body Shell Rear",
    "shape": "box",
    "size": [4, 179, 100],
    "offset": [-294.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "rear-bumper",
    "name": "Rear Bumper",
    "shape": "box",
    "size": [20, 179, 30],
    "offset": [-306.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "upper-body-glass-left",
    "name": "Upper Body Glass Left",
    "shape": "window",
    "size": [443, 4, 120],
    "offset": [-75, 130, -87.5],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "upper-body-glass-right",
    "name": "Upper Body Glass Right",
    "shape": "window",
    "size": [443, 4, 120],
    "offset": [-75, 130, 87.5],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "high-roof-lower",
    "name": "High Roof Lower Panel",
    "shape": "box",
    "size": [443, 179, 5],
    "offset": [-75, 250, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "high-roof-upper",
    "name": "High Roof Upper Cap",
    "shape": "box",
    "size": [423, 169, 15],
    "offset": [-75, 252.5, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "corner-rear-left",
    "name": "Corner Rear Left",
    "shape": "box",
    "size": [10, 5, 120],
    "offset": [-291.5, 130, -87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "corner-rear-right",
    "name": "Corner Rear Right",
    "shape": "box",
    "size": [10, 5, 120],
    "offset": [-291.5, 130, 87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-wedge-left",
    "name": "A-Pillar Wedge Left",
    "shape": "wedge",
    "size": [50, 4, 120],
    "offset": [171.5, 130, -87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-wedge-right",
    "name": "A-Pillar Wedge Right",
    "shape": "wedge",
    "size": [50, 4, 120],
    "offset": [171.5, 130, 87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "windshield",
    "name": "Front Windshield",
    "shape": "window",
    "size": [4, 179, 130],
    "offset": [171.5, 125, 0],
    "rotation": [0, 0, -22.6],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "pillar-b-left",
    "name": "Pillar B Left",
    "shape": "box",
    "size": [15, 5, 120],
    "offset": [41.5, 130, -87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-b-right",
    "name": "Pillar B Right",
    "shape": "box",
    "size": [15, 5, 120],
    "offset": [41.5, 130, 87.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "sliding-door",
    "name": "Sliding Door Panel",
    "shape": "box",
    "size": [130, 4, 182],
    "offset": [-18, 30, 90],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "sliding-door-window",
    "name": "Sliding Door Window",
    "shape": "window",
    "size": [90, 5, 70],
    "offset": [-18, 135, 90],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "sliding-track",
    "name": "Sliding Track Rail",
    "shape": "box",
    "size": [260, 2, 5],
    "offset": [-78, 127.5, 91.5],
    "rotation": [0, 0, 0],
    "color": "#333333"
  },
  {
    "id": "left-barn-door",
    "name": "Left Barn Door Panel",
    "shape": "box",
    "size": [4, 88, 210],
    "offset": [-296.5, 35, -45.7],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "left-barn-door-window",
    "name": "Left Barn Door Window",
    "shape": "window",
    "size": [5, 60, 70],
    "offset": [-296.5, 145, -45.7],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "right-barn-door",
    "name": "Right Barn Door Panel",
    "shape": "box",
    "size": [4, 88, 210],
    "offset": [-296.5, 35, 45.8],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "right-barn-door-window",
    "name": "Right Barn Door Window",
    "shape": "window",
    "size": [5, 60, 70],
    "offset": [-296.5, 145, 45.8],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "wheel-arch-left",
    "name": "Wheel Arch Left",
    "shape": "box",
    "size": [90, 22, 40],
    "offset": [-183, 30, -78.5],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-right",
    "name": "Wheel Arch Right",
    "shape": "box",
    "size": [90, 22, 40],
    "offset": [-183, 30, 78.5],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "cockpit-block",
    "name": "Driver Cockpit Console",
    "shape": "box",
    "size": [40, 159, 40],
    "offset": [161.5, 92.5, 0],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "steering-wheel",
    "name": "Steering Wheel",
    "shape": "cylinder",
    "size": [30, 30, 5],
    "offset": [151.5, 127.5, -40],
    "rotation": [0, 0, 45],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-stand",
    "name": "Driver Seat Base",
    "shape": "cylinder",
    "size": [16, 16, 30],
    "offset": [101.5, 60, -40],
    "rotation": [0, 0, 0],
    "color": "#1E293B",
    "metalness": 0.8,
    "roughness": 0.2
  },
  {
    "id": "driver-seat-cushion",
    "name": "Driver Seat Cushion",
    "shape": "box",
    "size": [50, 50, 10],
    "offset": [101.5, 90, -40],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-back",
    "name": "Driver Seat Backrest",
    "shape": "box",
    "size": [10, 50, 50],
    "offset": [81.5, 100, -40],
    "rotation": [0, 0, 6],
    "color": "#22252A"
  },
  {
    "id": "passenger-seat-stand",
    "name": "Passenger Seat Base",
    "shape": "cylinder",
    "size": [16, 16, 30],
    "offset": [101.5, 60, 40],
    "rotation": [0, 0, 0],
    "color": "#1E293B",
    "metalness": 0.8,
    "roughness": 0.2
  },
  {
    "id": "passenger-seat-cushion",
    "name": "Passenger Seat Cushion",
    "shape": "box",
    "size": [50, 50, 10],
    "offset": [101.5, 90, 40],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "passenger-seat-back",
    "name": "Passenger Seat Backrest",
    "shape": "box",
    "size": [10, 50, 50],
    "offset": [81.5, 100, 40],
    "rotation": [0, 0, 6],
    "color": "#22252A"
  }
];

const transitParts = [
  {
    "id": "floor",
    "name": "Main Floor",
    "shape": "box",
    "size": [598, 180, 10],
    "offset": [0, 20, 0],
    "rotation": [0, 0, 0],
    "color": "#3A3D40",
    "opacity": 1,
    "metalness": 0.2,
    "roughness": 0.8
  },
  {
    "id": "wheel-1",
    "name": "Wheel Front Left",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [187.5, 0, -75],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-2",
    "name": "Wheel Front Right",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [187.5, 0, 75],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-3",
    "name": "Wheel Rear Left",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [-187.5, 0, -75],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-4",
    "name": "Wheel Rear Right",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [-187.5, 0, 75],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "hood-base",
    "name": "Engine Bay Base",
    "shape": "box",
    "size": [95, 180, 70],
    "offset": [251.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "hood-slope",
    "name": "Aerodynamic Hood",
    "shape": "wedge",
    "size": [95, 180, 30],
    "offset": [251.5, 100, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "front-grill-panel",
    "name": "Front Grill Panel",
    "shape": "box",
    "size": [4, 180, 70],
    "offset": [297, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "front-bumper",
    "name": "Front Bumper",
    "shape": "box",
    "size": [20, 180, 30],
    "offset": [309, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "front-headlight-l",
    "name": "Front Headlight Left",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [300, 79, -55],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "front-headlight-r",
    "name": "Front Headlight Right",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [300, 79, 55],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "lower-body-left",
    "name": "Lower Body Shell Left",
    "shape": "box",
    "size": [503, 4, 100],
    "offset": [-47.5, 30, -88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-right",
    "name": "Lower Body Shell Right",
    "shape": "box",
    "size": [503, 4, 100],
    "offset": [-47.5, 30, 88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-rear",
    "name": "Lower Body Shell Rear",
    "shape": "box",
    "size": [4, 180, 100],
    "offset": [-297, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "rear-bumper",
    "name": "Rear Bumper",
    "shape": "box",
    "size": [20, 180, 30],
    "offset": [-309, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "upper-body-glass-left",
    "name": "Upper Body Glass Left",
    "shape": "window",
    "size": [448, 4, 128],
    "offset": [-75, 130, -88],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "upper-body-glass-right",
    "name": "Upper Body Glass Right",
    "shape": "window",
    "size": [448, 4, 128],
    "offset": [-75, 130, 88],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "high-roof-lower",
    "name": "High Roof Lower Panel",
    "shape": "box",
    "size": [448, 180, 5],
    "offset": [-75, 258, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "high-roof-upper",
    "name": "High Roof Upper Cap",
    "shape": "box",
    "size": [428, 170, 15],
    "offset": [-75, 260.5, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "corner-rear-left",
    "name": "Corner Rear Left",
    "shape": "box",
    "size": [10, 5, 128],
    "offset": [-294, 130, -88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "corner-rear-right",
    "name": "Corner Rear Right",
    "shape": "box",
    "size": [10, 5, 128],
    "offset": [-294, 130, 88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-wedge-left",
    "name": "A-Pillar Wedge Left",
    "shape": "wedge",
    "size": [55, 4, 128],
    "offset": [176.5, 130, -88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-wedge-right",
    "name": "A-Pillar Wedge Right",
    "shape": "wedge",
    "size": [55, 4, 128],
    "offset": [176.5, 130, 88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "windshield",
    "name": "Front Windshield",
    "shape": "window",
    "size": [4, 180, 139.3],
    "offset": [176.5, 124, 0],
    "rotation": [0, 0, -23.3],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "pillar-b-left",
    "name": "Pillar B Left",
    "shape": "box",
    "size": [15, 5, 128],
    "offset": [149, 130, -88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-b-right",
    "name": "Pillar B Right",
    "shape": "box",
    "size": [15, 5, 128],
    "offset": [149, 130, 88],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "sliding-door",
    "name": "Sliding Door Panel",
    "shape": "box",
    "size": [130, 4, 188],
    "offset": [84, 30, 90.5],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "sliding-door-window",
    "name": "Sliding Door Window",
    "shape": "window",
    "size": [90, 5, 70],
    "offset": [84, 135, 90.5],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "sliding-track",
    "name": "Sliding Track Rail",
    "shape": "box",
    "size": [260, 2, 5],
    "offset": [19, 127.5, 92],
    "rotation": [0, 0, 0],
    "color": "#333333"
  },
  {
    "id": "left-barn-door",
    "name": "Left Barn Door Panel",
    "shape": "box",
    "size": [4, 88.5, 218],
    "offset": [-297, 35, -45.7],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "left-barn-door-window",
    "name": "Left Barn Door Window",
    "shape": "window",
    "size": [5, 60, 70],
    "offset": [-297, 145, -45.7],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "right-barn-door",
    "name": "Right Barn Door Panel",
    "shape": "box",
    "size": [4, 88.5, 218],
    "offset": [-297, 35, 45.8],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "right-barn-door-window",
    "name": "Right Barn Door Window",
    "shape": "window",
    "size": [5, 60, 70],
    "offset": [-297, 145, 45.8],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "wheel-arch-left",
    "name": "Wheel Arch Left",
    "shape": "box",
    "size": [90, 22, 40],
    "offset": [-187.5, 30, -79],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-right",
    "name": "Wheel Arch Right",
    "shape": "box",
    "size": [90, 22, 40],
    "offset": [-187.5, 30, 79],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "cockpit-block",
    "name": "Driver Cockpit Console",
    "shape": "box",
    "size": [40, 160, 40],
    "offset": [169, 92.5, 0],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "steering-wheel",
    "name": "Steering Wheel",
    "shape": "cylinder",
    "size": [30, 30, 5],
    "offset": [159, 127.5, -40],
    "rotation": [0, 0, 45],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-stand",
    "name": "Driver Seat Base",
    "shape": "cylinder",
    "size": [16, 16, 30],
    "offset": [109, 60, -40],
    "rotation": [0, 0, 0],
    "color": "#1E293B",
    "metalness": 0.8,
    "roughness": 0.2
  },
  {
    "id": "driver-seat-cushion",
    "name": "Driver Seat Cushion",
    "shape": "box",
    "size": [50, 50, 10],
    "offset": [109, 90, -40],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-back",
    "name": "Driver Seat Backrest",
    "shape": "box",
    "size": [10, 50, 50],
    "offset": [89, 100, -40],
    "rotation": [0, 0, 6],
    "color": "#22252A"
  },
  {
    "id": "passenger-seat-stand",
    "name": "Passenger Seat Base",
    "shape": "cylinder",
    "size": [16, 16, 30],
    "offset": [109, 60, 40],
    "rotation": [0, 0, 0],
    "color": "#1E293B",
    "metalness": 0.8,
    "roughness": 0.2
  },
  {
    "id": "passenger-seat-cushion",
    "name": "Passenger Seat Cushion",
    "shape": "box",
    "size": [50, 50, 10],
    "offset": [109, 90, 40],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "passenger-seat-back",
    "name": "Passenger Seat Backrest",
    "shape": "box",
    "size": [10, 50, 50],
    "offset": [89, 100, 40],
    "rotation": [0, 0, 6],
    "color": "#22252A"
  }
];

const masterParts = [
  {
    "id": "floor",
    "name": "Main Floor",
    "shape": "box",
    "size": [555, 181, 10],
    "offset": [0, 20, 0],
    "rotation": [0, 0, 0],
    "color": "#3A3D40",
    "opacity": 1,
    "metalness": 0.2,
    "roughness": 0.8
  },
  {
    "id": "wheel-1",
    "name": "Wheel Front Left",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [184, 0, -75.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-2",
    "name": "Wheel Front Right",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [184, 0, 75.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-3",
    "name": "Wheel Rear Left",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [-184, 0, -75.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-4",
    "name": "Wheel Rear Right",
    "shape": "wheel",
    "size": [70, 25, 70],
    "offset": [-184, 0, 75.5],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "hood-base",
    "name": "Engine Bay Base",
    "shape": "box",
    "size": [80, 181, 70],
    "offset": [237.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "hood-slope",
    "name": "Aerodynamic Hood",
    "shape": "wedge",
    "size": [80, 181, 30],
    "offset": [237.5, 100, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "front-grill-panel",
    "name": "Front Grill Panel",
    "shape": "box",
    "size": [4, 181, 70],
    "offset": [275.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "front-bumper",
    "name": "Front Bumper",
    "shape": "box",
    "size": [20, 181, 30],
    "offset": [287.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "front-headlight-l",
    "name": "Front Headlight Left",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [278.5, 79, -55],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "front-headlight-r",
    "name": "Front Headlight Right",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [278.5, 79, 55],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "lower-body-left",
    "name": "Lower Body Shell Left",
    "shape": "box",
    "size": [475, 4, 100],
    "offset": [-40, 30, -88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-right",
    "name": "Lower Body Shell Right",
    "shape": "box",
    "size": [475, 4, 100],
    "offset": [-40, 30, 88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-rear",
    "name": "Lower Body Shell Rear",
    "shape": "box",
    "size": [4, 181, 100],
    "offset": [-275.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "rear-bumper",
    "name": "Rear Bumper",
    "shape": "box",
    "size": [20, 181, 30],
    "offset": [-287.5, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "upper-body-glass-left",
    "name": "Upper Body Glass Left",
    "shape": "window",
    "size": [420, 4, 100],
    "offset": [-67.5, 130, -88.5],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "upper-body-glass-right",
    "name": "Upper Body Glass Right",
    "shape": "window",
    "size": [420, 4, 100],
    "offset": [-67.5, 130, 88.5],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "high-roof-lower",
    "name": "High Roof Lower Panel",
    "shape": "box",
    "size": [420, 181, 5],
    "offset": [-67.5, 230, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "high-roof-upper",
    "name": "High Roof Upper Cap",
    "shape": "box",
    "size": [400, 171, 15],
    "offset": [-67.5, 232.5, 0],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "corner-rear-left",
    "name": "Corner Rear Left",
    "shape": "box",
    "size": [10, 5, 100],
    "offset": [-272.5, 130, -88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "corner-rear-right",
    "name": "Corner Rear Right",
    "shape": "box",
    "size": [10, 5, 100],
    "offset": [-272.5, 130, 88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-wedge-left",
    "name": "A-Pillar Wedge Left",
    "shape": "wedge",
    "size": [60, 4, 100],
    "offset": [167.5, 130, -88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-wedge-right",
    "name": "A-Pillar Wedge Right",
    "shape": "wedge",
    "size": [60, 4, 100],
    "offset": [167.5, 130, 88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "windshield",
    "name": "Front Windshield",
    "shape": "window",
    "size": [4, 181, 116.6],
    "offset": [167.5, 122, 0],
    "rotation": [0, 0, -31],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "pillar-b-left",
    "name": "Pillar B Left",
    "shape": "box",
    "size": [15, 5, 100],
    "offset": [137.5, 130, -88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "pillar-b-right",
    "name": "Pillar B Right",
    "shape": "box",
    "size": [15, 5, 100],
    "offset": [137.5, 130, 88.5],
    "rotation": [0, 0, 0],
    "color": "#ffffff",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "sliding-door",
    "name": "Sliding Door Panel",
    "shape": "box",
    "size": [120, 4, 160],
    "offset": [77.5, 30, 89],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "sliding-door-window",
    "name": "Sliding Door Window",
    "shape": "window",
    "size": [90, 5, 60],
    "offset": [77.5, 135, 89],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "sliding-track",
    "name": "Sliding Track Rail",
    "shape": "box",
    "size": [240, 2, 5],
    "offset": [17.5, 127.5, 90.5],
    "rotation": [0, 0, 0],
    "color": "#333333"
  },
  {
    "id": "left-barn-door",
    "name": "Left Barn Door Panel",
    "shape": "box",
    "size": [4, 89.5, 190],
    "offset": [-275.5, 35, -45.7],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "left-barn-door-window",
    "name": "Left Barn Door Window",
    "shape": "window",
    "size": [5, 60, 60],
    "offset": [-275.5, 145, -45.7],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "right-barn-door",
    "name": "Right Barn Door Panel",
    "shape": "box",
    "size": [4, 89.5, 190],
    "offset": [-275.5, 35, 45.8],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "right-barn-door-window",
    "name": "Right Barn Door Window",
    "shape": "window",
    "size": [5, 60, 60],
    "offset": [-275.5, 145, 45.8],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.3,
    "metalness": 0.5,
    "roughness": 0.1
  },
  {
    "id": "wheel-arch-left",
    "name": "Wheel Arch Left",
    "shape": "box",
    "size": [90, 22, 40],
    "offset": [-184, 30, -79.5],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-right",
    "name": "Wheel Arch Right",
    "shape": "box",
    "size": [90, 22, 40],
    "offset": [-184, 30, 79.5],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "cockpit-block",
    "name": "Driver Cockpit Console",
    "shape": "box",
    "size": [40, 160, 40],
    "offset": [162.5, 92.5, 0],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "steering-wheel",
    "name": "Steering Wheel",
    "shape": "cylinder",
    "size": [30, 30, 5],
    "offset": [152.5, 127.5, -40],
    "rotation": [0, 0, 45],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-stand",
    "name": "Driver Seat Base",
    "shape": "cylinder",
    "size": [16, 16, 30],
    "offset": [102.5, 60, -40],
    "rotation": [0, 0, 0],
    "color": "#1E293B",
    "metalness": 0.8,
    "roughness": 0.2
  },
  {
    "id": "driver-seat-cushion",
    "name": "Driver Seat Cushion",
    "shape": "box",
    "size": [50, 50, 10],
    "offset": [102.5, 90, -40],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-back",
    "name": "Driver Seat Backrest",
    "shape": "box",
    "size": [10, 50, 50],
    "offset": [82.5, 100, -40],
    "rotation": [0, 0, 6],
    "color": "#22252A"
  },
  {
    "id": "passenger-seat-stand",
    "name": "Passenger Seat Base",
    "shape": "cylinder",
    "size": [16, 16, 30],
    "offset": [102.5, 60, 40],
    "rotation": [0, 0, 0],
    "color": "#1E293B",
    "metalness": 0.8,
    "roughness": 0.2
  },
  {
    "id": "passenger-seat-cushion",
    "name": "Passenger Seat Cushion",
    "shape": "box",
    "size": [50, 50, 10],
    "offset": [102.5, 90, 40],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "passenger-seat-back",
    "name": "Passenger Seat Backrest",
    "shape": "box",
    "size": [10, 50, 50],
    "offset": [82.5, 100, 40],
    "rotation": [0, 0, 6],
    "color": "#22252A"
  }
];

const schoolBusBaseParts = [
  {
    "id": "floor",
    "name": "Main Floor",
    "shape": "box",
    "size": [1152, 224, 10],
    "offset": [0, 20, 0],
    "rotation": [0, 0, 0],
    "color": "#3A3D40",
    "opacity": 1,
    "metalness": 0.2,
    "roughness": 0.8
  },
  {
    "id": "wheel-1",
    "name": "Wheel Front Left",
    "shape": "wheel",
    "size": [100, 30, 100],
    "offset": [280, 0, -97],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-2",
    "name": "Wheel Front Right",
    "shape": "wheel",
    "size": [100, 30, 100],
    "offset": [280, 0, 97],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-3",
    "name": "Wheel Rear Left",
    "shape": "wheel",
    "size": [100, 30, 100],
    "offset": [-280, 0, -97],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-4",
    "name": "Wheel Rear Right",
    "shape": "wheel",
    "size": [100, 30, 100],
    "offset": [-280, 0, 97],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "front-nose-lower",
    "name": "Front Nose Lower Panel",
    "shape": "box",
    "size": [4, 224, 100],
    "offset": [574, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#eab308"
  },
  {
    "id": "windshield",
    "name": "Front Windshield",
    "shape": "window",
    "size": [4, 224, 137],
    "offset": [574, 122, 0],
    "rotation": [0, 0, -5],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "lower-body-left",
    "name": "Lower Body Shell Left",
    "shape": "box",
    "size": [1152, 4, 100],
    "offset": [0, 30, -110],
    "rotation": [0, 0, 0],
    "color": "#eab308",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-right",
    "name": "Lower Body Shell Right",
    "shape": "box",
    "size": [1152, 4, 100],
    "offset": [0, 30, 110],
    "rotation": [0, 0, 0],
    "color": "#eab308",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-rear",
    "name": "Lower Body Shell Rear",
    "shape": "box",
    "size": [4, 224, 100],
    "offset": [-574, 30, 0],
    "color": "#eab308",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "upper-body-glass-left",
    "name": "Upper Body Glass Left",
    "shape": "window",
    "size": [1152, 4, 130],
    "offset": [0, 130, -110],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "upper-body-glass-right",
    "name": "Upper Body Glass Right",
    "shape": "window",
    "size": [1152, 4, 130],
    "offset": [0, 130, 110],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "rear-window",
    "name": "Rear Window Glass",
    "shape": "window",
    "size": [4, 224, 130],
    "offset": [-574, 130, 0],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "high-roof-lower",
    "name": "High Roof Lower Panel",
    "shape": "box",
    "size": [1152, 224, 5],
    "offset": [0, 260, 0],
    "rotation": [0, 0, 0],
    "color": "#eab308",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "high-roof-upper",
    "name": "High Roof Upper Cap",
    "shape": "box",
    "size": [1132, 214, 15],
    "offset": [0, 262.5, 0],
    "rotation": [0, 0, 0],
    "color": "#eab308",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "front-bumper",
    "name": "Front Bumper",
    "shape": "box",
    "size": [30, 224, 40],
    "offset": [591, 10, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "rear-bumper",
    "name": "Rear Bumper",
    "shape": "box",
    "size": [30, 224, 40],
    "offset": [-591, 10, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "left-passenger-door",
    "name": "Front Passenger Door",
    "shape": "box",
    "size": [100, 4, 230],
    "offset": [480, 30, 111],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "middle-passenger-door",
    "name": "Middle Passenger Door",
    "shape": "box",
    "size": [120, 4, 230],
    "offset": [0, 30, 111],
    "rotation": [0, 0, 0],
    "color": "#ef4444",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "wheel-arch-front-l",
    "name": "Wheel Arch Front Left",
    "shape": "box",
    "size": [120, 30, 30],
    "offset": [280, 30, -97],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-front-r",
    "name": "Wheel Arch Front Right",
    "shape": "box",
    "size": [120, 30, 30],
    "offset": [280, 30, 97],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-rear-l",
    "name": "Wheel Arch Rear Left",
    "shape": "box",
    "size": [120, 30, 30],
    "offset": [-280, 30, -97],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-rear-r",
    "name": "Wheel Arch Rear Right",
    "shape": "box",
    "size": [120, 30, 30],
    "offset": [-280, 30, 97],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "steering-wheel",
    "name": "Steering Wheel",
    "shape": "cylinder",
    "size": [30, 30, 5],
    "offset": [515, 127.5, -70],
    "rotation": [0, 0, 45],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-stand",
    "name": "Driver Seat Base",
    "shape": "cylinder",
    "size": [16, 16, 30],
    "offset": [460, 60, -70],
    "rotation": [0, 0, 0],
    "color": "#1E293B",
    "metalness": 0.8,
    "roughness": 0.2
  },
  {
    "id": "driver-seat-cushion",
    "name": "Driver Seat Cushion",
    "shape": "box",
    "size": [50, 50, 10],
    "offset": [460, 90, -70],
    "rotation": [0, 0, 0],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-back",
    "name": "Driver Seat Backrest",
    "shape": "box",
    "size": [10, 50, 60],
    "offset": [435, 100, -70],
    "rotation": [0, 0, 6],
    "color": "#22252A"
  },
  {
    "id": "cabin-divider-wall",
    "name": "Cabin Divider Wall",
    "shape": "box",
    "size": [4, 224, 230],
    "offset": [410, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#334155",
    "opacity": 0.3
  },
  {
    "id": "route-screen",
    "name": "LED Destination Screen",
    "shape": "box",
    "size": [4, 100, 20],
    "offset": [574, 235, 0],
    "color": "#111827"
  },
  {
    "id": "route-text",
    "name": "Route LED Display text",
    "shape": "text",
    "textString": "100 V8 ROUIBA",
    "size": [10, 10, 2],
    "offset": [577, 243, 0],
    "rotation": [0, 90, 0],
    "color": "#f59e0b"
  },
  {
    "id": "snvi-grille",
    "name": "Front Black Grille",
    "shape": "box",
    "size": [3, 100, 30],
    "offset": [575, 60, 0],
    "color": "#334155"
  },
  {
    "id": "snvi-logo",
    "name": "SNVI Grille Logo",
    "shape": "text",
    "textString": "SNVI",
    "size": [10, 10, 2],
    "offset": [576.5, 70, 0],
    "rotation": [0, 90, 0],
    "color": "#cbd5e1"
  },
  {
    "id": "headlight-l",
    "name": "Headlight Left",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [575, 55, -75],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "headlight-r",
    "name": "Headlight Right",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [575, 55, 75],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "indicator-l",
    "name": "Turn Indicator Left",
    "shape": "cylinder",
    "size": [2, 8, 8],
    "offset": [575, 55, -95],
    "rotation": [0, 0, 90],
    "color": "#d97706"
  },
  {
    "id": "indicator-r",
    "name": "Turn Indicator Right",
    "shape": "cylinder",
    "size": [2, 8, 8],
    "offset": [575, 55, 95],
    "rotation": [0, 0, 90],
    "color": "#d97706"
  },
  {
    "id": "taillight-l",
    "name": "Tail Light Left",
    "shape": "cylinder",
    "size": [2, 10, 10],
    "offset": [-575, 55, -90],
    "rotation": [0, 0, 90],
    "color": "#ef4444"
  },
  {
    "id": "taillight-r",
    "name": "Tail Light Right",
    "shape": "cylinder",
    "size": [2, 10, 10],
    "offset": [-575, 55, 90],
    "rotation": [0, 0, 90],
    "color": "#ef4444"
  }
];

// Helper to generate side pillars for school bus
const generateSchoolBusPillars = () => {
  const pillars = [];
  const pillarX = [-384, -192, 0, 192, 384];
  pillarX.forEach((x, idx) => {
    pillars.push(
      {
        "id": `pillar-l-${idx}`,
        "name": `Side Pillar Left ${idx}`,
        "shape": "box",
        "size": [15, 5, 130],
        "offset": [x, 130, -110],
        "rotation": [0, 0, 0],
        "color": "#eab308"
      },
      {
        "id": `pillar-r-${idx}`,
        "name": `Side Pillar Right ${idx}`,
        "shape": "box",
        "size": [15, 5, 130],
        "offset": [x, 130, 110],
        "rotation": [0, 0, 0],
        "color": "#eab308"
      }
    );
  });
  return pillars;
};

// Helper to generate seat layout for school bus
const generateSchoolBusSeats = () => {
  const seats = [];
  const zOffsets = [-70, 70];
  const seatX = [330, 230, 130, 30, -70, -170, -270, -370, -470];

  seatX.forEach((x, idx) => {
    zOffsets.forEach((z, zIdx) => {
      // Don't place a seat on the right side next to the middle passenger door (X = 0)
      if (Math.abs(x) < 50 && z === 70) return;
      // Don't place a seat on the right side next to the front door (X = 480)
      if (x > 400 && z === 70) return;

      const idPrefix = `sb-seat-${idx}-${zIdx}`;
      seats.push(
        {
          "id": `${idPrefix}-stand`,
          "name": `Seat Stand ${idx}-${zIdx}`,
          "shape": "cylinder",
          "size": [10, 10, 20],
          "offset": [x, 30, z],
          "color": "#1e293b"
        },
        {
          "id": `${idPrefix}-cushion`,
          "name": `Seat Cushion ${idx}-${zIdx}`,
          "shape": "box",
          "size": [35, 35, 8],
          "offset": [x, 50, z],
          "color": "#b45309" // Algerian orange-brown vinyl seats
        },
        {
          "id": `${idPrefix}-back`,
          "name": `Seat Backrest ${idx}-${zIdx}`,
          "shape": "box",
          "size": [8, 35, 40],
          "offset": [x - 13, 58, z],
          "rotation": [0, 0, 5],
          "color": "#b45309"
        }
      );
    });
  });

  return seats;
};

const schoolBusParts = [
  ...schoolBusBaseParts,
  ...generateSchoolBusPillars(),
  ...generateSchoolBusSeats()
];

// Helper to generate stair steps for double decker
const doubleDeckerStairs = [];
for (let i = 0; i < 6; i++) {
  const stepH = 28.3; // 170 / 6
  const stepL = 16.6; // 100 / 6
  const currentH = (i + 1) * stepH;
  const currentX = -330 - (i * stepL);
  doubleDeckerStairs.push({
    "id": `stair-step-${i+1}`,
    "name": `Stair Step ${i+1}`,
    "shape": "box",
    "size": [stepL, 60, currentH],
    "offset": [currentX, 30, -60],
    "rotation": [0, 0, 0],
    "color": "#4b5563",
    "opacity": 0.9,
    "roughness": 0.8
  });
}

// Helper to generate seat layout for double decker
const generateDoubleDeckerSeats = () => {
  const seats = [];
  const zOffsets = [-60, 60];

  // Lower deck seats (floor Y = 30)
  const lowerX = [200, 100, 0, -100];
  lowerX.forEach((x, idx) => {
    zOffsets.forEach((z, zIdx) => {
      const idPrefix = `ld-seat-${idx}-${zIdx}`;
      seats.push(
        {
          "id": `${idPrefix}-stand`,
          "name": `Lower Seat Stand ${idx}-${zIdx}`,
          "shape": "cylinder",
          "size": [10, 10, 20],
          "offset": [x, 30, z],
          "color": "#1e293b"
        },
        {
          "id": `${idPrefix}-cushion`,
          "name": `Lower Seat Cushion ${idx}-${zIdx}`,
          "shape": "box",
          "size": [30, 30, 8],
          "offset": [x, 50, z],
          "color": "#475569"
        },
        {
          "id": `${idPrefix}-back`,
          "name": `Lower Seat Backrest ${idx}-${zIdx}`,
          "shape": "box",
          "size": [8, 30, 35],
          "offset": [x - 11, 58, z],
          "rotation": [0, 0, 5],
          "color": "#475569"
        }
      );
    });
  });

  // Upper deck seats (floor Y = 210)
  const upperX = [410, 330, 250, 170, 90, 10, -70, -150];
  upperX.forEach((x, idx) => {
    zOffsets.forEach((z, zIdx) => {
      // Avoid placing seats where the stairs land (rear left)
      if (x < -100 && z === -60) return;

      const idPrefix = `ud-seat-${idx}-${zIdx}`;
      seats.push(
        {
          "id": `${idPrefix}-stand`,
          "name": `Upper Seat Stand ${idx}-${zIdx}`,
          "shape": "cylinder",
          "size": [10, 10, 20],
          "offset": [x, 210, z],
          "color": "#1e293b"
        },
        {
          "id": `${idPrefix}-cushion`,
          "name": `Upper Seat Cushion ${idx}-${zIdx}`,
          "shape": "box",
          "size": [30, 30, 8],
          "offset": [x, 230, z],
          "color": "#b91c1c" // London bus red velvet seats
        },
        {
          "id": `${idPrefix}-back`,
          "name": `Upper Seat Backrest ${idx}-${zIdx}`,
          "shape": "box",
          "size": [8, 30, 35],
          "offset": [x - 11, 238, z],
          "rotation": [0, 0, 5],
          "color": "#b91c1c"
        }
      );
    });
  });

  return seats;
};

const doubleDeckerBaseParts = [
  {
    "id": "floor-1",
    "name": "Lower Deck Floor",
    "shape": "box",
    "size": [910, 214, 10],
    "offset": [0, 20, 0],
    "rotation": [0, 0, 0],
    "color": "#3A3D40",
    "opacity": 1,
    "metalness": 0.2,
    "roughness": 0.8
  },
  {
    "id": "wheel-1",
    "name": "Wheel Front Left",
    "shape": "wheel",
    "size": [80, 25, 80],
    "offset": [220, 0, -92],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-2",
    "name": "Wheel Front Right",
    "shape": "wheel",
    "size": [80, 25, 80],
    "offset": [220, 0, 92],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-3",
    "name": "Wheel Rear Left",
    "shape": "wheel",
    "size": [80, 25, 80],
    "offset": [-220, 0, -92],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "wheel-4",
    "name": "Wheel Rear Right",
    "shape": "wheel",
    "size": [80, 25, 80],
    "offset": [-220, 0, 92],
    "rotation": [90, 0, 0],
    "color": "#111827"
  },
  {
    "id": "lower-body-left-deck1",
    "name": "Lower Deck Wall Left",
    "shape": "box",
    "size": [910, 4, 80],
    "offset": [0, 30, -105],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-right-deck1",
    "name": "Lower Deck Wall Right",
    "shape": "box",
    "size": [910, 4, 80],
    "offset": [0, 30, 105],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-rear-deck1",
    "name": "Lower Deck Wall Rear",
    "shape": "box",
    "size": [4, 214, 80],
    "offset": [-453, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "front-nose-deck1",
    "name": "Lower Deck Front Nose",
    "shape": "box",
    "size": [4, 214, 80],
    "offset": [453, 30, 0],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "upper-body-glass-left-deck1",
    "name": "Lower Deck Glass Left",
    "shape": "window",
    "size": [910, 4, 90],
    "offset": [0, 110, -105],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "upper-body-glass-right-deck1",
    "name": "Lower Deck Glass Right",
    "shape": "window",
    "size": [910, 4, 105],
    "offset": [0, 110, 105],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "windshield-deck1",
    "name": "Lower Deck Windshield",
    "shape": "window",
    "size": [4, 214, 90],
    "offset": [453, 110, 0],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "floor-2",
    "name": "Upper Deck Floor",
    "shape": "box",
    "size": [910, 214, 10],
    "offset": [0, 200, 0],
    "rotation": [0, 0, 0],
    "color": "#3A3D40",
    "opacity": 1,
    "metalness": 0.2,
    "roughness": 0.8
  },
  {
    "id": "lower-body-left-deck2",
    "name": "Upper Deck Wall Left",
    "shape": "box",
    "size": [910, 4, 60],
    "offset": [0, 210, -105],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-right-deck2",
    "name": "Upper Deck Wall Right",
    "shape": "box",
    "size": [910, 4, 60],
    "offset": [0, 210, 105],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "lower-body-rear-deck2",
    "name": "Upper Deck Wall Rear",
    "shape": "box",
    "size": [4, 214, 60],
    "offset": [-453, 210, 0],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "front-nose-deck2",
    "name": "Upper Deck Front Nose",
    "shape": "box",
    "size": [4, 214, 60],
    "offset": [453, 210, 0],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "upper-body-glass-left-deck2",
    "name": "Upper Deck Glass Left",
    "shape": "window",
    "size": [910, 4, 110],
    "offset": [0, 270, -105],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "upper-body-glass-right-deck2",
    "name": "Upper Deck Glass Right",
    "shape": "window",
    "size": [910, 4, 110],
    "offset": [0, 270, 105],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "windshield-deck2",
    "name": "Upper Deck Windshield",
    "shape": "window",
    "size": [4, 214, 110],
    "offset": [453, 270, 0],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.05,
    "metalness": 0.9,
    "roughness": 0.1
  },
  {
    "id": "high-roof-lower",
    "name": "Roof Lower Panel",
    "shape": "box",
    "size": [910, 214, 5],
    "offset": [0, 380, 0],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "high-roof-upper",
    "name": "Roof Upper Cap",
    "shape": "box",
    "size": [890, 204, 15],
    "offset": [0, 382.5, 0],
    "rotation": [0, 0, 0],
    "color": "#dc2626",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "front-bumper",
    "name": "Front Bumper",
    "shape": "box",
    "size": [30, 214, 30],
    "offset": [468, 10, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "rear-bumper",
    "name": "Rear Bumper",
    "shape": "box",
    "size": [30, 214, 30],
    "offset": [-468, 10, 0],
    "rotation": [0, 0, 0],
    "color": "#1f2937"
  },
  {
    "id": "passenger-door",
    "name": "Left Entry Door",
    "shape": "box",
    "size": [100, 4, 170],
    "offset": [350, 30, -106],
    "rotation": [0, 0, 0],
    "color": "#1e3a8a",
    "opacity": 0.15,
    "metalness": 0.2,
    "roughness": 0.7
  },
  {
    "id": "route-screen-deck1",
    "name": "Lower Route Board Screen",
    "shape": "box",
    "size": [4, 80, 20],
    "offset": [454, 80, 0],
    "color": "#111827"
  },
  {
    "id": "route-text-deck1",
    "name": "Route Display text Lower",
    "shape": "text",
    "textString": "15 LONDON",
    "size": [12, 10, 2],
    "offset": [457, 90, 0],
    "rotation": [0, 90, 0],
    "color": "#f59e0b"
  },
  {
    "id": "route-screen-deck2",
    "name": "Upper Route Board Screen",
    "shape": "box",
    "size": [4, 80, 20],
    "offset": [454, 340, 0],
    "color": "#111827"
  },
  {
    "id": "route-text-deck2",
    "name": "Route Display text Upper",
    "shape": "text",
    "textString": "KOUINI CARAVANE",
    "size": [8, 10, 2],
    "offset": [457, 350, 0],
    "rotation": [0, 90, 0],
    "color": "#f59e0b"
  },
  {
    "id": "headlight-l",
    "name": "Headlight Left",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [455, 45, -70],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "headlight-r",
    "name": "Headlight Right",
    "shape": "cylinder",
    "size": [2, 12, 12],
    "offset": [455, 45, 70],
    "rotation": [0, 0, 90],
    "color": "#ffffff"
  },
  {
    "id": "taillight-l",
    "name": "Tail Light Left",
    "shape": "cylinder",
    "size": [2, 10, 10],
    "offset": [-455, 45, -80],
    "rotation": [0, 0, 90],
    "color": "#ef4444"
  },
  {
    "id": "taillight-r",
    "name": "Tail Light Right",
    "shape": "cylinder",
    "size": [2, 10, 10],
    "offset": [-455, 45, 80],
    "rotation": [0, 0, 90],
    "color": "#ef4444"
  },
  {
    "id": "driver-dashboard",
    "name": "Driver Dashboard Panel",
    "shape": "box",
    "size": [40, 70, 40],
    "offset": [410, 30, 60],
    "color": "#22252A"
  },
  {
    "id": "driver-steering-wheel",
    "name": "Steering Wheel",
    "shape": "cylinder",
    "size": [25, 25, 5],
    "offset": [395, 80, 60],
    "rotation": [0, 0, 45],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-stand",
    "name": "Driver Seat Base",
    "shape": "cylinder",
    "size": [12, 12, 20],
    "offset": [350, 30, 60],
    "color": "#1E293B"
  },
  {
    "id": "driver-seat-cushion",
    "name": "Driver Seat Cushion",
    "shape": "box",
    "size": [35, 35, 8],
    "offset": [350, 50, 60],
    "color": "#22252A"
  },
  {
    "id": "driver-seat-back",
    "name": "Driver Seat Backrest",
    "shape": "box",
    "size": [8, 35, 40],
    "offset": [331, 58, 60],
    "rotation": [0, 0, 5],
    "color": "#22252A"
  },
  {
    "id": "wheel-arch-front-l",
    "name": "Wheel Arch Front Left",
    "shape": "box",
    "size": [100, 30, 20],
    "offset": [220, 30, -92],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-front-r",
    "name": "Wheel Arch Front Right",
    "shape": "box",
    "size": [100, 30, 20],
    "offset": [220, 30, 92],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-rear-l",
    "name": "Wheel Arch Rear Left",
    "shape": "box",
    "size": [100, 30, 20],
    "offset": [-220, 30, -92],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  },
  {
    "id": "wheel-arch-rear-r",
    "name": "Wheel Arch Rear Right",
    "shape": "box",
    "size": [100, 30, 20],
    "offset": [-220, 30, 92],
    "rotation": [0, 0, 0],
    "color": "#4B5563"
  }
];

const doubleDeckerParts = [
  ...doubleDeckerBaseParts,
  ...doubleDeckerStairs,
  ...generateDoubleDeckerSeats()
];

const baseChassisPath = path.join(__dirname, '../client/src/data/baseChassis.json');

async function run() {
  try {
    // 1. Update the local JSON backup file first
    console.log(`Reading local JSON backup from ${baseChassisPath}...`);
    let data = [];
    if (fs.existsSync(baseChassisPath)) {
      data = JSON.parse(fs.readFileSync(baseChassisPath, 'utf8'));
    } else {
      throw new Error(`Could not find baseChassis.json at ${baseChassisPath}`);
    }

    // Apply updates to existing records (Mercedes Sprinter static array)
    data = data.map(ch => {
      if (ch.id === 'sprinter-144') {
        ch.parts = sprinterParts;
        console.log(`Reset Mercedes Sprinter 144" ('sprinter-144') parts to static coordinates to fix compounding floating Y.`);
      } else if (ch.id === 'transit-148') {
        ch.parts = transitParts;
        console.log(`Updated parts list for Ford Transit L3H2 ('transit-148') in JSON.`);
      } else if (ch.id === 'promaster-136') {
        ch.parts = masterParts;
        ch.chassisType = 'l3h2';
        console.log(`Updated parts list & class for Renault Master L2H2 ('promaster-136') in JSON.`);
      }
      return ch;
    });

    // Check if school bus already exists, if not add it
    const schoolBusIndex = data.findIndex(ch => ch.id === 'snvi-100-v8');
    const schoolBusData = {
      "id": "snvi-100-v8",
      "name": "SNVI 100 V8 School Bus",
      "class": "maxi-bus",
      "chassisType": "minibus",
      "details": "Algerian rear-engine Deutz V8 air-cooled school bus.",
      "specs": {
        "length": "11.52m",
        "height": "2.92m",
        "payload": "12000kg"
      },
      "defaultL": 1152,
      "defaultW": 250,
      "defaultH": 292,
      "states": ["default"],
      "parts": schoolBusParts
    };

    if (schoolBusIndex >= 0) {
      data[schoolBusIndex] = schoolBusData;
      console.log(`Updated SNVI 100 V8 School Bus ('snvi-100-v8') in JSON.`);
    } else {
      data.push(schoolBusData);
      console.log(`Added SNVI 100 V8 School Bus ('snvi-100-v8') to JSON.`);
    }

    // Check if double decker already exists, if not add it
    const ddIndex = data.findIndex(ch => ch.id === 'uk-double-decker');
    const ddData = {
      "id": "uk-double-decker",
      "name": "UK Double-Decker Bus",
      "class": "maxi-bus",
      "chassisType": "minibus",
      "details": "Classic London double-decker bus chassis.",
      "specs": {
        "length": "9.1m",
        "height": "4.0m",
        "payload": "9500kg"
      },
      "defaultL": 910,
      "defaultW": 240,
      "defaultH": 400,
      "states": ["default"],
      "parts": doubleDeckerParts
    };

    if (ddIndex >= 0) {
      data[ddIndex] = ddData;
      console.log(`Updated UK Double-Decker Bus ('uk-double-decker') in JSON.`);
    } else {
      data.push(ddData);
      console.log(`Added UK Double-Decker Bus ('uk-double-decker') to JSON.`);
    }

    fs.writeFileSync(baseChassisPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully wrote updated baseChassis.json!`);

    // 2. Connect to MongoDB and update documents directly
    console.log(`Connecting to MongoDB at: ${process.env.MONGODB_URI}`);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');

    // Update existing
    await Chassis.findOneAndUpdate(
      { id: 'sprinter-144' },
      { parts: sprinterParts },
      { returnDocument: 'after' }
    );
    console.log(`Successfully updated Sprinter 144" directly in MongoDB.`);

    await Chassis.findOneAndUpdate(
      { id: 'transit-148' },
      { parts: transitParts },
      { returnDocument: 'after' }
    );
    console.log(`Successfully updated Ford Transit directly in MongoDB.`);

    await Chassis.findOneAndUpdate(
      { id: 'promaster-136' },
      { parts: masterParts, chassisType: 'l3h2' },
      { returnDocument: 'after' }
    );
    console.log(`Successfully updated Renault Master directly in MongoDB.`);

    // Upsert School Bus in MongoDB
    await Chassis.findOneAndUpdate(
      { id: 'snvi-100-v8' },
      schoolBusData,
      { upsert: true, new: true, returnDocument: 'after' }
    );
    console.log(`Successfully upserted SNVI 100 V8 School Bus directly in MongoDB.`);

    // Upsert Double Decker in MongoDB
    await Chassis.findOneAndUpdate(
      { id: 'uk-double-decker' },
      ddData,
      { upsert: true, new: true, returnDocument: 'after' }
    );
    console.log(`Successfully upserted UK Double-Decker Bus directly in MongoDB.`);

  } catch (err) {
    console.error('An error occurred during update:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Mongoose connection disconnected.');
  }
}

run();
