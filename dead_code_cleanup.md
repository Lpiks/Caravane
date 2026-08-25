# Dead Code Cleanup Plan

Here is the complete list of files and code snippets that are currently unused in the project. These can be safely deleted to clean up the repository.

## 1. Server-Side: Unused Utility Scripts
These are one-off or backup scripts located in the `server/` root. They are not imported or used by the main Express application.

- [ ] [backup_db_components.js](file:///d:/Programmation/Project-Web/Kouini%20Caravane/server/backup_db_components.js)
- [ ] [convert_sprinter.js](file:///d:/Programmation/Project-Web/Kouini%20Caravane/server/convert_sprinter.js)
- [ ] [query_components.js](file:///d:/Programmation/Project-Web/Kouini%20Caravane/server/query_components.js)
- [ ] [update_chassis_pro.js](file:///d:/Programmation/Project-Web/Kouini%20Caravane/server/update_chassis_pro.js)

## 2. Client-Side: Dead Data Files
These files in `client/src/data/` were used for initial mockups or backups, but the app now fetches data directly from the API.

- [ ] [mockDesign.json](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/data/mockDesign.json)
- [ ] [templates.js](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/data/templates.js)
- [ ] [vehicles.js](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/data/vehicles.js)
- [ ] [baseChassis.json.bak](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/data/baseChassis.json.bak)

## 3. Client-Side: Unused 3D Component Shapes
Since the 3D studio now uses the database-driven procedural engine (iterating over `mod.parts`), all of the old hardcoded JSX shape files are entirely obsolete.

**Bathroom**
- [ ] CassetteToiletShape.jsx
- [ ] GreyWaterTankShape.jsx
- [ ] ShowerCabinShape.jsx

**Climate**
- [ ] MaxxairFanShape.jsx
- [ ] OverheadLockerShape.jsx
- [ ] PopTopRoofShape.jsx
- [ ] RoofACShape.jsx
- [ ] SideAwningShape.jsx
- [ ] SolarArrayShape.jsx

**Kitchen**
- [ ] CooktopShape.jsx
- [ ] GasLockerShape.jsx
- [ ] KitchenGalleyShape.jsx
- [ ] UprightFridgeShape.jsx

**Living**
- [ ] DinetteSeatingShape.jsx
- [ ] EngineCushionShape.jsx
- [ ] FixedBedShape.jsx
- [ ] LagunTableShape.jsx
- [ ] SofaBedShape.jsx
- [ ] SwivelSeatShape.jsx
- [ ] TallWardrobeShape.jsx

**Power**
- [ ] BatteryBankShape.jsx
- [ ] ControlPanelShape.jsx
- [ ] DieselHeaterShape.jsx
- [ ] InverterHubShape.jsx
- [ ] WaterTankShape.jsx

*Note: All these files are located in `client/src/components/studio/shapes/` within their respective subdirectories.*

## 4. Client-Side: Unused Fallback Van Shapes
As discussed, you have a new idea for handling fallbacks, so these static van shape components are marked for deletion as well:

- [ ] [CompactClassicShape.jsx](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/components/studio/shapes/VanShapes/CompactClassicShape.jsx)
- [ ] [StandardHighRoofShape.jsx](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/components/studio/shapes/VanShapes/StandardHighRoofShape.jsx)
- [ ] [MinibusCanvasShape.jsx](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/components/studio/shapes/VanShapes/MinibusCanvasShape.jsx)

## 5. Client-Side: Dead Lines of Code to Remove
When we delete the files above, we must also clean up the files that still reference them (even if commented out).

### [ModuleMesh3D.jsx](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/components/studio/ModuleMesh3D.jsx)
- [ ] **Lines 5 to 29**: Remove the 25 unused `import` statements for the shapes.
- [ ] **Lines 76 to 171**: Remove the huge commented-out `/* ... */` block that used to render these shapes.

### [VehicleModel.jsx](file:///d:/Programmation/Project-Web/Kouini%20Caravane/client/src/components/3d/VehicleModel.jsx)
- [ ] **Line 14**: Remove the commented-out `import { getStudioTemplates } from "@/data/templates";`.
- [ ] **Lines 9 to 11**: Remove the imports for the fallback VanShapes (`CompactClassicShape`, `StandardHighRoofShape`, `MinibusCanvasShape`).
- [ ] **Lines 146 to 204**: Refactor or remove the fallback logic that renders these shapes when the DB chassis is not found.
