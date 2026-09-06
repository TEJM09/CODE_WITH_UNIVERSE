import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Code2,
  Play,
  RotateCcw,
  Terminal,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';
import { PracticeResult } from '../types';
import { sound } from '../utils/audio';

const PRACTICE_TEMPLATES = [
  {
    id: 'hello',
    name: '1. Basics & I/O',
    stdin: 'Nexus',
    code: `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Enter your Guardian Name: ";
    if (std::cin >> name) {
        std::cout << "Greetings, Guardian " << name << "! Welcome to the C++ CodeVerse." << std::endl;
    } else {
        std::cout << "Greetings, Code Guardian! Welcome to the C++ CodeVerse." << std::endl;
    }
    return 0;
}`,
  },
  {
    id: 'math_io',
    name: '2. Multi-Input Stream',
    stdin: '4\n15 25 35 45',
    code: `#include <iostream>

int main() {
    int count;
    std::cout << "Reading stream count..." << std::endl;
    if (std::cin >> count) {
        long long sum = 0;
        for (int i = 0; i < count; ++i) {
            int val;
            std::cin >> val;
            sum += val;
            std::cout << "Packet " << (i + 1) << ": " << val << std::endl;
        }
        std::cout << "Total Stream Sum: " << sum << std::endl;
    } else {
        std::cout << "No stream count provided." << std::endl;
    }
    return 0;
}`,
  },
  {
    id: 'oop',
    name: '3. OOP & Classes',
    stdin: '',
    code: `#include <iostream>
#include <string>

class CodeGuardian {
private:
    std::string name;
    int energyLevel;

public:
    CodeGuardian(std::string n, int energy) : name(n), energyLevel(energy) {}

    void castSpell(int cost) {
        if (energyLevel >= cost) {
            energyLevel -= cost;
            std::cout << name << " cast a logic strike! Remaining energy: " << energyLevel << std::endl;
        } else {
            std::cout << name << " lacks enough energy for this spell!" << std::endl;
        }
    }

    void displayStatus() const {
        std::cout << "[Guardian: " << name << " | Energy: " << energyLevel << "]" << std::endl;
    }
};

int main() {
    CodeGuardian hero("Astra", 100);
    hero.displayStatus();
    hero.castSpell(30);
    hero.castSpell(50);
    hero.displayStatus();
    return 0;
}`,
  },
  {
    id: 'polymorphism',
    name: '4. Polymorphism',
    stdin: '',
    code: `#include <iostream>
#include <vector>
#include <memory>

class Entity {
public:
    virtual void attack() const = 0;
    virtual ~Entity() = default;
};

class QuantumWizard : public Entity {
public:
    void attack() const override {
        std::cout << "QuantumWizard unleashes a polymorphic wavelength laser!" << std::endl;
    }
};

class BinaryKnight : public Entity {
public:
    void attack() const override {
        std::cout << "BinaryKnight strikes with an encapsulated bit-shield!" << std::endl;
    }
};

int main() {
    std::vector<std::unique_ptr<Entity>> party;
    party.push_back(std::make_unique<QuantumWizard>());
    party.push_back(std::make_unique<BinaryKnight>());

    for (const auto& member : party) {
        member->attack();
    }
    return 0;
}`,
  },
  {
    id: 'pointers',
    name: '5. Heap & Pointers',
    stdin: '',
    code: `#include <iostream>

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);

    std::cout << "Traversing Linked Nodes in Heap Memory: " << std::endl;
    Node* curr = head;
    while (curr != nullptr) {
        std::cout << "Node value: " << curr->value << std::endl;
        curr = curr->next;
    }

    // Clean up dynamic heap
    while (head != nullptr) {
        Node* temp = head;
        head = head->next;
        delete temp;
    }
    std::cout << "Memory safely freed." << std::endl;
    return 0;
}`,
  },
  {
    id: 'stl',
    name: '6. STL Containers',
    stdin: '',
    code: `#include <iostream>
#include <vector>
#include <map>
#include <algorithm>

int main() {
    std::vector<int> scores = {95, 42, 88, 100, 73};
    std::sort(scores.begin(), scores.end(), std::greater<int>());

    std::cout << "Sorted Guardian Leaderboard Scores:" << std::endl;
    for (int s : scores) {
        std::cout << "- " << s << std::endl;
    }

    std::map<std::string, std::string> universeTopics;
    universeTopics["World 1"] = "Variables & Syntax";
    universeTopics["World 3"] = "OOP Classes";
    universeTopics["World 7"] = "STL Containers";

    std::cout << "\\nUniverse Curriculum Mapping:" << std::endl;
    for (const auto& pair : universeTopics) {
        std::cout << pair.first << " -> " << pair.second << std::endl;
    }
    return 0;
}`,
  },
];

