'use client';

import React, { useState } from 'react';
import { Clipboard, Check, Terminal, Info, AlertTriangle, Blocks, Truck } from 'lucide-react';

export default function DocsClient() {
  const [copied, setCopied] = useState(false);
  const [copiedVan, setCopiedVan] = useState(false);

  const aiPrompt = `You are an expert 3D procedural architect for Kouini Caravane. My goal is to build 3D components using an array of primitive objects.

Your job is to take my design idea and output ONLY a valid JSON array of objects that represent the parts. 

RULES:
1. Supported shapes: "box", "cylinder", "sphere", "wedge", "window", "wheel".
2. Array format: [ { "id": "part-1", "name": "...", "shape": "box", "size": [X, Z, Y], "offset": [X, Y, Z], "rotation": [X, Y, Z], "color": "#HEX", "opacity": 1 } ]
3. Size is [Width, Depth, Height] in centimeters.
4. Offset is [X, Y, Z]. X and Z represent the center of the object. Y represents the BOTTOM of the object (so Y=0 means it rests exactly on the floor).
5. Colors should use hex codes (e.g., #4b5563 for dark grey, #8B4513 for wood).

EXAMPLE:
User: "Build a simple table with 4 legs and a top surface."
Assistant:
[
  { "id": "part-1", "name": "Table Top", "shape": "box", "size": [100, 60, 5], "offset": [0, 75, 0], "rotation": [0, 0, 0], "color": "#8B4513" },
  { "id": "part-2", "name": "Leg Front Left", "shape": "cylinder", "size": [5, 5, 75], "offset": [-45, 0, 25], "rotation": [0, 0, 0], "color": "#111111" },
  { "id": "part-3", "name": "Leg Front Right", "shape": "cylinder", "size": [5, 5, 75], "offset": [45, 0, 25], "rotation": [0, 0, 0], "color": "#111111" },
  { "id": "part-4", "name": "Leg Back Left", "shape": "cylinder", "size": [5, 5, 75], "offset": [-45, 0, -25], "rotation": [0, 0, 0], "color": "#111111" },
  { "id": "part-5", "name": "Leg Back Right", "shape": "cylinder", "size": [5, 5, 75], "offset": [45, 0, -25], "rotation": [0, 0, 0], "color": "#111111" }
]

Now, build what I request next!`;

  const aiPromptVan = `You are an expert automotive 3D procedural architect for Kouini Caravane. My goal is to build the exterior shell of a custom van/chassis using an array of primitive objects.

Your job is to take my design idea and output ONLY a valid JSON array of objects that represent the van's parts. 

RULES:
1. Supported shapes: "box", "cylinder", "sphere", "wedge", "window", "wheel".
2. Array format: [ { "id": "part-1", "name": "...", "shape": "box", "size": [X, Z, Y], "offset": [X, Y, Z], "rotation": [X, Y, Z], "color": "#HEX", "opacity": 1, "metalness": 0.2, "roughness": 0.8 } ]
3. Size is [Length (X), Width (Z), Height (Y)] in centimeters. A typical van is ~450cm long (X), 180cm wide (Z), and 200cm tall (Y).
4. Offset is [X, Y, Z]. X is front/back (length), Z is left/right (width). Y represents the BOTTOM of the object (so Y=0 means it rests exactly on the floor).
5. CRITICAL - HOLLOW SHELL: The van MUST be hollow so furniture can be placed inside. Do NOT build solid blocks for the body. You must build thin panels (e.g., 4cm thick) for the floor, roof, and walls.
6. CRITICAL - MODULAR WALLS: Do NOT build the left/right walls as single giant pieces. You must split them into modular sections: "Front Lower", "Mid Lower", and "Rear Lower" (and corresponding separate windows). This allows deleting a mid section later for a sliding door.
7. For wheels, use "shape": "wheel" and rotate them [90, 0, 0].
8. For windows, use "shape": "window" with opacity (e.g., 0.1), color (e.g., "#1e3a8a"), metalness (0.5), and roughness (0.1).
9. Colors must be hex codes.

Now, build the van shell I request!`;

  const handleCopy = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-full bg-[#0E0F11] text-slate-300 p-8 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 relative">
        
        {/* Left Sidebar */}
        <aside className="hidden md:block w-1/4">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4">On this page</h3>
            <ul className="space-y-3 border-l border-white/5 pl-4">
              <li>
                <button onClick={() => scrollTo('purpose')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors text-left w-full">Purpose & Goal</button>
              </li>
              <li>
                <button onClick={() => scrollTo('ai-builder')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors text-left w-full">Building with AI</button>
              </li>
              <li>
                <button onClick={() => scrollTo('builders')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors text-left w-full">The Builders</button>
              </li>
              <li>
                <button onClick={() => scrollTo('shortcuts')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors text-left w-full">Keyboard Shortcuts</button>
              </li>
              <li>
                <button onClick={() => scrollTo('dashboard')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors text-left w-full">Dashboard & Fleet</button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 max-w-4xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-10">
            <h1 className="text-4xl font-black text-white tracking-tight mb-4">Kouini Caravane Platform Docs</h1>
            <p className="text-lg text-slate-400">A comprehensive guide on navigating the admin studio, using the 3D procedural builders, and scaling your fleet operations.</p>
          </div>

          {/* Purpose & Goal */}
          <section id="purpose" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-sky-400">#</span> Purpose & Goal
            </h2>
            
            <div className="bg-sky-500/10 border-l-4 border-sky-500 p-4 rounded-r-lg text-sky-100 flex gap-3">
              <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="leading-relaxed">
                  Kouini Caravane is an advanced, fully 3D-integrated SaaS platform designed to revolutionize the way caravans and custom vans are designed, visualized, and manufactured.
                </p>
              </div>
            </div>

            <ul className="space-y-4 text-slate-300 ml-4 list-disc marker:text-slate-600">
              <li><strong className="text-white">Procedural Design:</strong> Allow engineers and designers to build 3D components and full chassis models entirely in the browser using mathematical primitives.</li>
              <li><strong className="text-white">Dynamic Assembly:</strong> Assemble complex custom vans by snapping procedural components onto base chassis models.</li>
              <li><strong className="text-white">Customer Visualization:</strong> Provide customers with stunning, interactive 3D studio environments to view and configure their dream caravans before purchasing.</li>
            </ul>
          </section>

          {/* Building with AI */}
          <section id="ai-builder" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-sky-400">#</span> Building with AI
            </h2>
            
            <p className="leading-relaxed text-slate-300">
              Because the Kouini Caravane builder is powered by a clean, mathematical JSON structure, you can use any AI chatbot (like ChatGPT, Claude, or Gemini) to instantly do the heavy 3D math and design complex components for you!
            </p>
            <p className="leading-relaxed text-slate-300">
              To use AI, simply copy the <strong className="text-white">Master AI Prompt</strong> below and paste it into your favorite chatbot. Then, tell the AI your idea, and it will give you the exact JSON code to paste into the builder!
            </p>

            <div className="space-y-8 mt-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Prompt 1: Components (Furniture, Accessories)</h3>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="bg-[#0B0C10] border border-white/10 rounded-xl p-6 relative font-mono text-sm text-sky-200 overflow-x-auto shadow-2xl">
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleCopy(aiPrompt, setCopied)}
                        className="bg-white/5 hover:bg-white/10 p-2 rounded-md transition-colors text-slate-300 hover:text-white flex items-center justify-center border border-white/5"
                        title="Copy AI Prompt"
                      >
                        {copied ? <Check size={16} className="text-emerald-400" /> : <Clipboard size={16} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-slate-500 pb-2 border-b border-white/5">
                      <Terminal size={14} />
                      <span>Master AI Prompt (Component Builder)</span>
                    </div>

                    <pre className="whitespace-pre-wrap leading-loose">
                      {aiPrompt}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Prompt 2: Chassis (Van Exterior Shells)</h3>
                <p className="text-sm text-slate-400 mb-4">If you want the AI to design a full van exterior rather than just a furniture component, use this prompt instead:</p>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="bg-[#0B0C10] border border-white/10 rounded-xl p-6 relative font-mono text-sm text-emerald-200 overflow-x-auto shadow-2xl">
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleCopy(aiPromptVan, setCopiedVan)}
                        className="bg-white/5 hover:bg-white/10 p-2 rounded-md transition-colors text-slate-300 hover:text-white flex items-center justify-center border border-white/5"
                        title="Copy AI Prompt"
                      >
                        {copiedVan ? <Check size={16} className="text-emerald-400" /> : <Clipboard size={16} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-slate-500 pb-2 border-b border-white/5">
                      <Terminal size={14} />
                      <span>Master AI Prompt (Chassis Builder)</span>
                    </div>

                    <pre className="whitespace-pre-wrap leading-loose">
                      {aiPromptVan}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* The Builders */}
          <section id="builders" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-sky-400">#</span> The Builders
            </h2>
            
            <p className="leading-relaxed text-slate-300">
              The core of the Kouini Caravane platform is its bespoke 3D building tools. There are two primary builders:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#181A1D] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
                <div className="bg-sky-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-sky-400 group-hover:scale-110 transition-transform">
                  <Blocks size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Compound Builder</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Where individual parts (beds, cabinets, windows) are designed procedurally.
                </p>
                <ul className="text-sm space-y-2 text-slate-300">
                  <li className="flex items-start gap-2"><span className="text-sky-400">•</span> Primitive stacking (Boxes, Cylinders)</li>
                  <li className="flex items-start gap-2"><span className="text-sky-400">•</span> Material editing (Wood, Glass, Metal)</li>
                  <li className="flex items-start gap-2"><span className="text-sky-400">•</span> Dynamic state management</li>
                </ul>
              </div>

              <div className="bg-[#181A1D] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors group">
                <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Truck size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Chassis Builder</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Where you assemble components onto a base van frame.
                </p>
                <ul className="text-sm space-y-2 text-slate-300">
                  <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Smart snapping and placement</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Layer tracking and parts stack</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Real-time assembly preview</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section id="shortcuts" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-sky-400">#</span> Keyboard Shortcuts
            </h2>

            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg text-amber-100 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-200">Important</p>
                <p className="text-sm leading-relaxed mt-1">
                  Shortcuts are automatically disabled when you are typing inside a text box (like renaming a part) to prevent accidental deletions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111216]">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase text-slate-400 bg-white/5 border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Action</th>
                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Shortcut</th>
                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Undo</td>
                    <td className="px-6 py-4"><kbd className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-slate-300 shadow-sm font-mono tracking-wide">Ctrl + Z</kbd></td>
                    <td className="px-6 py-4">Revert your last action, movement, or deletion.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors bg-black/20">
                    <td className="px-6 py-4 font-medium text-white">Redo</td>
                    <td className="px-6 py-4">
                      <kbd className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-slate-300 shadow-sm font-mono tracking-wide">Ctrl + Shift + Z</kbd>
                    </td>
                    <td className="px-6 py-4">Redo an action you previously undid.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Duplicate (Clone)</td>
                    <td className="px-6 py-4"><kbd className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-slate-300 shadow-sm font-mono tracking-wide">Ctrl + D</kbd></td>
                    <td className="px-6 py-4">Instantly duplicates the currently selected object.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors bg-black/20">
                    <td className="px-6 py-4 font-medium text-white">Quick Duplicate</td>
                    <td className="px-6 py-4"><kbd className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-slate-300 shadow-sm font-mono tracking-wide">Shift + Drag</kbd></td>
                    <td className="px-6 py-4">Hold Shift while clicking an arrow to instantly leave a clone behind.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Delete</td>
                    <td className="px-6 py-4"><kbd className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-slate-300 shadow-sm font-mono tracking-wide">Delete</kbd></td>
                    <td className="px-6 py-4">Removes the currently selected object from the scene.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors bg-black/20">
                    <td className="px-6 py-4 font-medium text-white">Translate Mode</td>
                    <td className="px-6 py-4"><kbd className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-slate-300 shadow-sm font-mono tracking-wide">T</kbd></td>
                    <td className="px-6 py-4">Switch the 3D arrows to move the object on the X/Y/Z axis.</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Rotate Mode</td>
                    <td className="px-6 py-4"><kbd className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-slate-300 shadow-sm font-mono tracking-wide">R</kbd></td>
                    <td className="px-6 py-4">Switch the 3D arrows to rotate the object.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Dashboard & Fleet */}
          <section id="dashboard" className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-sky-400">#</span> Dashboard & Fleet
            </h2>
            
            <p className="leading-relaxed text-slate-300">
              Beyond the 3D builders, the admin panel serves as your central command center:
            </p>

            <ul className="space-y-4 text-slate-300 ml-4 list-disc marker:text-slate-600">
              <li><strong className="text-white">Dashboard Overview:</strong> High-level metrics showing active designs, fleet status, and recent customer inquiries.</li>
              <li><strong className="text-white">Fleet Inventory:</strong> Manage your physical stock of vehicles, their status, and their assigned 3D blueprints.</li>
              <li><strong className="text-white">Chassis Inventory:</strong> Manage the base empty van models that can be used in the Chassis Builder.</li>
              <li><strong className="text-white">Studio Designs:</strong> Finalized, customer-ready 3D environments that can be shared via the Public Site for marketing and sales.</li>
            </ul>
          </section>

        </main>
      </div>
    </div>
  );
}