export const PracticeSandbox: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(PRACTICE_TEMPLATES[0].id);
  const [code, setCode] = useState(PRACTICE_TEMPLATES[0].code);
  const [stdin, setStdin] = useState(PRACTICE_TEMPLATES[0].stdin);
  const [isCompiling, setIsCompiling] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);

  const handleSelectTemplate = (tplId: string) => {
    sound.playClick();
    setSelectedTemplate(tplId);
    const tpl = PRACTICE_TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setCode(tpl.code);
      setStdin(tpl.stdin ?? '');
      setResult(null);
    }
  };

  const handleRun = async () => {
    sound.playLaser();
    setIsCompiling(true);
    setResult(null);

    try {
      const res = await api.compilePracticeCode(code, stdin);
      setResult(res);
      if (res.success) {
        sound.playVictory();
      } else {
        sound.playError();
      }
    } catch (err: any) {
      sound.playError();
      setResult({
        success: false,
        stdout: '',
        stderr: 'Connection error to C++ compiler service.',
        compileError: 'Compiler invocation failed',
        executionTimeMs: 0,
        metrics: {
          linesOfCode: code.split('\n').length,
          hasOOP: false,
          hasPointers: false,
          hasSTL: false,
          cppStandard: 'C++17',
        },
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#7C3AED] text-xs font-mono font-bold tracking-wider mb-2">
            <Code2 className="w-3.5 h-3.5" /> STANDALONE C++17 SANDBOX
          </div>
          <h1 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white">
            PRACTICE LAB & AST CODE ANALYZER
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono mt-0.5">
            Test any C++ code with custom STDIN input, instant compiler diagnostics, and AST metrics.
          </p>
        </div>

        <button
          id="practice-run-btn"
          onClick={handleRun}
          disabled={isCompiling}
          className="px-6 py-3 rounded-2xl font-['Orbitron'] text-xs font-bold text-black bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isCompiling ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              COMPILING...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black" /> EXECUTE C++ CODE
            </>
          )}
        </button>
      </div>

      {/* Preset Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono text-gray-400 whitespace-nowrap mr-2 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> PRESETS:
        </span>
        {PRACTICE_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            id={`practice-preset-${tpl.id}`}
            onClick={() => handleSelectTemplate(tpl.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
              selectedTemplate === tpl.id
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                : 'bg-[#111827] text-gray-400 hover:text-gray-200 border border-[#1F2937]'
            }`}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Code Editor & I/O Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monaco Editor (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#111827] border border-[#1F2937] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 bg-[#0B1120] border-b border-[#1F2937]">
            <span className="text-xs font-mono text-gray-300 font-bold flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" /> main.cpp
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setCode('');
              }}
              className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Editor
            </button>
          </div>

          <div className="min-h-[460px] w-full bg-[#070B14]">
            <Editor
              height="460px"
              defaultLanguage="cpp"
              language="cpp"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Input, Output & AST Analyzer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Custom Stdin Box */}
          <div className="rounded-3xl bg-[#111827] border border-[#1F2937] p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
                <span>CUSTOM STDIN (STANDARD INPUT)</span>
                <span className="text-[10px] text-[#00E5FF] px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                  std::cin stream
                </span>
              </label>
              {stdin && (
                <button
                  type="button"
                  onClick={() => setStdin('')}
                  className="text-[10px] font-mono text-gray-400 hover:text-white"
                >
                  Clear STDIN
                </button>
              )}
            </div>

            <textarea
              id="practice-stdin-input"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide user inputs to be piped into std::cin (separate tokens by space or newline)..."
              rows={3}
              className="w-full p-3 bg-[#070B14] border border-[#1F2937] rounded-xl text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#00E5FF]"
            />

            {/* Quick Stdin Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-mono text-gray-500 mr-1">Quick Input:</span>
              <button
                type="button"
                onClick={() => setStdin('Nexus')}
                className="px-2 py-0.5 rounded-lg bg-[#0B1120] hover:bg-[#1F2937] border border-[#1F2937] text-[10px] font-mono text-gray-300 transition-colors"
              >
                "Nexus"
              </button>
              <button
                type="button"
                onClick={() => setStdin('10 20')}
                className="px-2 py-0.5 rounded-lg bg-[#0B1120] hover:bg-[#1F2937] border border-[#1F2937] text-[10px] font-mono text-gray-300 transition-colors"
              >
                "10 20"
              </button>
              <button
                type="button"
                onClick={() => setStdin('4\n15 25 35 45')}
                className="px-2 py-0.5 rounded-lg bg-[#0B1120] hover:bg-[#1F2937] border border-[#1F2937] text-[10px] font-mono text-gray-300 transition-colors"
              >
                "4 \n 15 25 35 45"
              </button>
            </div>
          </div>

          {/* AST & C++ Metrics Card */}
          {result?.metrics && (
            <div className="rounded-3xl bg-[#111827] border border-[#1F2937] p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h3 className="font-['Orbitron'] text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#00FFB2]" /> C++ AST & PARADIGM METRICS
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl flex items-center justify-between">
                  <span className="text-gray-400">Lines:</span>
                  <span className="text-white font-bold">{result.metrics.linesOfCode}</span>
                </div>
                <div className="p-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl flex items-center justify-between">
                  <span className="text-gray-400">Standard:</span>
                  <span className="text-[#00E5FF] font-bold">{result.metrics.cppStandard}</span>
                </div>
                <div className="p-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl flex items-center justify-between">
                  <span className="text-gray-400">OOP Classes:</span>
                  <span className={result.metrics.hasOOP ? 'text-[#00FFB2]' : 'text-gray-500'}>
                    {result.metrics.hasOOP ? 'Detected' : 'None'}
                  </span>
                </div>
                <div className="p-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl flex items-center justify-between">
                  <span className="text-gray-400">STL / Pointers:</span>
                  <span className={result.metrics.hasSTL || result.metrics.hasPointers ? 'text-[#FFD166]' : 'text-gray-500'}>
                    {result.metrics.hasSTL ? 'STL Used' : result.metrics.hasPointers ? 'Pointers' : 'Primitive'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Execution Output Box */}
          <div className="rounded-3xl bg-[#0B1120] border border-[#1F2937] p-5 shadow-[0_0_24px_rgba(0,0,0,0.6)] min-h-[220px]">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-3">
              <span className="font-['Orbitron'] text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" /> STDOUT / STDERR CONSOLE
              </span>
              {result && (
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    result.success
                      ? 'bg-[#00FFB2]/10 border-[#00FFB2]/40 text-[#00FFB2]'
                      : 'bg-[#FF4D6D]/10 border-[#FF4D6D]/40 text-[#FF4D6D]'
                  }`}>
                    {result.success ? 'Exit Code 0 (Success)' : 'Failed'}
                  </span>
                  <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" /> {result.executionTimeMs}ms
                  </span>
                </div>
              )}
            </div>

            <div className="font-mono text-xs space-y-2">
              {!result && !isCompiling && (
                <p className="text-gray-500 italic py-6 text-center">
                  Press "EXECUTE C++ CODE" to compile and run with custom STDIN.
                </p>
              )}

              {isCompiling && (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <span className="w-5 h-5 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
                  <span>Compiling C++ binary & piping stream...</span>
                </div>
              )}

              {result && (
                <div className="space-y-3">
                  {result.stdout ? (
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="text-[#00FFB2] font-bold">STDOUT (STANDARD OUTPUT):</span>
                        <span className="text-gray-500">{result.stdout.length} chars</span>
                      </div>
                      <pre className="p-3 rounded-xl bg-[#070B14] border border-[#1F2937] text-[#00FFB2] font-mono whitespace-pre-wrap selection:bg-[#00FFB2]/20">
                        {result.stdout}
                      </pre>
                    </div>
                  ) : !result.compileError && !result.stderr ? (
                    <div className="p-3 rounded-xl bg-[#070B14] border border-[#1F2937] text-gray-400 font-mono text-xs">
                      Program executed successfully with exit code 0. (No output printed to stdout)
                    </div>
                  ) : null}

                  {(result.compileError || result.stderr) && (
                    <div>
                      <span className="text-[10px] text-[#FF4D6D] font-bold block mb-1">DIAGNOSTICS / STDERR:</span>
                      <pre className="p-3 rounded-xl bg-[#070B14] border border-[#FF4D6D]/30 text-[#FF4D6D] whitespace-pre-wrap">
                        {result.compileError || result.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
